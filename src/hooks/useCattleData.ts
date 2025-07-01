import { useState, useEffect } from 'react';
import { Farm, Lot, Animal, Transaction } from '@/types';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
  arrayUnion,
  arrayRemove,
  query,
  where
} from 'firebase/firestore';
import { useAuth } from './useAuth';

export const useCattleData = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Carregar fazendas em tempo real
  useEffect(() => {
    console.log('=== LISTENER DE FAZENDAS ===');
    console.log('useEffect de fazendas executado');
    console.log('Usuário atual:', user);
    console.log('User ID:', user?.uid);
    console.log('User email:', user?.email);
    
    if (!user) {
      console.log('Usuário não autenticado, limpando dados');
      setFarms([]);
      setTransactions([]);
      return;
    }

    console.log('Criando query para fazendas do usuário:', user.uid);
    const farmsQuery = query(
      collection(db, 'fazendas'),
      where('userId', '==', user.uid)
    );

    console.log('Query criada, iniciando listener...');
    const unsub = onSnapshot(farmsQuery, async (snapshot) => {
      console.log('=== SNAPSHOT RECEBIDO ===');
      console.log('Snapshot recebido, documentos:', snapshot.docs.length);
      console.log('Mudanças:', snapshot.docChanges().length);
      
      snapshot.docChanges().forEach(change => {
        console.log('Mudança:', change.type, 'ID:', change.doc.id, 'Dados:', change.doc.data());
      });
      
      const farmsData: Farm[] = [];
      
      for (const docFarm of snapshot.docs) {
        const farmData = docFarm.data();
        console.log('Processando fazenda:', docFarm.id, farmData);
        
        // Converter timestamp do Firestore para Date
        let createdAt: Date;
        if (farmData.createdAt && typeof farmData.createdAt.toDate === 'function') {
          createdAt = farmData.createdAt.toDate();
        } else if (farmData.createdAt) {
          createdAt = new Date(farmData.createdAt);
        } else {
          createdAt = new Date();
        }
        
        const farm: Farm = {
          ...farmData,
          id: docFarm.id,
          createdAt,
          lots: []
        } as Farm;
        
        farmsData.push(farm);
      }
      
      console.log('Fazendas processadas:', farmsData.length);
      console.log('IDs das fazendas:', farmsData.map(f => f.id));
      setFarms(farmsData);
      
      // Carregar dados completos para cada fazenda
      farmsData.forEach(farm => {
        loadFarmData(farm.id);
      });
    }, (error) => {
      console.error('Erro no listener de fazendas:', error);
    });
    
    return () => {
      console.log('Desconectando listener de fazendas');
      unsub();
    };
  }, [user?.uid]);

  // Carregar transações em tempo real
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const transactionsQuery = query(
      collection(db, 'transacoes'),
      where('userId', '==', user.uid)
    );

    const unsub = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsData: Transaction[] = snapshot.docs.map(doc => {
        const data = doc.data();
        // Converter timestamp do Firestore para Date
        let date: Date;
        if (data.date && typeof data.date.toDate === 'function') {
          date = data.date.toDate();
        } else if (data.date) {
          date = new Date(data.date);
        } else {
          date = new Date();
        }
        return {
          ...data,
          id: doc.id,
          date
        } as Transaction;
      });
      setTransactions(transactionsData);
    });

    return () => unsub();
  }, [user?.uid]);

  // CRUD Fazenda
  const addFarm = async (farm: Omit<Farm, 'id' | 'createdAt' | 'lots'>) => {
    console.log('=== DEBUG ADD FARM ===');
    console.log('addFarm chamada com:', farm);
    console.log('Usuário atual:', user);
    console.log('User ID:', user?.uid);
    console.log('User email:', user?.email);
    console.log('Ambiente:', import.meta.env.MODE);
    console.log('URL atual:', window.location.href);
    console.log('Timestamp atual:', new Date().toISOString());
    
    if (!user) {
      console.error('Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    const now = new Date();
    const farmData = {
      name: farm.name,
      location: farm.location || '',
      userId: user.uid,
      createdAt: now,
    };
    
    console.log('Dados da fazenda a serem salvos:', farmData);
    console.log('Tipo dos dados:', typeof farmData);
    console.log('userId no farmData:', farmData.userId);
    console.log('userId do usuário:', user.uid);
    console.log('São iguais?', farmData.userId === user.uid);
    
    try {
      console.log('Tentando adicionar documento na coleção fazendas...');
      console.log('Database:', db);
      console.log('Collection path:', 'fazendas');
      console.log('Firebase config:', db.app.options);
      console.log('Firebase project ID:', db.app.options.projectId);
      
      // Teste de conexão com Firestore
      console.log('Testando conexão com Firestore...');
      const testCollection = collection(db, 'test');
      console.log('Test collection criada:', testCollection);
      
      const docRef = await addDoc(collection(db, 'fazendas'), farmData);
      console.log('Fazenda criada com sucesso, ID:', docRef.id);
      console.log('=== FIM DEBUG ADD FARM ===');
      return { ...farm, id: docRef.id, createdAt: now, lots: [] };
    } catch (error) {
      console.error('=== ERRO AO ADICIONAR FAZENDA ===');
      console.error('Erro detalhado ao adicionar fazenda:', error);
      console.error('Tipo do erro:', typeof error);
      console.error('Código do erro:', (error as any)?.code);
      console.error('Mensagem do erro:', (error as any)?.message);
      console.error('Stack trace:', (error as any)?.stack);
      console.error('Nome do erro:', (error as any)?.name);
      console.error('=== FIM ERRO ===');
      throw error;
    }
  };

  const deleteFarm = async (farmId: string) => {
    await deleteDoc(doc(db, 'fazendas', farmId));
  };

  // CRUD Lote
  const addLot = async (farmId: string, lot: Omit<Lot, 'id' | 'createdAt' | 'animals' | 'adaptationStartDate' | 'totalWeight' | 'concentrateAmount'>) => {
    if (!farmId || farmId.length === 0) {
      throw new Error('farmId é obrigatório e não pode estar vazio');
    }
    
    const now = new Date();
    const lotData = {
      ...lot,
      createdAt: now,
      adaptationStartDate: now,
      totalWeight: 0,
      concentrateAmount: 0,
    };
    
    try {
      const docRef = await addDoc(collection(db, 'fazendas', farmId, 'lotes'), lotData);
      // Recarregar dados da fazenda após adicionar lote
      setTimeout(() => loadFarmData(farmId), 100);
      return { ...lot, id: docRef.id, createdAt: now, animals: [], adaptationStartDate: now, totalWeight: 0, concentrateAmount: 0 };
    } catch (error) {
      console.error('Erro ao adicionar lote:', error);
      throw error;
    }
  };

  const deleteLot = async (farmId: string, lotId: string) => {
    await deleteDoc(doc(db, 'fazendas', farmId, 'lotes', lotId));
    // Recarregar dados da fazenda após deletar lote
    setTimeout(() => loadFarmData(farmId), 100);
  };

  // CRUD Animal
  const addAnimal = async (farmId: string, lotId: string, animal: {
    tagNumber: string;
    initialWeight: number;
    age: number;
    breed: string;
    entryDate: string;
    lotId: string;
  }) => {
    const animalId = Date.now().toString();
    
    const newAnimal: Animal = {
      ...animal,
      id: animalId,
      currentWeight: animal.initialWeight,
      entryDate: animal.entryDate,
      weightHistory: [] // Não criar entrada inicial no histórico
    };
    
    await addDoc(collection(db, 'fazendas', farmId, 'lotes', lotId, 'animais'), newAnimal);
    
    // Recarregar dados da fazenda após adicionar animal
    setTimeout(() => loadFarmData(farmId), 100);
    return newAnimal;
  };

  const deleteAnimal = async (farmId: string, lotId: string, animalId: string) => {
    const animalsSnap = await getDocs(collection(db, 'fazendas', farmId, 'lotes', lotId, 'animais'));
    const animalDoc = animalsSnap.docs.find(doc => doc.data().id === animalId);
    if (animalDoc) {
      await deleteDoc(doc(db, 'fazendas', farmId, 'lotes', lotId, 'animais', animalDoc.id));
      
      // Recalcular totais do lote após deletar animal
      const remainingAnimalsSnap = await getDocs(collection(db, 'fazendas', farmId, 'lotes', lotId, 'animais'));
      const remainingAnimals = remainingAnimalsSnap.docs.map(doc => doc.data() as Animal);
      const totalWeight = remainingAnimals.reduce((acc, animal) => acc + animal.currentWeight, 0);
      const concentrateAmount = totalWeight * 0.02;
      
      // Atualizar o lote com os novos totais
      await updateDoc(doc(db, 'fazendas', farmId, 'lotes', lotId), {
        totalWeight,
        concentrateAmount
      });
      
      // Recarregar dados da fazenda após deletar animal
      setTimeout(() => loadFarmData(farmId), 100);
    }
  };



  const updateAnimalWeight = async (farmId: string, lotId: string, animalId: string, weight: number) => {
    try {
      const animalsSnap = await getDocs(collection(db, 'fazendas', farmId, 'lotes', lotId, 'animais'));
      const animalDoc = animalsSnap.docs.find(doc => doc.data().id === animalId);
      
      if (animalDoc) {
        const animalData = animalDoc.data() as Animal;
        
        // Sempre adicionar nova pesagem ao histórico (permitir múltiplas pesagens por dia)
        const newHistory = [
          ...animalData.weightHistory,
          {
            id: `${animalId}_${Date.now()}`,
            animalId,
            weight,
            date: new Date()
          }
        ];
        
        // Atualizar peso atual para o novo peso
        await updateDoc(doc(db, 'fazendas', farmId, 'lotes', lotId, 'animais', animalDoc.id), {
          currentWeight: weight,
          weightHistory: newHistory
        });
        
        // Recalcular totais do lote
        const allAnimalsSnap = await getDocs(collection(db, 'fazendas', farmId, 'lotes', lotId, 'animais'));
        const allAnimals = allAnimalsSnap.docs.map(doc => doc.data() as Animal);
        const totalWeight = allAnimals.reduce((acc, animal) => acc + animal.currentWeight, 0);
        const concentrateAmount = totalWeight * 0.02;
        
        // Atualizar o lote com os novos totais
        await updateDoc(doc(db, 'fazendas', farmId, 'lotes', lotId), {
          totalWeight,
          concentrateAmount
        });
        
        // Recarregar dados da fazenda após atualizar peso
        setTimeout(() => loadFarmData(farmId), 100);
      } else {
        throw new Error('Animal não encontrado');
      }
    } catch (error) {
      console.error('Erro ao atualizar peso:', error);
      throw error;
    }
  };

  // CRUD Transação
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      console.log('Tentando adicionar transação:', transaction);
      
      // Verificar se o db está disponível
      if (!db) {
        throw new Error('Firestore não está inicializado');
      }
      
      // Testar se conseguimos acessar a coleção
      try {
        const testQuery = await getDocs(collection(db, 'transacoes'));
        console.log('Teste de leitura da coleção transacoes:', testQuery.docs.length, 'documentos encontrados');
      } catch (testError) {
        console.error('Erro ao testar acesso à coleção transacoes:', testError);
        throw new Error(`Sem permissão para acessar a coleção transacoes: ${testError}`);
      }
      
      const now = new Date();
      const transactionData = {
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        farmId: transaction.farmId,
        lotId: transaction.lotId || null,
        userId: user.uid,
        date: now
      };
      
      console.log('Dados da transação para salvar:', transactionData);
      
      const transacoesRef = collection(db, 'transacoes');
      console.log('Referência da coleção:', transacoesRef);
      
      const docRef = await addDoc(transacoesRef, transactionData);
      
      console.log('Transação adicionada com sucesso, ID:', docRef.id);
      
      return { ...transaction, id: docRef.id, date: now };
    } catch (error) {
      console.error('Erro detalhado ao adicionar transação:', error);
      console.error('Dados da transação que falhou:', transaction);
      console.error('Tipo do erro:', typeof error);
      console.error('Mensagem do erro:', error instanceof Error ? error.message : 'Erro desconhecido');
      
      // Verificar se é um erro de permissão
      if (error instanceof Error && error.message.includes('permission-denied')) {
        throw new Error('Sem permissão para adicionar transações. Verifique as regras de segurança do Firestore.');
      }
      
      throw error;
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      console.log('Tentando deletar transação:', transactionId);
      
      // Verificar se o db está disponível
      if (!db) {
        throw new Error('Firestore não está inicializado');
      }
      
      await deleteDoc(doc(db, 'transacoes', transactionId));
      
      console.log('Transação deletada com sucesso, ID:', transactionId);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      console.error('ID da transação que falhou:', transactionId);
      
      if (error instanceof Error && error.message.includes('permission-denied')) {
        throw new Error('Sem permissão para deletar transações. Verifique as regras de segurança do Firestore.');
      }
      
      throw error;
    }
  };

  // Função para carregar dados completos de uma fazenda
  const loadFarmData = async (farmId: string) => {
    try {
      const lotsSnap = await getDocs(collection(db, 'fazendas', farmId, 'lotes'));
      const lots: Lot[] = [];
      
      for (const docLot of lotsSnap.docs) {
        const lotData = docLot.data();
        
        // Converter timestamps do lote
        let lotCreatedAt: Date;
        if (lotData.createdAt && typeof lotData.createdAt.toDate === 'function') {
          lotCreatedAt = lotData.createdAt.toDate();
        } else if (lotData.createdAt) {
          lotCreatedAt = new Date(lotData.createdAt);
        } else {
          lotCreatedAt = new Date();
        }
        
        let adaptationStartDate: Date;
        if (lotData.adaptationStartDate && typeof lotData.adaptationStartDate.toDate === 'function') {
          adaptationStartDate = lotData.adaptationStartDate.toDate();
        } else if (lotData.adaptationStartDate) {
          adaptationStartDate = new Date(lotData.adaptationStartDate);
        } else {
          adaptationStartDate = new Date();
        }
        
        const lot: Lot = {
          ...lotData,
          id: docLot.id,
          createdAt: lotCreatedAt,
          adaptationStartDate,
          animals: []
        } as Lot;
        
        // Buscar animais do lote
        try {
          const animalsSnap = await getDocs(collection(db, 'fazendas', farmId, 'lotes', docLot.id, 'animais'));
          const animals: Animal[] = animalsSnap.docs.map(doc => {
            const animalData = doc.data();
            // Remover duplicatas no weightHistory pelo id
            const uniqueHistory = Array.from(
              new Map((animalData.weightHistory || []).map((wh: any) => [wh.id, wh])).values()
            ).map((wh: any) => ({
              ...wh,
              date: wh.date && typeof wh.date.toDate === 'function' ? wh.date.toDate() : new Date(wh.date)
            }));
            return {
              ...animalData,
              weightHistory: uniqueHistory
            } as Animal;
          });
          
          lot.animals = animals;
          
          // Calcular totalWeight e concentrateAmount baseado nos animais
          const totalWeight = animals.reduce((acc, animal) => acc + animal.currentWeight, 0);
          const concentrateAmount = totalWeight * 0.02; // 2% do peso vivo
          
          lot.totalWeight = totalWeight;
          lot.concentrateAmount = concentrateAmount;
          
          // Atualizar o documento do lote no Firestore com os novos valores
          await updateDoc(doc(db, 'fazendas', farmId, 'lotes', docLot.id), {
            totalWeight,
            concentrateAmount
          });
          
        } catch (error) {
          console.error('Erro ao buscar animais do lote:', error);
          lot.animals = [];
        }
        
        lots.push(lot);
      }
      
      // Atualizar a fazenda específica
      setFarms(prevFarms => 
        prevFarms.map(farm => 
          farm.id === farmId ? { ...farm, lots } : farm
        )
      );
    } catch (error) {
      console.error('Erro ao carregar dados da fazenda:', error);
    }
  };

  return {
    farms,
    transactions,
    addFarm,
    addLot,
    addAnimal,
    updateAnimalWeight,
    addTransaction,
    deleteTransaction,
    deleteFarm,
    deleteLot,
    deleteAnimal,
    loadFarmData
  };
};
