export interface Appliance {
  id: string;
  name: string;
  powerWatts: number;
  dailyHours: number;
  daysPerMonth: number;
}

export type TariffType = 'subsidized' | 'non-subsidized';

export interface TariffBracket {
  limit: number | null; // null means "above"
  rate: number; // in fils
}

export interface CalculationResult {
  dailyKWh: number;
  monthlyKWh: number;
  totalCostJOD: number;
  brackets: {
    range: string;
    kWh: number;
    costJOD: number;
  }[];
}
