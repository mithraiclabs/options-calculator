export interface PriceData {
  price: number;
  date: Date;
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
