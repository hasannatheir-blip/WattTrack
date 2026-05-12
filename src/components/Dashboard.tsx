import React, { useState } from 'react';
import { Appliance, TariffType } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { calculateApplianceConsumption, calculateTotalCost } from '../lib/calculations';
import { TrendingUp, Wallet, Zap, Info, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { JordanFlag } from './JordanFlag';
import { Language, energyTips, translations } from '../lib/translations';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface DashboardProps {
  appliances: Appliance[];
  tariffType: TariffType;
  lang: Language;
  showOnlyTips?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ appliances, tariffType, lang, showOnlyTips = false }) => {
  const t = translations[lang];
  const tips = energyTips[lang];
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const totalMonthlyKWh = appliances.reduce((sum, app) => sum + calculateApplianceConsumption(app).monthlyKWh, 0);
  const result = calculateTotalCost(totalMonthlyKWh, tariffType);

  const chartData = appliances.map(app => {
    const consumption = calculateApplianceConsumption(app).monthlyKWh;
    const { totalCostJOD } = calculateTotalCost(consumption, tariffType);
    return {
      name: app.name,
      consumption: Number(consumption.toFixed(2)),
      price: Number(totalCostJOD.toFixed(3)),
      value: Number(consumption.toFixed(2))
    };
  }).sort((a, b) => b.price - a.price);

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  if (showOnlyTips) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-light">{t.energySavingTips}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{currentTipIndex + 1} / {tips.length}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-2 border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm" onClick={prevTip}>
                <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-2 border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm" onClick={nextTip}>
                <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden min-h-[120px]">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white p-8 rounded-[28px] border-2 border-primary/10 shadow-xl flex gap-6 items-start relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-jordan-gradient"></div>
            <div className="bg-primary/10 p-3 rounded-2xl shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <Info className="w-6 h-6 text-primary group-hover:text-white" />
            </div>
            <p className="text-lg leading-relaxed text-ink font-bold">{tips[currentTipIndex]}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Header (Mobile Only) */}
      <div className="flex items-center justify-between px-1 md:hidden mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-ink">{t.ahlan}</h2>
          <p className="text-[10px] md:text-xs font-bold text-primary">{t.trackEnergy}</p>
        </div>
        <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border-2 border-primary/10 flex items-center gap-2 md:gap-3">
          <JordanFlag className="w-6 h-4 md:w-8 md:h-5 rounded-[2px] md:rounded-[4px] shadow-sm" />
          <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-primary">JO</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 min-[450px]:grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
        <Card className="bg-jordan-black-gradient text-white border-none shadow-xl rounded-[24px] overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Zap className="w-16 h-16 md:w-24 md:h-24" />
          </div>
          <CardContent className="p-5 md:p-8 space-y-1 md:space-y-2 relative z-10">
            <p className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-black opacity-70">{t.monthlyConsumption}</p>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="text-2xl md:text-3xl lg:text-4xl font-black">{result.monthlyKWh}</span>
              <span className="text-[10px] md:text-xs lg:text-sm font-bold opacity-70">{t.kWh}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-jordan-red-gradient text-white border-none shadow-xl rounded-[24px] overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="w-16 h-16 md:w-24 md:h-24" />
          </div>
          <CardContent className="p-5 md:p-8 space-y-1 md:space-y-2 relative z-10">
            <p className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-black opacity-70">{t.estimatedBill}</p>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="text-2xl md:text-3xl lg:text-4xl font-black">{result.totalCostJOD.toFixed(2)}</span>
              <span className="text-[10px] md:text-xs lg:text-sm font-bold opacity-70">JOD</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-jordan-gradient text-white border-none shadow-xl rounded-[24px] overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300 min-[450px]:col-span-2 sm:col-span-1">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-16 h-16 md:w-24 md:h-24" />
          </div>
          <CardContent className="p-5 md:p-8 space-y-1 md:space-y-2 relative z-10">
            <p className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-black opacity-70">{t.dailyAverage}</p>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="text-2xl md:text-3xl lg:text-4xl font-black">{result.dailyKWh}</span>
              <span className="text-[10px] md:text-xs lg:text-sm font-bold opacity-70">{t.kWh}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Breakdown Row */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {appliances.length > 0 && (
          <Card className="border-border shadow-sm bg-card rounded-[20px]">
            <CardHeader className="p-4 md:p-6 pb-0">
              <CardTitle className="text-[11px] md:text-[12px] uppercase tracking-wider font-bold text-ink-light">{t.consumptionBreakdown}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-2 md:pt-4 h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#666666' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E1D8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-border rounded-xl shadow-xl">
                            <p className="font-black text-ink mb-1">{data.name}</p>
                            <div className="space-y-1">
                              <p className="text-primary font-bold flex justify-between gap-4">
                                <span>{t.usage}:</span>
                                <span>{data.consumption} {t.kWh}</span>
                              </p>
                              <p className="text-ink font-bold flex justify-between gap-4">
                                <span>{t.cost}:</span>
                                <span>{data.price.toFixed(3)} JOD</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="var(--color-primary)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={Math.max(10, 40 - (chartData.length * 2))}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Tariff Breakdown (Mobile/Tablet Only) */}
        <div className="lg:hidden">
          <Card className="border-border shadow-sm bg-card rounded-[20px] overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-[12px] uppercase tracking-wider font-bold text-ink-light">{t.tariffBreakdown}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-6 pb-6 space-y-1">
                {result.brackets.map((bracket, idx) => (
                  <div key={idx} className="flex justify-between py-3 border-b border-border/50 last:border-0">
                    <span className="text-sm text-ink-light">{bracket.range}</span>
                    <span className="text-sm font-bold text-ink">{bracket.costJOD.toFixed(3)} JOD</span>
                  </div>
                ))}
                <div className="flex justify-between py-4 mt-2 border-t-2 border-primary/20">
                  <span className="text-sm font-bold text-ink">{t.totalBill}</span>
                  <span className="text-lg font-black text-primary">{result.totalCostJOD.toFixed(3)} JOD</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips Section with Carousel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-ink-light">{t.energySavingTips}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{currentTipIndex + 1} / {tips.length}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-2 border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm" onClick={prevTip}>
                <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-2 border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm" onClick={nextTip}>
                <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden min-h-[120px]">
          <motion.div
            key={currentTipIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white p-8 rounded-[28px] border-2 border-primary/10 shadow-xl flex gap-6 items-start relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-jordan-gradient"></div>
            <div className="bg-primary/10 p-3 rounded-2xl shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <Info className="w-6 h-6 text-primary group-hover:text-white" />
            </div>
            <p className="text-lg leading-relaxed text-ink font-bold">{tips[currentTipIndex]}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
