import React from 'react';
import { Appliance } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Edit2, Trash2, Zap } from 'lucide-react';
import { calculateApplianceConsumption, calculateTotalCost } from '../lib/calculations';
import { Language, translations } from '../lib/translations';
import { TariffType } from '../types';

interface ApplianceListProps {
  appliances: Appliance[];
  onEdit: (appliance: Appliance) => void;
  onDelete: (id: string) => void;
  lang: Language;
  tariffType: TariffType;
}

export const ApplianceList: React.FC<ApplianceListProps> = ({ appliances, onEdit, onDelete, lang, tariffType }) => {
  const t = translations[lang];

  if (appliances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <Zap className="w-12 h-12 text-muted-foreground opacity-20" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium">{t.noAppliances}</p>
          <p className="text-sm text-muted-foreground">{t.addFirst}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appliances.map((appliance) => {
        const { monthlyKWh } = calculateApplianceConsumption(appliance);
        const { totalCostJOD } = calculateTotalCost(monthlyKWh, tariffType);
        
        return (
          <Card key={appliance.id} className="overflow-hidden border-2 border-border shadow-none bg-white rounded-2xl hover:border-primary transition-all duration-300 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-[16px] text-ink">{appliance.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary font-mono bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                    {monthlyKWh.toFixed(1)} {t.kWh}
                  </p>
                  <p className="text-[10px] font-black text-ink mt-1">
                    ≈ {totalCostJOD.toFixed(3)} JOD
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-ink-light opacity-70">
                  {appliance.powerWatts}W • {appliance.dailyHours}h/{lang === 'ar' ? 'يوم' : 'day'}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-ink-light hover:text-primary hover:bg-primary/10" onClick={() => onEdit(appliance)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-ink-light hover:text-accent hover:bg-accent/10" onClick={() => onDelete(appliance.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
