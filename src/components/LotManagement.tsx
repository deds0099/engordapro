import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Farm, Lot } from '@/types';
import { adaptationPhases } from '@/data/adaptationPhases';
import Header from './Header';

interface LotManagementProps {
  farms: Farm[];
  selectedFarmId?: string;
  onAddLot: (farmId: string, lot: Omit<Lot, 'id' | 'createdAt' | 'animals' | 'adaptationStartDate' | 'totalWeight' | 'concentrateAmount'>) => void;
  onDeleteLot: (farmId: string, lotId: string) => void;
  onNavigate: (view: string, data?: any) => void;
}

const LotManagement: React.FC<LotManagementProps> = ({ farms, selectedFarmId, onAddLot, onDeleteLot, onNavigate }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(selectedFarmId || '');
  const [formData, setFormData] = useState({
    name: '',
    breed: ''
  });

  const getAdaptationDay = (startDate: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(diffDays, 15);
  };

  const formatFeedInstruction = (instruction: string, totalWeight: number) => {
    const baseAmount = totalWeight * 0.02;
    
    // Replace fractions with actual kg amounts in the instruction text
    return instruction
      .replace(/1\/4 do concentrado/g, `${(baseAmount / 4).toFixed(1)}kg de concentrado`)
      .replace(/2\/4 do concentrado/g, `${(baseAmount / 2).toFixed(1)}kg de concentrado`)
      .replace(/1\/4 concentrado/g, `${(baseAmount / 4).toFixed(1)}kg de concentrado`)
      .replace(/2\/4 concentrado/g, `${(baseAmount / 2).toFixed(1)}kg de concentrado`)
      .replace(/Concentrado à vontade/g, `${baseAmount.toFixed(1)}kg de concentrado à vontade`)
      .replace(/Oferecer 1\/4 do concentrado/g, `Oferecer ${(baseAmount / 4).toFixed(1)}kg de concentrado`)
      .replace(/Oferecer 2\/4 do concentrado/g, `Oferecer ${(baseAmount / 2).toFixed(1)}kg de concentrado`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.trim() && selectedFarm) {
      const lotData = {
        farmId: selectedFarm,
        name: formData.name.trim(),
        breed: formData.breed.trim() || undefined
      };
      
      try {
        await onAddLot(selectedFarm, lotData);
        setFormData({ name: '', breed: '' });
        setShowForm(false);
      } catch (error) {
        console.error('Erro ao criar lote:', error);
        alert('Erro ao criar lote. Verifique o console para mais detalhes.');
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleDeleteLot = (farmId: string, lotId: string, lotName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o lote "${lotName}"? Esta ação não pode ser desfeita e todos os animais serão perdidos.`)) {
      onDeleteLot(farmId, lotId);
    }
  };

  const allLots = farms.flatMap(farm => 
    farm.lots.map(lot => ({ ...lot, farmName: farm.name }))
  );

  const filteredLots = selectedFarmId 
    ? allLots.filter(lot => lot.farmId === selectedFarmId)
    : allLots;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header title="Gestão de Lotes" subtitle="Gerencie os lotes de suas fazendas" />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="text-green-600 hover:text-green-700 mb-4 flex items-center gap-2"
            >
              ← Voltar ao Dashboard
            </button>
            <h1 className="text-3xl font-bold text-green-800">Gerenciamento de Lotes</h1>
            <p className="text-green-600">Cadastre e acompanhe seus lotes de engorda</p>
          </div>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary text-white hover:bg-secondary"
            disabled={farms.length === 0}
          >
            + Novo Lote
          </Button>
        </div>

        {farms.length === 0 && (
          <Card className="mb-8 bg-yellow-50 border-yellow-200">
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-yellow-800 mb-4">
                  Você precisa cadastrar uma fazenda antes de criar lotes.
                </p>
                <Button 
                  onClick={() => onNavigate('farms')}
                  className="bg-primary text-white hover:bg-secondary"
                >
                  Cadastrar Fazenda
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showForm && farms.length > 0 && (
          <Card className="mb-8 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-amber-700">Cadastrar Novo Lote</CardTitle>
              <CardDescription>Preencha os dados do lote de engorda</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farm">Fazenda *</Label>
                    <select
                      id="farm"
                      value={selectedFarm}
                      onChange={(e) => setSelectedFarm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione uma fazenda</option>
                      {farms.map(farm => (
                        <option key={farm.id} value={farm.id}>{farm.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome/Código do Lote *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      placeholder="Ex: Lote A1"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="breed">Raça Predominante</Label>
                    <Input
                      id="breed"
                      value={formData.breed}
                      onChange={(e) => setFormData(prev => ({...prev, breed: e.target.value}))}
                      placeholder="Ex: Nelore"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="bg-primary text-white hover:bg-secondary">
                    Cadastrar Lote
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => {
            const adaptationDay = getAdaptationDay(lot.adaptationStartDate);
            const currentPhase = adaptationPhases.find(phase => phase.day === adaptationDay) || adaptationPhases[adaptationPhases.length - 1];
            const isInAdaptation = adaptationDay < 15;
            
            return (
              <Card key={lot.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-amber-800 text-xl">{lot.name}</CardTitle>
                      <CardDescription className="mt-1">{lot.farmName}</CardDescription>
                      {lot.breed && (
                        <Badge variant="outline" className="mt-2">
                          {lot.breed}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isInAdaptation && (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          Dia {adaptationDay}
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLot(lot.farmId, lot.id, lot.name);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Animais:</span>
                      <span className="font-medium">{lot.animals.length}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Peso total:</span>
                      <span className="font-medium">{Math.round(lot.totalWeight)}kg</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Concentrado/dia:</span>
                      <span className="font-medium">{Math.round(lot.concentrateAmount)}kg</span>
                    </div>
                    
                    {isInAdaptation && (
                      <div className="bg-orange-50 p-3 rounded-lg text-sm">
                        <p className="font-medium text-orange-800 mb-1">{currentPhase.phase}</p>
                        <p className="text-orange-700 text-xs">
                          {formatFeedInstruction(currentPhase.instructions, lot.totalWeight)}
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t space-y-2">
                      <Button 
                        onClick={() => onNavigate('animals', { farmId: lot.farmId, lotId: lot.id })}
                        className="w-full bg-primary text-white hover:bg-secondary"
                      >
                        Gerenciar Animais
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredLots.length === 0 && farms.length > 0 && !showForm && (
          <Card className="bg-white shadow-lg">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="text-6xl mb-4">🧾</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Nenhum lote cadastrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie seu primeiro lote para começar a gestão dos animais em engorda.
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-white hover:bg-secondary"
                >
                  Cadastrar Primeiro Lote
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LotManagement;
