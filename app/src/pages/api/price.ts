import { getPrices } from "@/utils/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

type ReqInput = {
  token: string;
  lookback: string;
};

/**
 * Gets the historical prices of a token using data cached in firebase.
 * May not be the most up to date price.
 * @param req
 * @param res
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { token, lookback } = query as ReqInput;
  getPrices(token, parseInt(lookback))
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
