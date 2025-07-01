import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Farm, Lot } from '@/types';
import { adaptationPhases } from '@/data/adaptationPhases';
import { useUserProfile } from '@/hooks/useUserProfile';
import Header from './Header';

interface DashboardProps {
  farms: Farm[];
  onNavigate: (view: string, data?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ farms, onNavigate }) => {
  const { profile } = useUserProfile();
  
  const totalAnimals = farms.reduce((acc, farm) => 
    acc + farm.lots.reduce((lotAcc, lot) => lotAcc + lot.animals.length, 0), 0
  );

  const activeLots = farms.reduce((acc, farm) => acc + farm.lots.length, 0);

  const getAdaptationDay = (startDate: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(diffDays, 15);
  };

  const calculateConcentrateAmount = (totalWeight: number, fraction: string) => {
    const baseAmount = totalWeight * 0.02; // 2% do peso vivo
    
    switch (fraction) {
      case '1/4':
        return (baseAmount / 4).toFixed(1);
      case '2/4':
        return (baseAmount / 2).toFixed(1);
      case 'à vontade':
        return baseAmount.toFixed(1);
      default:
        return '0';
    }
  };

  const formatFeedInstruction = (instruction: string, totalWeight: number) => {
    const baseAmount = totalWeight * 0.02;
    
    // Replace fractions with actual kg amounts
    return instruction
      .replace(/1\/4 concentrado/g, `${(baseAmount / 4).toFixed(1)}kg de concentrado`)
      .replace(/2\/4 concentrado/g, `${(baseAmount / 2).toFixed(1)}kg de concentrado`)
      .replace(/Concentrado à vontade/g, `${baseAmount.toFixed(1)}kg de concentrado à vontade`);
  };

  const formatMealDescription = (meal: string, totalWeight: number) => {
    const baseAmount = totalWeight * 0.02;
    
    if (meal.includes('1/4 concentrado')) {
      return meal.replace('1/4 concentrado', `${(baseAmount / 4).toFixed(1)}kg concentrado`);
    }
    if (meal.includes('2/4 concentrado')) {
      return meal.replace('2/4 concentrado', `${(baseAmount / 2).toFixed(1)}kg concentrado`);
    }
    if (meal.includes('Concentrado à vontade')) {
      return meal.replace('Concentrado à vontade', `${baseAmount.toFixed(1)}kg concentrado à vontade`);
    }
    
    return meal;
  };

  const lotsInAdaptation = farms.flatMap(farm => 
    farm.lots.filter(lot => {
      const adaptationDay = getAdaptationDay(lot.adaptationStartDate);
      return adaptationDay < 15;
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header title="EngordaPro" subtitle="Gestão completa para engorda com autogrão" />

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('farms')}>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-primary text-sm sm:text-base">🏛️ Fazendas</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Total de propriedades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-3xl font-bold text-primary">{farms.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('lots')}>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-primary text-sm sm:text-base">🧾 Lotes Ativos</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Lotes em produção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-3xl font-bold text-primary">{activeLots}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('animals')}>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-primary text-sm sm:text-base">🐄 Animais</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Total em engorda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-3xl font-bold text-primary">{totalAnimals}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('adaptation')}>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-primary text-sm sm:text-base">📋 Protocolo</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Adaptação de lotes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-3xl font-bold text-primary">{lotsInAdaptation.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer col-span-2 lg:col-span-1" onClick={() => onNavigate('finances')}>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-primary text-sm sm:text-base">💰 Financeiro</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Controle de caixa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-3xl font-bold text-primary">R$ 0,00</div>
            </CardContent>
          </Card>
        </div>

        {lotsInAdaptation.length > 0 && (
          <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2 text-lg sm:text-xl">
                🔄 Lotes em Adaptação
                <Badge variant="secondary">{lotsInAdaptation.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {lotsInAdaptation.map((lot) => {
                  const adaptationDay = getAdaptationDay(lot.adaptationStartDate);
                  const currentPhase = adaptationPhases.find(phase => phase.day === adaptationDay) || adaptationPhases[adaptationPhases.length - 1];
                  
                  return (
                    <div key={lot.id} className="bg-white p-3 sm:p-4 rounded-lg shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{lot.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{lot.animals.length} animais • {lot.totalWeight}kg total</p>
                        </div>
                        <Badge variant={adaptationDay < 15 ? "default" : "secondary"} className="self-start">
                          Dia {adaptationDay}
                        </Badge>
                      </div>
                      <div className="bg-gray-50 p-2 sm:p-3 rounded">
                        <p className="font-medium text-gray-700 text-sm sm:text-base">{currentPhase.phase}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {formatFeedInstruction(currentPhase.instructions, lot.totalWeight)}
                        </p>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                          <div>
                            <span className="font-medium">Manhã:</span> {formatMealDescription(currentPhase.morningFeed, lot.totalWeight)}
                          </div>
                          <div>
                            <span className="font-medium">Tarde:</span> {formatMealDescription(currentPhase.afternoonFeed, lot.totalWeight)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700 text-lg sm:text-xl">🏛️ Fazendas Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            {farms.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-gray-500 mb-4 text-sm sm:text-base">Nenhuma fazenda cadastrada</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {farms.slice(0, 5).map((farm) => (
                  <div key={farm.id} className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm sm:text-base">{farm.name}</h4>
                        {farm.location && <p className="text-xs sm:text-sm text-gray-600">{farm.location}</p>}
                      </div>
                      <Badge variant="outline" className="self-start sm:self-auto text-xs">{farm.lots.length} lotes</Badge>
                    </div>
                  </div>
                ))}
                {farms.length > 5 && (
                  <button 
                    onClick={() => onNavigate('farms')}
                    className="w-full text-green-600 hover:text-green-700 py-2 text-xs sm:text-sm font-medium"
                  >
                    Ver todas as fazendas ({farms.length})
                  </button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
