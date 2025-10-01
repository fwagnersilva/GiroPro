import { useState, useCallback } from 'react';
import { 
  getVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle,
  Vehicle,
  CreateVehicleData,
  UpdateVehicleData
} from '../services/vehicleService';
import { useToast } from '../components/ToastNotification';

export const useVehicleService = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicles();
      setVehicles(data);
      showToast({ message: 'Veículos carregados com sucesso!', type: 'success' });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar veículos.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchVehicleById = useCallback(async (id: string): Promise<Vehicle | null> => {
    setLoading(true);
    setError(null);
    try {
      const vehicle = await getVehicleById(id);
      return vehicle;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar veículo.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const addVehicle = useCallback(async (data: CreateVehicleData): Promise<Vehicle | null> => {
    setLoading(true);
    setError(null);
    try {
      const newVehicle = await createVehicle(data);
      setVehicles(prev => [...prev, newVehicle]);
      showToast({ message: 'Veículo cadastrado com sucesso!', type: 'success' });
      return newVehicle;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao cadastrar veículo.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const editVehicle = useCallback(async (id: string, data: UpdateVehicleData): Promise<Vehicle | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedVehicle = await updateVehicle(id, data);
      if (updatedVehicle) {
        setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v));
        showToast({ message: 'Veículo atualizado com sucesso!', type: 'success' });
        return updatedVehicle;
      } else {
        throw new Error('Veículo não encontrado.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar veículo.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const removeVehicle = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteVehicle(id);
      if (success) {
        setVehicles(prev => prev.filter(v => v.id !== id));
        showToast({ message: 'Veículo removido com sucesso!', type: 'success' });
        return true;
      } else {
        throw new Error('Veículo não encontrado.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao remover veículo.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    fetchVehicleById,
    addVehicle,
    editVehicle,
    removeVehicle,
  };
};
