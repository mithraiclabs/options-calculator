import { OptionData } from "@/types/price";
import { getCurrentPrice } from "@/utils/api";
import { BS, BSHolder } from "@/utils/bs";
import { calcPriceStep, round } from "@/utils/math";
import type { NextApiRequest, NextApiResponse } from "next";

type ReqInput = {
  token: string;
  num_rows: string;
  expiry: string;
  volatility: string;
  interest_rate: string;
  min_strike?: string;
  max_strike?: string;
};

const getStrikes = (
  currentPrice: number,
  numRows: number,
  priceStep: number
): number[] => {
  const strikes = [];
  currentPrice = round(currentPrice, 2);
  for (let i = 0; i < numRows; i++) {
    const strike = round(
      currentPrice + (i - numRows / 2) * priceStep,
      priceStep < 1 ? 1 : 0
    );
    if (strike > 0) {
      strikes.push(strike);
    }
  }
  return strikes;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  const {
    token,
    num_rows,
    expiry,
    volatility,
    interest_rate,
    min_strike,
    max_strike,
  } = query as ReqInput;
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + parseFloat(expiry));

  let avePrice = 0;
  let priceStep = 0;
  if (min_strike && max_strike) {
    avePrice = (parseFloat(min_strike) + parseFloat(max_strike)) / 2;
    priceStep =
      (parseFloat(max_strike) - parseFloat(min_strike)) / parseInt(num_rows);
  } else {
    avePrice = await getCurrentPrice(token);
    priceStep = calcPriceStep(avePrice);
  }
  const strikes = getStrikes(avePrice, parseInt(num_rows), priceStep);
  const data: OptionData[] = [];
  for (let i = 0; i < strikes.length; i++) {
    const strike = strikes[i];
    const h = new BSHolder(
      avePrice,
      strike,
      parseFloat(interest_rate),
      parseFloat(volatility),
      parseFloat(expiry) / 365
    );
    data.push({
      symbol: token,
      spot: avePrice,
      strike,
      expiry: maturityDate,
      call: {
        premium: BS.call(h),
        delta: BS.cdelta(h),
        gamma: BS.gamma(h),
        theta: BS.ctheta(h),
        vega: BS.vega(h),
        rho: BS.crho(h),
      },
      put: {
        premium: BS.put(h),
        delta: BS.pdelta(h),
        gamma: BS.gamma(h),
        theta: BS.ptheta(h),
        vega: BS.vega(h),
        rho: BS.prho(h),
      },
    });
  }
  res.status(200).json(data);
}
