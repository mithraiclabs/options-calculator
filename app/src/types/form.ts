export interface OptionFormData {
  lookback: string;
  volatility: number;
  interestRate: number;
  maturity: number;
  isSpread: boolean;
  minStrike?: number;
  maxStrike?: number;
  buyStrike?: number;
  sellStrike?: number;
}
