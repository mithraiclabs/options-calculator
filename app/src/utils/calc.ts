import { OHLCData } from "@/types/price";

export const stdDev = (data: number[]) => {
  const mean = calcMean(data);
  return Math.sqrt(
    data.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / data.length
  );
};

export const calcMean = (data: number[]) => {
  return data.reduce((a, b) => a + b) / data.length;
};

/**
 * Calculates the volatility of a given set of data
 * @param data - array of ohlc data
 */
export const calcYangZhangVolatility = (data: OHLCData[]): number => {
  return 0.1;
};

/**
 * Calculates the annual historical volatility of a given set of data
 * Note: 365 trading days per year for crypto
 * @param data - array of ohlc data
 */
export const calcStdDevVolatility = (data: OHLCData[]): number => {
  const percentChange = data.map((val) => {
    return (val.close - val.open) / val.open;
  });
  return stdDev(percentChange) * Math.sqrt(365);
};
