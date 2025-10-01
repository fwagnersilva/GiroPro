export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalPrice: number;
  fuelType: 'gasoline' | 'ethanol' | 'diesel';
  gasStation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFuelRecordData {
  vehicleId: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  fuelType: 'gasoline' | 'ethanol' | 'diesel';
  gasStation?: string;
  notes?: string;
}

export interface UpdateFuelRecordData extends Partial<CreateFuelRecordData> {}

// Simulação de dados em memória para desenvolvimento
let fuelRecordsData: FuelRecord[] = [
  {
    id: "1",
    vehicleId: "1",
    date: "2024-09-15",
    odometer: 45000,
    liters: 40,
    pricePerLiter: 5.89,
    totalPrice: 235.60,
    fuelType: "gasoline",
    gasStation: "Posto Shell",
    notes: "Abastecimento completo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    vehicleId: "2",
    date: "2024-09-20",
    odometer: 32000,
    liters: 35,
    pricePerLiter: 4.99,
    totalPrice: 174.65,
    fuelType: "ethanol",
    gasStation: "Posto Ipiranga",
    notes: "Abastecimento parcial",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const simulateDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const getFuelRecords = async (vehicleId?: string): Promise<FuelRecord[]> => {
  await simulateDelay();
  if (vehicleId) {
    return fuelRecordsData.filter(record => record.vehicleId === vehicleId);
  }
  return [...fuelRecordsData];
};

export const getFuelRecordById = async (id: string): Promise<FuelRecord | null> => {
  await simulateDelay();
  const record = fuelRecordsData.find(r => r.id === id);
  return record || null;
};

export const createFuelRecord = async (data: CreateFuelRecordData): Promise<FuelRecord> => {
  await simulateDelay();
  
  const totalPrice = data.liters * data.pricePerLiter;
  
  const newRecord: FuelRecord = {
    id: Date.now().toString(),
    ...data,
    totalPrice,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  fuelRecordsData.push(newRecord);
  return newRecord;
};

export const updateFuelRecord = async (id: string, data: UpdateFuelRecordData): Promise<FuelRecord | null> => {
  await simulateDelay();
  
  const index = fuelRecordsData.findIndex(r => r.id === id);
  if (index === -1) {
    return null;
  }
  
  const updatedData = { ...fuelRecordsData[index], ...data };
  
  // Recalcular o preço total se litros ou preço por litro foram alterados
  if (data.liters !== undefined || data.pricePerLiter !== undefined) {
    updatedData.totalPrice = updatedData.liters * updatedData.pricePerLiter;
  }
  
  updatedData.updatedAt = new Date().toISOString();
  
  fuelRecordsData[index] = updatedData;
  return fuelRecordsData[index];
};

export const deleteFuelRecord = async (id: string): Promise<boolean> => {
  await simulateDelay();
  
  const index = fuelRecordsData.findIndex(r => r.id === id);
  if (index === -1) {
    return false;
  }
  
  fuelRecordsData.splice(index, 1);
  return true;
};
