import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, BookOpen, Clock } from 'lucide-react';
import { Farm } from '@/types';
import { adaptationPhases } from '@/data/adaptationPhases';
import Header from './Header';

interface AdaptationProtocolProps {
  farms: Farm[];
  onNavigate: (view: string, data?: any) => void;
}

const AdaptationProtocol: React.FC<AdaptationProtocolProps> = ({ 
  farms, 
  onNavigate 
}) => {
  const getAdaptationDay = (startDate: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(diffDays, 15);
  };

  const formatFeedInstruction = (instruction: string, totalWeight: number) => {
    const baseAmount = totalWeight * 0.02;
    
    return instruction
      .replace(/1\/4 do concentrado/g, `${(baseAmount / 4).toFixed(1)}kg de concentrado`)
      .replace(/2\/4 do concentrado/g, `${(baseAmount / 2).toFixed(1)}kg de concentrado`)
      .replace(/1\/4 concentrado/g, `${(baseAmount / 4).toFixed(1)}kg de concentrado`)
      .replace(/2\/4 concentrado/g, `${(baseAmount / 2).toFixed(1)}kg de concentrado`)
      .replace(/Concentrado à vontade/g, `${baseAmount.toFixed(1)}kg de concentrado à vontade`)
      .replace(/Oferecer 1\/4 do concentrado/g, `Oferecer ${(baseAmount / 4).toFixed(1)}kg de concentrado`)
      .replace(/Oferecer 2\/4 do concentrado/g, `Oferecer ${(baseAmount / 2).toFixed(1)}kg de concentrado`);
  };

  // Encontrar lotes em adaptação para mostrar estatísticas
  const lotsInAdaptation = farms.flatMap(farm => 
    farm.lots.filter(lot => {
      const adaptationDay = getAdaptationDay(lot.adaptationStartDate);
      return adaptationDay < 15;
    }).map(lot => ({ ...lot, farmName: farm.name }))
  );

  const totalAnimalsInAdaptation = lotsInAdaptation.reduce((acc, lot) => acc + lot.animals.length, 0);
  const totalWeightInAdaptation = lotsInAdaptation.reduce((acc, lot) => acc + lot.totalWeight, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header title="Protocolo de Adaptação" subtitle="Acompanhe a adaptação dos lotes" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">Protocolo de Adaptação</h2>
              <p className="text-green-600">Guia completo para adaptação gradual ao concentrado</p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary text-lg px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            {lotsInAdaptation.length} lotes em adaptação
          </Badge>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{lotsInAdaptation.length}</div>
              <div className="text-sm text-gray-600">Lotes em Adaptação</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{totalAnimalsInAdaptation}</div>
              <div className="text-sm text-gray-600">Animais em Adaptação</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(totalWeightInAdaptation)}kg
              </div>
              <div className="text-sm text-gray-600">Peso Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">15</div>
              <div className="text-sm text-gray-600">Dias do Protocolo</div>
            </CardContent>
          </Card>
        </div>

        {/* Informações Gerais do Protocolo */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Sobre o Protocolo de Adaptação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">Objetivo</h4>
                <p className="text-black text-sm">
                  Adaptar gradualmente os animais ao concentrado, evitando problemas digestivos 
                  e garantindo uma transição segura para o sistema de autoconsumo (autogrão).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Estrutura</h4>
                <p className="text-black text-sm">
                  O protocolo completo dura 15 dias, dividido em 6 fases progressivas que 
                  aumentam gradualmente a quantidade de concentrado oferecido.
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Cálculo do Concentrado</h4>
              <p className="text-black text-sm">
                <strong>Base:</strong> 2% do peso vivo total do lote por dia.<br/>
                <strong>Exemplo:</strong> Lote com 10.000kg = 200kg de concentrado/dia<br/>
                <strong>Fracionamento:</strong> 1/4 = 50kg, 2/4 = 100kg, à vontade = 200kg
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Protocolo Completo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Protocolo de Adaptação - 6 Fases (15 dias)
            </CardTitle>
            <CardDescription>
              Cronograma otimizado para adaptação gradual dos animais ao concentrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adaptationPhases.map((phase) => {
                // Calcular quantidades baseadas em um peso de exemplo (10.000kg)
                const exampleWeight = 10000;
                const baseAmount = exampleWeight * 0.02; // 200kg
                
                return (
                  <div 
                    key={phase.day}
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          {phase.day === 1 ? "Dias 1-3" : 
                           phase.day === 4 ? "Dias 4-6" : 
                           phase.day === 7 ? "Dias 7-10" : 
                           phase.day === 11 ? "Dias 11-13" : 
                           phase.day === 14 ? "Dia 14" : "Dia 15"}
                        </Badge>
                        <h3 className="font-semibold text-gray-800">
                          {phase.phase}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Alimentação da Manhã</h4>
                        <p className="text-sm text-gray-600">{phase.morningFeed}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Exemplo: {formatFeedInstruction(phase.morningFeed, exampleWeight)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Alimentação da Tarde</h4>
                        <p className="text-sm text-gray-600">{phase.afternoonFeed}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Exemplo: {formatFeedInstruction(phase.afternoonFeed, exampleWeight)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <strong>Instruções:</strong> {formatFeedInstruction(phase.instructions, exampleWeight)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Lotes Atualmente em Adaptação */}
        {lotsInAdaptation.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-orange-800">Lotes Atualmente em Adaptação</CardTitle>
              <CardDescription>Status atual dos lotes que estão seguindo o protocolo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lotsInAdaptation.map((lot) => {
                  const adaptationDay = getAdaptationDay(lot.adaptationStartDate);
                  const currentPhase = adaptationPhases.find(phase => phase.day === adaptationDay) || adaptationPhases[adaptationPhases.length - 1];
                  
                  return (
                    <div key={lot.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{lot.name}</h4>
                          <p className="text-sm text-gray-600">{lot.farmName} • {lot.animals.length} animais • {Math.round(lot.totalWeight)}kg</p>
                        </div>
                        <Badge className="bg-orange-600 text-white">
                          Dia {adaptationDay}/15
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Fase atual:</strong> {currentPhase.phase}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botões de Ação */}
        <div className="mt-6 flex gap-4">
          <Button 
            onClick={() => onNavigate('lots')}
            className="bg-primary text-white hover:bg-secondary"
          >
            Ver Todos os Lotes
          </Button>
          <Button 
            onClick={() => onNavigate('dashboard')}
            variant="outline"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdaptationProtocol; 