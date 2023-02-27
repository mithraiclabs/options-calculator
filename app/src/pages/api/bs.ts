import { OptionData } from "@/types/price";
import { getCurrentPrice } from "@/utils/api";
import { BS, BSHolder } from "@/utils/bs";
import type { NextApiRequest, NextApiResponse } from "next";

type ReqInput = {
  token: string;
  price_step: string;
  num_rows: string;
  expiry: string;
  volatility: string;
  interest_rate: string;
};

const getStrikes = (
  currentPrice: number,
  numRows: number,
  priceStep: number
): number[] => {
  const strikes = [];
  for (let i = 0; i < numRows; i++) {
    const strike = Math.ceil(currentPrice + (i - numRows / 2) * priceStep);
    if (strike > 0) {
      strikes.push(strike);
    }
  }
  return strikes;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { token, price_step, num_rows, expiry, volatility, interest_rate } =
    query as ReqInput;
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + parseFloat(expiry));

  getCurrentPrice(token)
    .then((currentPrice) => {
      const strikes = getStrikes(
        currentPrice,
        parseInt(num_rows),
        parseFloat(price_step)
      );
      const data: OptionData[] = [];
      for (let i = 0; i < strikes.length; i++) {
        const strike = strikes[i];
        const h = new BSHolder(
          currentPrice,
          strike,
          parseFloat(interest_rate),
          parseFloat(volatility),
          parseFloat(expiry) / 365
        );
        data.push({
          symbol: token,
          spot: currentPrice,
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
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
