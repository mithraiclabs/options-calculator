import * as functions from "firebase-functions";
import { getCoinsList, getHistoricalPrices } from "./coingecko";
import { storeCoinPrices, storeInterestYields } from "./firestore";
import { fetchCsv, formatDate, getCurrentDate, sleep } from "./util";

const YIELDS_API =
  "https://data.nasdaq.com/api/v3/datasets/USTREASURY/YIELD.csv";
const YIELDS_APIKEY = "VotCqMj6Af-x98-KzXbT";

export const retrieveYieldRates = functions.pubsub
  .schedule("every day 00:00")
  .onRun(async () => {
    const endDate = getCurrentDate();
    const startDate = getCurrentDate();
    startDate.setDate(startDate.getDate() - 5);
    const param = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      api_key: YIELDS_APIKEY,
    };

    const data = await fetchCsv(YIELDS_API, param);
    if (data == null) {
      return;
    }
    return storeInterestYields(data);
  });

/**
 * Retrieves coin prices every day and stores it into firestore
 */
export const retrieveCoinPrices = functions.pubsub
  .schedule("every day 00:00")
  .onRun(async () => {
    const date = getCurrentDate();
    console.log(
      "Retrieving coin prices, current date: %s",
      date.toLocaleDateString()
    );

    const coinList = await getCoinsList("solana-ecosystem");

    const updates = [];
    const coins = Object.keys(coinList);
    for (const coin of coins) {
      const prices = await getHistoricalPrices(coin);
      updates.push(storeCoinPrices(coin, prices, date));
      await sleep(2000);
    }
    return Promise.all(updates);
  });
