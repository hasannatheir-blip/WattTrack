/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Appliance, TariffType } from './types';
import { Logo } from './components/Logo';
import { Dashboard } from './components/Dashboard';
import { ApplianceList } from './components/ApplianceList';
import { ApplianceForm } from './components/ApplianceForm';
import { TariffSelector } from './components/TariffSelector';
import { Button } from './components/ui/button';
import { Plus, LayoutDashboard, ListMusic, Settings2, Zap, Wallet, Languages } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from './components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { Language, translations } from './lib/translations';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('watttrack_lang');
    return (saved as Language) || 'en';
  });

  const t = translations[lang];

  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    const saved = localStorage.getItem('watttrack_appliances');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tariffType, setTariffType] = useState<TariffType>(() => {
    const saved = localStorage.getItem('watttrack_tariff');
    return (saved as TariffType) || 'subsidized';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('watttrack_appliances', JSON.stringify(appliances));
  }, [appliances]);

  useEffect(() => {
    localStorage.setItem('watttrack_tariff', tariffType);
  }, [tariffType]);

  useEffect(() => {
    localStorage.setItem('watttrack_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleAddAppliance = (appliance: Appliance) => {
    if (editingAppliance) {
      setAppliances(appliances.map(a => a.id === appliance.id ? appliance : a));
    } else {
      setAppliances([...appliances, appliance]);
    }
    setIsFormOpen(false);
    setEditingAppliance(null);
  };

  const handleEditAppliance = (appliance: Appliance) => {
    setEditingAppliance(appliance);
    setIsFormOpen(true);
  };

  const handleDeleteAppliance = (id: string) => {
    setAppliances(appliances.filter(a => a.id !== id));
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <div className={`min-h-screen bg-background text-ink font-sans selection:bg-primary/10 flex flex-col ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Header */}
      <header className="h-20 md:h-24 sticky top-0 z-50 w-full border-b bg-white px-4 md:px-10 flex items-center justify-between shadow-sm">
        <Logo />
        <div className="hidden md:block text-sm font-bold text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          {t.householdCalculator}
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleLanguage}
            className="rounded-full gap-2 font-bold border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
          >
            <Languages className="w-4 h-4" />
            <span>{t.language}</span>
          </Button>

          <Dialog open={isFormOpen} onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingAppliance(null);
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full gap-2 shadow-lg hover:shadow-primary/20 transition-all active:scale-95 bg-jordan-gradient text-white border-none px-6">
                <Plus className="w-5 h-5" />
                <span className="font-black">{t.addNew}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <ApplianceForm 
                onSubmit={handleAddAppliance} 
                initialData={editingAppliance}
                onCancel={() => setIsFormOpen(false)}
                lang={lang}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-0 overflow-hidden">
        {/* Sidebar - Appliances */}
        <aside className="hidden md:flex bg-white border-r border-border p-8 flex-col gap-8 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-black text-ink-light">{t.addedAppliances || t.appliances}</h2>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold">
                {appliances.length}
              </Badge>
            </div>
            <ApplianceList 
              appliances={appliances} 
              onEdit={handleEditAppliance} 
              onDelete={handleDeleteAppliance} 
              lang={lang}
              tariffType={tariffType}
            />
          </div>
          <Button 
            variant="outline" 
            className="mt-auto border-dashed border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary rounded-2xl py-8 transition-all group"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-5 h-5 mx-2 group-hover:rotate-90 transition-transform" />
            <span className="font-bold">{t.addAppliance}</span>
          </Button>
        </aside>

        {/* Content Area */}
        <div className="p-4 md:p-10 overflow-y-auto pb-32 md:pb-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6 md:hidden">
              <TabsList className="bg-muted/50 p-1 rounded-xl h-10 w-full max-w-[240px]">
                <TabsTrigger value="dashboard" className="flex-1 rounded-lg text-[10px] font-black uppercase gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  {t.dashboard}
                </TabsTrigger>
                <TabsTrigger value="appliances" className="flex-1 rounded-lg text-[10px] font-black uppercase gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Zap className="w-3.5 h-3.5" />
                  {t.appliances}
                </TabsTrigger>
              </TabsList>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                    <Settings2 className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                  <div className="py-6">
                    <TariffSelector value={tariffType} onChange={setTariffType} lang={lang} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="dashboard" key="dashboard" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8"
                >
                  <div className="space-y-8">
                    <Dashboard appliances={appliances} tariffType={tariffType} lang={lang} />
                  </div>
                  <div className="hidden lg:block space-y-6">
                    <div className="bg-[#F0F2ED] p-6 rounded-2xl border border-border">
                      <h3 className="text-[12px] uppercase tracking-wider font-bold text-ink-light mb-4">{t.tariffSetting}</h3>
                      <TariffSelector value={tariffType} onChange={setTariffType} lang={lang} />
                    </div>
                    <div className="text-[11px] text-ink-light opacity-50 text-center leading-relaxed">
                      {t.footerNote}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="appliances" key="appliances" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApplianceList 
                    appliances={appliances} 
                    onEdit={handleEditAppliance} 
                    onDelete={handleDeleteAppliance} 
                    lang={lang}
                    tariffType={tariffType}
                  />
                </motion.div>
              </TabsContent>

              <TabsContent value="tips" key="tips" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-white p-6 rounded-3xl border-2 border-primary/10 shadow-xl">
                    <Dashboard appliances={appliances} tariffType={tariffType} lang={lang} showOnlyTips={true} />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="history" key="history" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                >
                  <div className="bg-muted p-6 rounded-full">
                    <Wallet className="w-12 h-12 text-muted-foreground opacity-20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold">{t.history || 'History'}</p>
                    <p className="text-sm text-muted-foreground">Coming soon! Track your monthly bills over time.</p>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 flex justify-around items-center z-50 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-primary scale-110' : 'text-ink-light opacity-50'}`}
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t.home}</span>
        </button>
        <button 
          onClick={() => setActiveTab('tips')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'tips' ? 'text-primary scale-110' : 'text-ink-light opacity-50'}`}
        >
          <Zap className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t.tips}</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-primary scale-110' : 'text-ink-light opacity-50'}`}
        >
          <Wallet className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">{t.history}</span>
        </button>
      </nav>
    </div>
  );
}
