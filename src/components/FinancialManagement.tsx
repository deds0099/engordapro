import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Farm, Transaction } from '@/types';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, DollarSign, Trash2 } from 'lucide-react';
import Header from './Header';
import { useAuth } from '@/hooks/useAuth';

interface FinancialManagementProps {
  farms: Farm[];
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onNavigate: (view: string, data?: any) => void;
}

const FinancialManagement: React.FC<FinancialManagementProps> = ({
  farms,
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onNavigate
}) => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    farmId: '',
    lotId: ''
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleAddTransaction = async () => {
    if (!formData.amount || !formData.description || !formData.category || !formData.farmId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, insira um valor válido maior que zero.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onAddTransaction({
        type: formData.type,
        amount: amount,
        description: formData.description.trim(),
        category: formData.category.trim(),
        farmId: formData.farmId,
        lotId: formData.lotId || undefined,
        userId: user?.uid || ''
      });

      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        farmId: '',
        lotId: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      
      let errorMessage = 'Erro ao adicionar transação.';
      
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          errorMessage = 'Erro de permissão: Sem acesso para adicionar transações.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Erro de conexão: Verifique sua internet.';
        } else if (error.message.includes('Firestore não está inicializado')) {
          errorMessage = 'Erro de configuração: Firebase não inicializado.';
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      alert(errorMessage + '\n\nVerifique o console para mais detalhes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string, description: string, amount: number) => {
    const confirmMessage = `Tem certeza que deseja excluir a transação:\n\n"${description}"\nValor: R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nEsta ação não pode ser desfeita.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await onDeleteTransaction(transactionId);
      } catch (error) {
        console.error('Erro ao deletar transação:', error);
        
        let errorMessage = 'Erro ao deletar transação.';
        
        if (error instanceof Error) {
          if (error.message.includes('permission-denied')) {
            errorMessage = 'Erro de permissão: Sem acesso para deletar transações.';
          } else if (error.message.includes('network')) {
            errorMessage = 'Erro de conexão: Verifique sua internet.';
          } else {
            errorMessage = `Erro: ${error.message}`;
          }
        }
        
        alert(errorMessage + '\n\nVerifique o console para mais detalhes.');
      }
    }
  };

  const getTransactionsByFarm = (farmId: string) => {
    return transactions.filter(t => t.farmId === farmId);
  };

  const getFarmBalance = (farmId: string) => {
    const farmTransactions = getTransactionsByFarm(farmId);
    const income = farmTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = farmTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return income - expenses;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header title="Gestão Financeira" subtitle="Controle de receitas e despesas" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-green-800">Controle Financeiro</h1>
          </div>
          
          <Button onClick={() => setShowAddForm(true)} className="bg-primary text-white hover:bg-secondary">
            Nova Transação
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-green-700 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">
                R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-red-700 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-800">
                R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-2 ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                <DollarSign className="w-5 h-5" />
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${balance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700">📊 Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{transactions.length}</div>
            </CardContent>
          </Card>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nova Transação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo *</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'income' | 'expense'})}
                    required
                  >
                    <option value="expense">💰 Despesa</option>
                    <option value="income">💵 Receita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0,00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fazenda *</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.farmId}
                    onChange={(e) => setFormData({...formData, farmId: e.target.value})}
                    required
                  >
                    <option value="">Selecione uma fazenda</option>
                    {farms.map(farm => (
                      <option key={farm.id} value={farm.id}>{farm.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria *</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Ração, Medicamento, Venda de gado..."
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Descrição *</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva detalhes da transação..."
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={handleAddTransaction} 
                  disabled={isSubmitting}
                  className="bg-primary text-white hover:bg-secondary disabled:opacity-50"
                >
                  {isSubmitting ? 'Adicionando...' : 'Adicionar Transação'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  disabled={isSubmitting}
                  className="border-primary text-primary hover:bg-secondary hover:text-white disabled:opacity-50"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Nenhuma transação registrada</p>
                  <Button onClick={() => setShowAddForm(true)} className="bg-primary text-white hover:bg-secondary">
                    Registrar Primeira Transação
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((transaction) => {
                      const farm = farms.find(f => f.id === transaction.farmId);
                      return (
                        <div key={transaction.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                variant={transaction.type === 'income' ? 'default' : 'destructive'}
                                className={transaction.type === 'income' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
                              >
                                {transaction.type === 'income' ? '💰 Receita' : '💸 Despesa'}
                              </Badge>
                              <span className="text-sm font-medium text-gray-700">{transaction.category}</span>
                            </div>
                            <p className="font-medium text-gray-900 mb-1">{transaction.description}</p>
                            <p className="text-sm text-gray-600">🏛️ {farm?.name || 'Fazenda não encontrada'}</p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <div className="text-right">
                              <div className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                              <div className="text-sm text-gray-500">
                                📅 {new Date(transaction.date).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTransaction(transaction.id, transaction.description, transaction.amount)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                              title="Excluir transação"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saldo por Fazenda</CardTitle>
            </CardHeader>
            <CardContent>
              {farms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma fazenda cadastrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {farms.map((farm) => {
                    const farmBalance = getFarmBalance(farm.id);
                    const farmTransactions = getTransactionsByFarm(farm.id);
                    const farmIncome = farmTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
                    const farmExpenses = farmTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
                    
                    return (
                      <div key={farm.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">🏛️ {farm.name}</h4>
                            <p className="text-sm text-gray-600">{farmTransactions.length} transações</p>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-lg ${farmBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              R$ {farmBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {farmBalance >= 0 ? '💰 Lucro' : '💸 Prejuízo'}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-green-600">
                            💵 Receitas: R$ {farmIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-red-600">
                            💸 Despesas: R$ {farmExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
