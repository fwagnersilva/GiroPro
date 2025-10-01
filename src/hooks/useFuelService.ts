import { useState, useCallback } from 'react';
import { 
  getFuelRecords, 
  getFuelRecordById, 
  createFuelRecord, 
  updateFuelRecord, 
  deleteFuelRecord,
  FuelRecord,
  CreateFuelRecordData,
  UpdateFuelRecordData
} from '../services/fuelService';
import { useToast } from '../components/ToastNotification';

export const useFuelService = () => {
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchFuelRecords = useCallback(async (vehicleId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFuelRecords(vehicleId);
      setFuelRecords(data);
      showToast({ message: 'Abastecimentos carregados com sucesso!', type: 'success' });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar abastecimentos.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchFuelRecordById = useCallback(async (id: string): Promise<FuelRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const record = await getFuelRecordById(id);
      return record;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar abastecimento.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const addFuelRecord = useCallback(async (data: CreateFuelRecordData): Promise<FuelRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const newRecord = await createFuelRecord(data);
      setFuelRecords(prev => [...prev, newRecord]);
      showToast({ message: 'Abastecimento registrado com sucesso!', type: 'success' });
      return newRecord;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao registrar abastecimento.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const editFuelRecord = useCallback(async (id: string, data: UpdateFuelRecordData): Promise<FuelRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedRecord = await updateFuelRecord(id, data);
      if (updatedRecord) {
        setFuelRecords(prev => prev.map(r => r.id === id ? updatedRecord : r));
        showToast({ message: 'Abastecimento atualizado com sucesso!', type: 'success' });
        return updatedRecord;
      } else {
        throw new Error('Abastecimento não encontrado.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar abastecimento.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const removeFuelRecord = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteFuelRecord(id);
      if (success) {
        setFuelRecords(prev => prev.filter(r => r.id !== id));
        showToast({ message: 'Abastecimento removido com sucesso!', type: 'success' });
        return true;
      } else {
        throw new Error('Abastecimento não encontrado.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao remover abastecimento.';
      setError(errorMessage);
      showToast({ message: errorMessage, type: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    fuelRecords,
    loading,
    error,
    fetchFuelRecords,
    fetchFuelRecordById,
    addFuelRecord,
    editFuelRecord,
    removeFuelRecord,
  };
};
