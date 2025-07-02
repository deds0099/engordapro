import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import FarmManagement from '@/components/FarmManagement';
import LotManagement from '@/components/LotManagement';
import AnimalManagement from '@/components/AnimalManagement';
import FinancialManagement from '@/components/FinancialManagement';
import { useCattleData } from '@/hooks/useCattleData';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewData, setViewData] = useState<any>(null);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
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
    deleteAnimal
  } = useCattleData();

  // Sync URL with current view
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      setCurrentView('dashboard');
      setViewData(null);
    } else if (path === '/farms') {
      setCurrentView('farms');
      setViewData(null);
    } else if (path.startsWith('/lots')) {
      setCurrentView('lots');
      setViewData({ farmId: params.farmId });
    } else if (path.startsWith('/animals')) {
      setCurrentView('animals');
      setViewData({ farmId: params.farmId, lotId: params.lotId });
    } else if (path === '/adaptation') {
      setCurrentView('adaptation');
      setViewData(null);
    } else if (path === '/finances') {
      setCurrentView('finances');
      setViewData(null);
    }
  }, [location.pathname, params]);

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view);
    setViewData(data);
    
    // Update URL
    switch (view) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'farms':
        navigate('/farms');
        break;
      case 'lots':
        navigate(data?.farmId ? `/lots/${data.farmId}` : '/lots');
        break;
      case 'animals':
        if (data?.farmId && data?.lotId) {
          navigate(`/animals/${data.farmId}/${data.lotId}`);
        } else if (data?.farmId) {
          navigate(`/animals/${data.farmId}`);
        } else {
          navigate('/animals');
        }
        break;
      case 'adaptation':
        navigate('/adaptation');
        break;
      case 'finances':
        navigate('/finances');
        break;
      default:
        navigate('/');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'farms':
        return (
          <FarmManagement 
            farms={farms}
            onAddFarm={addFarm}
            onDeleteFarm={deleteFarm}
            onNavigate={handleNavigate}
          />
        );
      
      case 'lots':
        return (
          <LotManagement 
            farms={farms}
            selectedFarmId={viewData?.farmId}
            onAddLot={addLot}
            onDeleteLot={deleteLot}
            onNavigate={handleNavigate}
          />
        );
      
      case 'animals':
        return (
          <AnimalManagement
            farms={farms}
            selectedFarmId={viewData?.farmId}
            selectedLotId={viewData?.lotId}
            onAddAnimal={addAnimal}
            onUpdateWeight={updateAnimalWeight}
            onDeleteAnimal={deleteAnimal}
            onNavigate={handleNavigate}
          />
        );
      
      case 'finances':
        return (
          <FinancialManagement
            farms={farms}
            transactions={transactions}
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
            onNavigate={handleNavigate}
          />
        );
      
      default:
        return (
          <Dashboard 
            farms={farms}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return renderCurrentView();
};

export default Index;
