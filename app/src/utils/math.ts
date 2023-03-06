import { PriceData } from "@/types/price";

export const round = (num: number | undefined, dp: number): number => {
  if (num === undefined) {
    return 0;
  }
  return Math.round(num * 10 ** dp) / 10 ** dp;
};

export const latestPrice = (data: PriceData[]): number => {
  return data[data.length - 1].price;
};

export const calcPriceStep = (price: number): number => {
  if (price < 0.01) {
    return 0.0001;
  } else if (price < 0.1) {
    return 0.001;
  } else if (price < 1) {
    return 0.01;
  } else if (price < 10) {
    return 0.1;
  } else if (price < 100) {
    return 1;
  } else if (price < 1000) {
    return 10;
  } else if (price < 10000) {
    return 100;
  } else if (price < 100000) {
    return 1000;
  } else {
    return 10000;
  }
};
