export interface PriceData {
  price: number;
  date: Date;
}

export interface OHLCData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Greeks {
  premium: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface OptionData {
  symbol: string;
  spot: number;
  strike: number;
  expiry: Date;
  call: Greeks | null;
  put: Greeks | null;
}
