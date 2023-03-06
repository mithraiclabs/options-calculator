import { CoinGeckoClient } from "coingecko-api-v3";

const client = new CoinGeckoClient({
  timeout: 1000,
  autoRetry: true,
});

/**
 * Gets the list of coin ids to symbols mapping
 * @param category
 * @returns dictionary of coin id to symbols
 */
export const getCoinsList = async (category: string) => {
  const coinsList: { [id: string]: string } = {};
  await client
    .coinMarket({
      vs_currency: "usd",
      ids: "",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      category,
    })
    .then((resp: any) => {
      for (const coin of resp) {
        const id = coin.id as string;
        coinsList[id] = coin.symbol as string;
      }
    })
    .catch((err: any) => {
      console.log("Error retrieving prices", err);
    });

  return coinsList;
};

/**
 * Gets the spot price of the token in usd
 * @param id id of the token
 * @returns current spot price
 */
export const getSimplePrice = async (id: string) => {
  const res = await client.simplePrice({
    vs_currencies: "usd",
    ids: id,
  });
  return res[id]["usd"];
};

/**
 * Retrieve coin prices from the past day with 5min granularity.
 * More than 1 day, hourly data
 * More than 90 days, daily data
 * @param coinList array of coin ids
 * @param lookbackPeriod days before, defaults to 1
 * @returns
 */
export const getHistoricalPrices = async (coin: string, lookbackPeriod = 1) => {
  return client
    .coinIdMarketChart({
      id: coin,
      vs_currency: "usd",
      days: lookbackPeriod,
    })
    .then((resp: any) => {
      console.log("Retrieved prices for:", coin);
      return resp.prices;
    })
    .catch((err: any) => {
      console.log("Error retrieving prices for:", coin, err);
    });
};
