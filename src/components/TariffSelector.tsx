import React from 'react';
import { TariffType } from '../types';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

import { Language, translations } from '../lib/translations';

interface TariffSelectorProps {
  value: TariffType;
  onChange: (value: TariffType) => void;
  lang: Language;
}

export const TariffSelector: React.FC<TariffSelectorProps> = ({ value, onChange, lang }) => {
  const t = translations[lang];
  return (
    <div className="flex flex-col gap-2">
      <Tabs 
        value={value} 
        onValueChange={(v) => onChange(v as TariffType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-primary/5 border-2 border-primary/10 rounded-2xl">
          <TabsTrigger 
            value="subsidized" 
            className="text-xs font-black rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 transition-all duration-300"
          >
            {t.subsidized}
          </TabsTrigger>
          <TabsTrigger 
            value="non-subsidized" 
            className="text-xs font-black rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 transition-all duration-300"
          >
            {t.standard}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <p className="text-[10px] text-ink-light px-1 italic opacity-70">
        {value === 'subsidized' 
          ? t.requiresId 
          : t.standardRate}
      </p>
    </div>
  );
};
