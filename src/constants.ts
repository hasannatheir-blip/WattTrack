import { TariffBracket } from './types';

export const SUBSIDIZED_TARIFF: TariffBracket[] = [
  { limit: 300, rate: 50 },
  { limit: 600, rate: 100 },
  { limit: null, rate: 200 },
];

export const NON_SUBSIDIZED_TARIFF: TariffBracket[] = [
  { limit: 1000, rate: 120 },
  { limit: null, rate: 150 },
];

export const JORDAN_FLAG_COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  green: '#007A3D',
  red: '#CE1126',
};
