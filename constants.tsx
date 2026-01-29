
import { Asset, PortfolioStats } from './types';

export const MOCK_STATS: PortfolioStats = {
  totalBalance: 22487280.97,
  uninvested: 1250450.00,
  totalEarnings: 1245678.12,
  earnings24h: 45670.32,
  currency: '$'
};

export const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'USD Stablecoin',
    symbol: 'USDC',
    amount: 5240500.25,
    valueFiat: 5240500.25,
    valueSecondary: 5240500.25,
    currencySymbol: '$',
    secondarySymbol: '$',
    apy: 5.2,
    color: 'bg-blue-500',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    amount: 6159.57,
    valueFiat: 17246788.72,
    valueSecondary: 6159.57,
    currencySymbol: '$',
    secondarySymbol: 'ETH',
    apy: 4.1,
    color: 'bg-indigo-600',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  }
];
