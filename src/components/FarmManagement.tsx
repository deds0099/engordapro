import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Farm } from '@/types';
import { Plus, ArrowLeft } from 'lucide-react';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth';

interface FarmManagementProps {
  farms: Farm[];
  onAddFarm: (farm: Omit<Farm, 'id' | 'createdAt' | 'lots'>) => void;
  onDeleteFarm: (farmId: string) => void;
  onNavigate: (view: string, data?: any) => void;
}

const FarmManagement: React.FC<FarmManagementProps> = ({ farms, onAddFarm, onDeleteFarm, onNavigate }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit chamado');
    console.log('formData:', formData);
    console.log('user:', user);
    
    if (formData.name.trim()) {
      try {
        console.log('Chamando onAddFarm...');
        await onAddFarm({
          name: formData.name.trim(),
          location: formData.location.trim() || undefined,
          userId: user?.uid || ''
        });
        console.log('Fazenda criada com sucesso!');
        setFormData({ name: '', location: '' });
        setShowForm(false);
      } catch (error) {
        console.error('Erro ao criar fazenda:', error);
        alert('Erro ao criar fazenda. Verifique o console para mais detalhes.');
      }
    } else {
      alert('Por favor, preencha o nome da fazenda.');
    }
  };

  const handleDeleteFarm = (farmId: string, farmName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a fazenda "${farmName}"? Esta ação não pode ser desfeita e todos os lotes e animais serão perdidos.`)) {
      onDeleteFarm(farmId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header title="Gestão de Fazendas" subtitle="Cadastre e gerencie suas propriedades" />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="text-green-600 hover:text-green-700 mb-4 flex items-center gap-2"
            >
              ← Voltar ao Dashboard
            </button>
          </div>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary text-white hover:bg-secondary"
          >
            + Nova Fazenda
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-700">Cadastrar Nova Fazenda</CardTitle>
              <CardDescription>Preencha os dados da propriedade</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Fazenda *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      placeholder="Ex: Fazenda São João"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                      placeholder="Ex: Cidade - Estado"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="bg-primary text-white hover:bg-secondary">
                    Cadastrar Fazenda
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
          {farms.map((farm) => (
            <Card key={farm.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-green-800 text-xl">{farm.name}</CardTitle>
                    {farm.location && (
                      <CardDescription className="mt-2">{farm.location}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="ml-2">
                      {farm.lots.length} lotes
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFarm(farm.id, farm.name);
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
                    <span className="text-gray-600">Data de cadastro:</span>
                    <span className="font-medium">
                      {new Date(farm.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total de animais:</span>
                    <span className="font-medium">
                      {farm.lots.reduce((acc, lot) => acc + lot.animals.length, 0)}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => onNavigate('lots', { farmId: farm.id })}
                      className="w-full bg-primary text-white hover:bg-secondary"
                    >
                      Gerenciar Lotes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {farms.length === 0 && !showForm && (
          <Card className="bg-white shadow-lg">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="text-6xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Nenhuma fazenda cadastrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece cadastrando sua primeira propriedade para iniciar o manejo dos bovinos.
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-white hover:bg-secondary"
                >
                  Cadastrar Primeira Fazenda
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FarmManagement;
