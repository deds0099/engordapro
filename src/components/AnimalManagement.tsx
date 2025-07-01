import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Scale, Trash2 } from 'lucide-react';
import { Farm, Animal } from '@/types';
import Header from './Header';

interface AnimalManagementProps {
  farms: Farm[];
  selectedFarmId?: string;
  selectedLotId?: string;
  onAddAnimal: (farmId: string, lotId: string, animal: {
    tagNumber: string;
    initialWeight: number;
    age: number;
    breed: string;
    entryDate: string;
    lotId: string;
  }) => void;
  onUpdateWeight: (farmId: string, lotId: string, animalId: string, weight: number) => void;
  onDeleteAnimal: (farmId: string, lotId: string, animalId: string) => void;
  onNavigate: (view: string, data?: any) => void;
}

const AnimalManagement: React.FC<AnimalManagementProps> = ({
  farms,
  selectedFarmId,
  selectedLotId,
  onAddAnimal,
  onUpdateWeight,
  onDeleteAnimal,
  onNavigate
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showWeightForm, setShowWeightForm] = useState<string | null>(null);
  const [showWeightHistory, setShowWeightHistory] = useState<string | null>(null);
  const [newAnimal, setNewAnimal] = useState({
    tagNumber: '',
    initialWeight: '',
    age: '',
    breed: '',
    entryDate: new Date().toISOString().split('T')[0]
  });
  const [newWeight, setNewWeight] = useState('');

  const selectedFarm = farms.find(f => f.id === selectedFarmId);
  const selectedLot = selectedFarm?.lots.find(l => l.id === selectedLotId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmId || !selectedLotId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onAddAnimal(selectedFarmId, selectedLotId, {
        tagNumber: newAnimal.tagNumber,
        initialWeight: Number(newAnimal.initialWeight),
        age: Number(newAnimal.age),
        breed: newAnimal.breed,
        entryDate: newAnimal.entryDate,
        lotId: selectedLotId
      });

      setNewAnimal({
        tagNumber: '',
        initialWeight: '',
        age: '',
        breed: '',
        entryDate: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erro ao adicionar animal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWeight = (animalId: string) => {
    if (!selectedFarmId || !selectedLotId || !newWeight) return;
    
    onUpdateWeight(selectedFarmId, selectedLotId, animalId, Number(newWeight));
    setNewWeight('');
    setShowWeightForm(null);
  };

  const handleDeleteAnimal = (animalId: string, tagNumber: string) => {
    if (!selectedFarmId || !selectedLotId) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o animal com brinco "${tagNumber}"? Esta ação não pode ser desfeita.`)) {
      onDeleteAnimal(selectedFarmId, selectedLotId, animalId);
    }
  };

  const calculateGMD = (animal: Animal) => {
    if (animal.weightHistory.length < 2) return 0;
    
    const firstRecord = animal.weightHistory[0];
    const lastRecord = animal.weightHistory[animal.weightHistory.length - 1];
    const daysDiff = Math.abs(new Date(lastRecord.date).getTime() - new Date(firstRecord.date).getTime()) / (1000 * 60 * 60 * 24);
    const weightDiff = lastRecord.weight - firstRecord.weight;
    
    return daysDiff > 0 ? Number((weightDiff / daysDiff).toFixed(2)) : 0;
  };

  if (!selectedFarm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-green-800">Gerenciamento de Animais</h1>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Selecione uma fazenda primeiro</p>
              <Button onClick={() => onNavigate('farms')} className="mt-4 bg-primary text-white hover:bg-secondary">
                Ir para Fazendas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedLot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-green-800">Gerenciamento de Animais</h1>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Fazenda: {selectedFarm.name}</h2>
              <p className="text-gray-500 mb-4">Selecione um lote para gerenciar os animais</p>
              <Button onClick={() => onNavigate('lots', { farmId: selectedFarmId })} className="bg-primary text-white hover:bg-secondary">
                Ver Lotes desta Fazenda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header title="Gestão de Animais" subtitle="Gerencie os animais de seus lotes" />
        
        {/* Navegação e Ações */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('lots', { farmId: selectedFarmId })}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Lotes
            </button>
          </div>
          
          <Button 
            onClick={() => setShowAddForm(true)} 
            className="bg-primary text-white hover:bg-secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Animal
          </Button>
        </div>

        {/* Informações do Lote */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  Lote: {selectedLot.name}
                </h2>
                <p className="text-gray-600">
                  Fazenda: {selectedFarm.name} • {selectedLot.animals.length} animais
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-green-50 text-green-700 border-green-200">
                  Ativo
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-700">{selectedLot.animals.length}</div>
                  <div className="text-sm text-blue-600 font-medium">Total de Animais</div>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🐄</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-700">
                    {selectedLot.animals.length > 0 
                      ? Math.round(selectedLot.animals.reduce((acc, animal) => acc + animal.currentWeight, 0) / selectedLot.animals.length)
                      : 0}kg
                  </div>
                  <div className="text-sm text-green-600 font-medium">Peso Médio</div>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚖️</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-700">
                    {selectedLot.animals.length > 0
                      ? (selectedLot.animals.reduce((acc, animal) => acc + calculateGMD(animal), 0) / selectedLot.animals.length).toFixed(2)
                      : '0.00'}kg
                  </div>
                  <div className="text-sm text-purple-600 font-medium">GMD Média</div>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-orange-700">
                    {Math.round(selectedLot.concentrateAmount)}kg
                  </div>
                  <div className="text-sm text-orange-600 font-medium">Concentrado/Dia</div>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌾</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de Adicionar Animal */}
        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                Adicionar Novo Animal
              </CardTitle>
              <CardDescription className="text-gray-600">
                Preencha os dados do novo animal para o lote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAnimal} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tagNumber" className="text-sm font-medium text-gray-700">
                      Número do Brinco *
                    </Label>
                    <Input
                      id="tagNumber"
                      value={newAnimal.tagNumber}
                      onChange={(e) => setNewAnimal({...newAnimal, tagNumber: e.target.value})}
                      placeholder="Ex: 12345"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialWeight" className="text-sm font-medium text-gray-700">
                      Peso Inicial (kg) *
                    </Label>
                    <Input
                      id="initialWeight"
                      type="number"
                      step="0.1"
                      value={newAnimal.initialWeight}
                      onChange={(e) => setNewAnimal({...newAnimal, initialWeight: e.target.value})}
                      placeholder="Ex: 350.5"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                      Idade (meses) *
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={newAnimal.age}
                      onChange={(e) => setNewAnimal({...newAnimal, age: e.target.value})}
                      placeholder="Ex: 18"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breed" className="text-sm font-medium text-gray-700">
                      Raça *
                    </Label>
                    <Input
                      id="breed"
                      value={newAnimal.breed}
                      onChange={(e) => setNewAnimal({...newAnimal, breed: e.target.value})}
                      placeholder="Ex: Nelore"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entryDate" className="text-sm font-medium text-gray-700">
                      Data de Entrada *
                    </Label>
                    <Input
                      id="entryDate"
                      type="date"
                      value={newAnimal.entryDate}
                      onChange={(e) => setNewAnimal({...newAnimal, entryDate: e.target.value})}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-primary text-white hover:bg-secondary disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adicionando...
                        </div>
                      ) : (
                        'Adicionar Animal'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={isSubmitting}
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Animais */}
        <div className="space-y-6">
          {selectedLot.animals.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🐄</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhum animal cadastrado
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Este lote ainda não possui animais. Adicione o primeiro animal para começar o controle.
                </p>
                <Button 
                  onClick={() => setShowAddForm(true)} 
                  className="bg-primary text-white hover:bg-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Animal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {selectedLot.animals.map((animal) => (
                <Card key={animal.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header do Animal */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">🐄</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              Brinco: {animal.tagNumber}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                {animal.breed}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                {animal.age} meses
                              </span>
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                GMD: {calculateGMD(animal).toFixed(2)}kg/dia
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => setShowWeightForm(showWeightForm === animal.id ? null : animal.id)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <Scale className="w-4 h-4 mr-1" />
                            Pesar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteAnimal(animal.id, animal.tagNumber)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dados do Animal */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-600 font-medium mb-1">Peso Inicial</div>
                          <div className="text-xl font-bold text-blue-700">{animal.initialWeight}kg</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-600 font-medium mb-1">Peso Atual</div>
                          <div className="text-xl font-bold text-green-700">{animal.currentWeight}kg</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-sm text-purple-600 font-medium mb-1">Ganho Total</div>
                          <div className={`text-xl font-bold ${
                            animal.currentWeight > animal.initialWeight 
                              ? 'text-green-600' 
                              : animal.currentWeight < animal.initialWeight 
                              ? 'text-red-600' 
                              : 'text-gray-600'
                          }`}>
                            {animal.currentWeight > animal.initialWeight ? '+' : ''}
                            {(animal.currentWeight - animal.initialWeight).toFixed(1)}kg
                          </div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-sm text-orange-600 font-medium mb-1">Dias no Lote</div>
                          <div className="text-xl font-bold text-orange-700">
                            {Math.ceil((new Date().getTime() - new Date(animal.entryDate).getTime()) / (1000 * 60 * 60 * 24))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Formulário de Pesagem */}
                    {showWeightForm === animal.id && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-t border-blue-100">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                          <div className="flex-1">
                            <Label htmlFor={`weight-${animal.id}`} className="text-sm font-medium text-gray-700 mb-2 block">
                              Novo Peso (kg) *
                            </Label>
                            <Input
                              id={`weight-${animal.id}`}
                              type="number"
                              step="0.1"
                              value={newWeight}
                              onChange={(e) => setNewWeight(e.target.value)}
                              placeholder="Ex: 450.5"
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleUpdateWeight(animal.id)} 
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Scale className="w-4 h-4 mr-2" />
                              Salvar Peso
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowWeightForm(null)}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Histórico de Pesagens */}
                    {animal.weightHistory && animal.weightHistory.length > 0 && (
                      <div className="border-t border-gray-100">
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-sm">📊</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">Histórico de Pesagens</h4>
                                <p className="text-sm text-gray-600">{animal.weightHistory.length} pesagem{animal.weightHistory.length > 1 ? 'ens' : ''} registrada{animal.weightHistory.length > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowWeightHistory(showWeightHistory === animal.id ? null : animal.id)}
                              className="border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors duration-200"
                            >
                              {showWeightHistory === animal.id ? 'Ocultar Histórico' : 'Ver Histórico'}
                            </Button>
                          </div>
                          
                          {showWeightHistory === animal.id && (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {animal.weightHistory
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((record, index) => (
                                  <div key={record.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                    <div className="flex-1">
                                      <div className="font-bold text-lg text-purple-700">
                                        {record.weight} kg
                                      </div>
                                      <div className="text-sm text-purple-600">
                                        {new Date(record.date).toLocaleDateString('pt-BR', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-purple-500 font-medium">
                                        #{animal.weightHistory.length - index}
                                      </div>
                                      <div className="text-xs text-purple-400">
                                        {index === 0 ? 'Última' : 'Anterior'}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalManagement;
