import { fetchOHLC } from "@/utils/api";
import { calcStdDevVolatility, calcYangZhangVolatility } from "@/utils/calc";
import { getPrices } from "@/utils/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

type ReqInput = {
  algorithm: string;
  token: string;
  lookback: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { algorithm, token, lookback } = query as ReqInput;
  let volatility = 0;
  if (algorithm === "yang_zhang") {
    fetchOHLC(token, parseInt(lookback))
      .then((data) => {
        volatility = calcYangZhangVolatility(data, parseInt(lookback));
        res.status(200).json({ volatility });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else if (algorithm == "std_dev") {
    getPrices(token, parseInt(lookback))
      .then((data) => {
        volatility = calcStdDevVolatility(data, parseInt(lookback));
        res.status(200).json({ volatility });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    res.status(500).json({ error: "invalid algorithm: " + algorithm });
  }
}
