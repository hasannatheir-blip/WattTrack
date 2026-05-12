import { Appliance, CalculationResult, TariffBracket, TariffType } from '../types';
import { SUBSIDIZED_TARIFF, NON_SUBSIDIZED_TARIFF } from '../constants';

export function calculateApplianceConsumption(appliance: Appliance) {
  const quantity = appliance.quantity || 1;
  const dutyCycle = appliance.dutyCycle !== undefined ? appliance.dutyCycle / 100 : 1;
  const dailyKWh = (appliance.powerWatts * appliance.dailyHours * quantity * dutyCycle) / 1000;
  const monthlyKWh = dailyKWh * appliance.daysPerMonth;
  return { dailyKWh, monthlyKWh };
}

export function calculateTotalCost(totalMonthlyKWh: number, tariffType: TariffType): CalculationResult {
  const brackets = tariffType === 'subsidized' ? SUBSIDIZED_TARIFF : NON_SUBSIDIZED_TARIFF;
  let remainingKWh = totalMonthlyKWh;
  let totalCostFils = 0;
  const resultBrackets: CalculationResult['brackets'] = [];

  let previousLimit = 0;

  for (const bracket of brackets) {
    if (remainingKWh <= 0) break;

    let kWhInBracket = 0;
    let rangeLabel = '';

    if (bracket.limit === null) {
      kWhInBracket = remainingKWh;
      rangeLabel = `Above ${previousLimit} kWh`;
    } else {
      const bracketSize = bracket.limit - previousLimit;
      kWhInBracket = Math.min(remainingKWh, bracketSize);
      rangeLabel = `${previousLimit + 1}–${bracket.limit} kWh`;
      previousLimit = bracket.limit;
    }

    const costFils = kWhInBracket * bracket.rate;
    totalCostFils += costFils;
    remainingKWh -= kWhInBracket;

    resultBrackets.push({
      range: rangeLabel,
      kWh: Number(kWhInBracket.toFixed(2)),
      costJOD: Number((costFils / 1000).toFixed(3)),
    });
  }

  return {
    dailyKWh: Number((totalMonthlyKWh / 30).toFixed(2)), // Average daily
    monthlyKWh: Number(totalMonthlyKWh.toFixed(2)),
    totalCostJOD: Number((totalCostFils / 1000).toFixed(3)),
    brackets: resultBrackets,
  };
}
