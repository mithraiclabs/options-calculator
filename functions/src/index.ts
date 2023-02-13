import * as functions from "firebase-functions";
import { getCoinsList, getHistoricalPrices } from "./coingecko";
import { storeCoinPrices } from "./firestore";

/**
 * Retrieves coin prices every day and stores it into firestore
 */
const retrieveCoinPrices = functions.pubsub
  .schedule("every day 00:00")
  .onRun(async () => {
    console.log(
      "Retrieving coin prices, current time",
      Date.now().toLocaleString()
    );

    const coinList = getCoinsList("solana-ecosystem");
    const coinPrices = await getHistoricalPrices(Object.keys(coinList), 1); // retrieve coin prices from the past day
    storeCoinPrices(coinPrices);
  });

/**
 * Calculate the option prices given a token
 */
export const calcOption = functions.https.onRequest(async (req, res) => {
  const id = req.query.id;
  
});
