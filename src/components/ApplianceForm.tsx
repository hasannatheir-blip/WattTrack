import React, { useState, useEffect } from 'react';
import { Appliance } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Language, translations } from '../lib/translations';

interface ApplianceFormProps {
  onSubmit: (appliance: Appliance) => void;
  initialData?: Appliance | null;
  onCancel: () => void;
  lang: Language;
}

export const ApplianceForm: React.FC<ApplianceFormProps> = ({ onSubmit, initialData, onCancel, lang }) => {
  const t = translations[lang];
  const [name, setName] = useState(initialData?.name || '');
  const [power, setPower] = useState(initialData?.powerWatts?.toString() || '');
  const [hours, setHours] = useState(initialData?.dailyHours?.toString() || '');
  const [days, setDays] = useState(initialData?.daysPerMonth?.toString() || '30');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPower(initialData.powerWatts.toString());
      setHours(initialData.dailyHours.toString());
      setDays(initialData.daysPerMonth.toString());
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !power || !hours || !days) return;

    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      name,
      powerWatts: Number(power),
      dailyHours: Number(hours),
      daysPerMonth: Number(days),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <h2 className="text-xl font-black tracking-tight">
          {initialData ? t.updateAppliance : t.addAppliance}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-ink-light">
            {t.applianceName}
          </Label>
          <Input
            id="name"
            placeholder={lang === 'en' ? "e.g. Refrigerator" : "مثلاً: ثلاجة"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl border-border h-12"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="power" className="text-xs font-bold uppercase tracking-wider text-ink-light">
              {t.powerWatts}
            </Label>
            <Input
              id="power"
              type="number"
              placeholder="W"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              required
              min="0"
              className="rounded-xl border-border h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours" className="text-xs font-bold uppercase tracking-wider text-ink-light">
              {t.dailyUsage}
            </Label>
            <Input
              id="hours"
              type="number"
              placeholder="Hrs"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              min="0"
              max="24"
              step="0.1"
              className="rounded-xl border-border h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="days" className="text-xs font-bold uppercase tracking-wider text-ink-light">
            {t.daysPerMonth}
          </Label>
          <Input
            id="days"
            type="number"
            placeholder="Days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            required
            min="1"
            max="31"
            className="rounded-xl border-border h-12"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button type="button" variant="outline" className="flex-1 rounded-2xl h-14 font-black border-2 border-border hover:bg-muted transition-all" onClick={onCancel}>
          {t.cancel}
        </Button>
        <Button type="submit" className="flex-1 rounded-2xl h-14 font-black bg-jordan-gradient text-white border-none shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">
          {initialData ? t.edit : t.addNew}
        </Button>
      </div>
    </form>
  );
};
