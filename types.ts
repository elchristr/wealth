
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  valueFiat: number;
  valueSecondary: number;
  currencySymbol: string;
  secondarySymbol: string;
  apy: number;
  color: string;
  icon: string;
}

export interface PortfolioStats {
  totalBalance: number;
  uninvested: number;
  totalEarnings: number;
  earnings24h: number;
  currency: string;
}
