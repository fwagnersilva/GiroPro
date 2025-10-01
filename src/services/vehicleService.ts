export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year?: number;
  plate?: string;
  color?: string;
  fuelType?: 'gasoline' | 'ethanol' | 'diesel' | 'flex';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVehicleData {
  make: string;
  model: string;
  year?: number;
  plate?: string;
  color?: string;
  fuelType?: 'gasoline' | 'ethanol' | 'diesel' | 'flex';
}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {}

// Simulação de dados em memória para desenvolvimento
let vehiclesData: Vehicle[] = [
  { 
    id: "1", 
    make: "Toyota", 
    model: "Corolla",
    year: 2020,
    plate: "ABC-1234",
    color: "Prata",
    fuelType: "flex",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: "2", 
    make: "Honda", 
    model: "Civic",
    year: 2019,
    plate: "XYZ-5678",
    color: "Preto",
    fuelType: "gasoline",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

const simulateDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const getVehicles = async (): Promise<Vehicle[]> => {
  await simulateDelay();
  return [...vehiclesData];
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  await simulateDelay();
  const vehicle = vehiclesData.find(v => v.id === id);
  return vehicle || null;
};

export const createVehicle = async (data: CreateVehicleData): Promise<Vehicle> => {
  await simulateDelay();
  
  const newVehicle: Vehicle = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  vehiclesData.push(newVehicle);
  return newVehicle;
};

export const updateVehicle = async (id: string, data: UpdateVehicleData): Promise<Vehicle | null> => {
  await simulateDelay();
  
  const index = vehiclesData.findIndex(v => v.id === id);
  if (index === -1) {
    return null;
  }
  
  vehiclesData[index] = {
    ...vehiclesData[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  return vehiclesData[index];
};

export const deleteVehicle = async (id: string): Promise<boolean> => {
  await simulateDelay();
  
  const index = vehiclesData.findIndex(v => v.id === id);
  if (index === -1) {
    return false;
  }
  
  vehiclesData.splice(index, 1);
  return true;
};
