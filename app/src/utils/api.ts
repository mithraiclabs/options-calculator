import { OHLCData, PriceData } from "@/types/price";
import { CoinGeckoClient } from "coingecko-api-v3";
import {
  CoinMarket,
  CoinMarketChartResponse,
} from "coingecko-api-v3/dist/Interface";

const client = new CoinGeckoClient({
  timeout: 1000,
  autoRetry: false,
});

/**
 * @param token token id
 * @param lookback days to look back
 * @returns
 */
export const fetchPrices = (
  token: string,
  lookback: number
): Promise<PriceData[]> => {
  return client
    .coinIdMarketChart({
      id: token,
      vs_currency: "usd",
      days: lookback,
    })
    .then((resp: CoinMarketChartResponse) => (resp.prices ? resp.prices : []))
    .then((data) =>
      data.map((val) => {
        return {
          date: new Date(val[0]),
          price: val[1],
        };
      })
    );
};

/**
 * @param category
 * @returns list of coin ids
 */
export const fetchTokens = (category: string): Promise<string[]> => {
  return client
    .coinMarket({
      vs_currency: "usd",
      ids: "",
      // @ts-ignore
      category,
    })
    .then((resp: CoinMarket[]) => resp.map((coin) => coin.id!));
};

/**
 * @param token
 * @returns coin data
 */
export const fetchOHLC = (
  token: string,
  lookback: number
): Promise<OHLCData[]> => {
  return client
    .coinIdOHLC({
      id: token,
      vs_currency: "usd",
      days: lookback,
    })
    .then((data: number[][]) =>
      data.map((val) => {
        return {
          date: new Date(val[0]),
          open: val[1],
          high: val[2],
          low: val[3],
          close: val[4],
        };
      })
    );
};
