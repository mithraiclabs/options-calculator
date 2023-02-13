import { CoinGeckoClient } from "coingecko-api-v3";
import { sleep } from "./util";

const client = new CoinGeckoClient({
  timeout: 1000,
  autoRetry: true,
});

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
    .then((resp) => {
      for (const coin of resp) {
        const id = coin.id as string;
        coinsList[id] = coin.symbol as string;
      }
    })
    .catch((err) => {
      console.log("Error retrieving prices", err);
    });

  return coinsList;
};

export const getSimplePrice = async (
  id: string
) => {
  const res = await client.simplePrice({
    vs_currencies: "usd",
    ids: id
  })
  return res[id]["usd"];
}

export const getHistoricalPrices = async (
  coinList: Array<string>,
  lookbackPeriod: number
) => {
  const priceList: { [id: string]: Array<Array<number>> } = {};
  for (const coin of coinList) {
    await client
      .coinIdMarketChart({
        id: coin,
        vs_currency: "usd",
        days: lookbackPeriod,
      })
      .then((resp) => {
        console.log("Retrieved prices for:", coin);
        priceList[coin] = resp.prices;
      })
      .catch((err) => {
        console.log("Error retrieving prices for:", coin, err);
      });
    await sleep(2000);
  }
  return priceList;
};
