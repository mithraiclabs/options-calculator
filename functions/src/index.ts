import * as functions from "firebase-functions";
import { getCoinsList, getHistoricalPrices } from "./coingecko";
import { storeCoinPrices, storeInterestYields } from "./firestore";
import { fetchCsv, formatDate, getCurrentDate } from "./util";

const YIELDS_API =
  "https://data.nasdaq.com/api/v3/datasets/USTREASURY/YIELD.csv";
const YIELDS_APIKEY = "VotCqMj6Af-x98-KzXbT";

export const retrieveYieldRates = functions.pubsub
  .schedule("every day 00:00")
  .onRun(() => {
    const endDate = getCurrentDate();
    const startDate = new Date(endDate.getDate() - 5);
    const param = {
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
      api_key: YIELDS_APIKEY,
    };

    fetchCsv(YIELDS_API, param).then((rows) => {
      if (rows == null) {
        return;
      }
      storeInterestYields(rows);
    });
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
    const coinPrices = await getHistoricalPrices(Object.keys(coinList)); // retrieve coin prices from the past day
    storeCoinPrices(coinPrices, date);
  });
