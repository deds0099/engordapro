export interface Farm {
  id: string;
  name: string;
  location?: string;
  userId: string;
  createdAt: Date;
  lots: Lot[];
}

export interface Lot {
  id: string;
  farmId: string;
  name: string;
  createdAt: Date;
  breed?: string;
  animals: Animal[];
  adaptationStartDate: Date;
  totalWeight: number;
  concentrateAmount: number;
}

export interface Animal {
  id: string;
  lotId: string;
  tagNumber: string;
  initialWeight: number;
  currentWeight: number;
  age: number;
  breed: string;
  entryDate: string;
  weightHistory: WeightRecord[];
  userId: string;
}

export interface WeightRecord {
  id: string;
  animalId: string;
  weight: number;
  date: Date;
}

export interface Transaction {
  id: string;
  farmId: string;
  lotId?: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
}

export interface AdaptationPhase {
  day: number;
  phase: string;
  morningFeed: string;
  afternoonFeed: string;
  instructions: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
