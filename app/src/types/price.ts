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
  type: string;
  strike: number;
  expiry: Date;
  greeks: Greeks;
}
