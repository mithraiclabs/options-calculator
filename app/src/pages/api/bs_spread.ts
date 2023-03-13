import { SpreadOptionData } from "@/types/price";
import { getCurrentPrice } from "@/utils/api";
import { BS, BSHolder } from "@/utils/bs";
import { getPrices } from "@/utils/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

type ReqInput = {
  token: string;
  num_rows: string;
  expiry: string;
  volatility: string;
  interest_rate: string;
  buy_strike: string;
  sell_strike: string;
};

/**
 * Gets the historical prices of a token using data cached in firebase.
 * May not be the most up to date price.
 * @param req
 * @param res
 */
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
    buy_strike,
    sell_strike,
  } = query as ReqInput;
  const maturityDate = new Date();
  maturityDate.setDate(maturityDate.getDate() + parseFloat(expiry));
  const buyStrike = parseFloat(buy_strike);
  const sellStrike = parseFloat(sell_strike);
  const spot = await getCurrentPrice(token);

  const b = new BSHolder(
    spot,
    buyStrike,
    parseFloat(interest_rate),
    parseFloat(volatility),
    parseFloat(expiry) / 365
  );
  const s = new BSHolder(
    spot,
    sellStrike,
    parseFloat(interest_rate),
    parseFloat(volatility),
    parseFloat(expiry) / 365
  );
  let data: SpreadOptionData;
  if (buyStrike < sellStrike) {
    // long call spread
    data = {
      symbol: token,
      spot: spot,
      expiry: maturityDate,
      buyStrike: buyStrike,
      sellStrike: sellStrike,
      buyGreeks: {
        premium: BS.call(b),
        delta: BS.cdelta(b),
        gamma: BS.gamma(b),
        theta: BS.ctheta(b),
        vega: BS.vega(b),
        rho: BS.crho(b),
      },
      sellGreeks: {
        premium: BS.call(s),
        delta: BS.cdelta(s),
        gamma: BS.gamma(s),
        theta: BS.ctheta(s),
        vega: BS.vega(s),
        rho: BS.crho(s),
      },
    };
    res.status(200).json(data);
  } else if (buyStrike > sellStrike) {
    // long put spread
    data = {
      symbol: token,
      spot: spot,
      expiry: maturityDate,
      buyStrike: buyStrike,
      sellStrike: sellStrike,
      buyGreeks: {
        premium: BS.put(b),
        delta: BS.pdelta(b),
        gamma: BS.gamma(b),
        theta: BS.ptheta(b),
        vega: BS.vega(b),
        rho: BS.prho(b),
      },
      sellGreeks: {
        premium: BS.put(s),
        delta: BS.pdelta(s),
        gamma: BS.gamma(s),
        theta: BS.ptheta(s),
        vega: BS.vega(s),
        rho: BS.prho(s),
      },
    };
    res.status(200).json(data);
  } else {
    res
      .status(500)
      .json({ error: "buy strike cannot be equal to sell strike" });
  }
}
