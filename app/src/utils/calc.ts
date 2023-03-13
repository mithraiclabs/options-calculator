import { OHLCData, PriceData } from "@/types/price";

export const stdDev = (data: number[]) => {
  const mean = calcMean(data);
  return Math.sqrt(
    data.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) /
      (data.length - 1)
  );
};

export const calcMean = (data: number[]) => {
  return data.reduce((a, b) => a + b) / data.length;
};

/**
 * Calculates the volatility of a given set of data
 * @param data - array of ohlc data
 */
export const calcYangZhangVolatility = (
  data: OHLCData[],
  lookback: number
): number => {
  const n = data.length;
  let close_vol = 0;
  let open_vol = 0;
  let window_rs = 0;

  for (let i = 1; i < data.length; i++) {
    const log_ho = Math.log(data[i]["high"] / data[i]["open"]);
    const log_lo = Math.log(data[i]["low"] / data[i]["open"]);
    const log_co = Math.log(data[i]["close"] / data[i]["open"]);

    const log_oc = Math.log(data[i]["open"] / data[i - 1]["close"]);
    const log_oc_sq = Math.pow(log_oc, 2);

    const log_cc = Math.log(data[i]["close"] / data[i - 1]["close"]);
    const log_cc_sq = Math.pow(log_cc, 2);

    const rs = log_ho * (log_ho - log_co) + log_lo * (log_lo - log_co);

    close_vol += log_cc_sq;
    open_vol += log_oc_sq;
    window_rs += rs;
  }

  close_vol = close_vol * (1.0 / (n - 1.0));
  open_vol = open_vol * (1.0 / (n - 1.0));
  window_rs = window_rs * (1.0 / (n - 1.0));

  const k = 0.34 / (1.34 + (n + 1) / (n - 1));
  const yz = open_vol + k * close_vol + (1 - k) * window_rs;

  const num_periods = lookback <= 2 ? 48 : lookback <= 30 ? 6 : 0.25;
  return Math.sqrt(yz * 365 * num_periods);
};

/**
 * Calculates the annual historical volatility of a given set of data
 * Note: 365 trading days per year for crypto
 * @param data - array of ohlc data
 */
export const calcStdDevVolatilityOHLC = (
  data: OHLCData[],
  lookback: number
): number => {
  const percentChange = data.map((val) => {
    return Math.log(val.close / val.open);
  });
  const num_periods = lookback <= 2 ? 48 : lookback <= 30 ? 6 : 0.25;
  return stdDev(percentChange) * Math.sqrt(365) * Math.sqrt(num_periods);
};

/**
 * Calculates the annual historical volatility of a given set of data
 * Note: 365 trading days per year for crypto
 * @param data - array of ohlc data
 */
export const calcStdDevVolatility = (
  data: number[][],
  lookback: number
): number => {
  const percentChange = [];
  for (let i = 1; i < data.length; i++) {
    percentChange.push(data[i][1] / data[i - 1][1] - 1);
  }
  // const num_periods = lookback <= 2 ? 48 : lookback <= 30 ? 6 : 0.25;
  return (
    stdDev(percentChange) *
    Math.sqrt(365) *
    Math.sqrt(percentChange.length / lookback)
  );
};
