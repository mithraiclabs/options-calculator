import { fetchOHLC } from "@/utils/api";
import { calcStdDevVolatility, calcYangZhangVolatility } from "@/utils/calc";
import type { NextApiRequest, NextApiResponse } from "next";

type ReqInput = {
  algorithm: string;
  token: string;
  lookback: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { algorithm, token, lookback } = query as ReqInput;
  fetchOHLC(token, parseInt(lookback))
    .then((data) => {
      let volatility = 0;
      if (algorithm === "yang_zhang") {
        volatility = calcYangZhangVolatility(data, parseInt(lookback));
      } else if (algorithm == "std_dev") {
        volatility = calcStdDevVolatility(data, parseInt(lookback));
      } else {
        res.status(500).json({ error: "invalid algorithm: " + algorithm });
      }
      res.status(200).json({ volatility });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
