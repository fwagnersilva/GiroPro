import { useState, useCallback } from 'react';
import { getVehicles } from '../services/vehicleService';
import { useToast } from '../components/ToastNotification';

interface Vehicle {
  id: string;
  make: string;
  model: string;
}

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

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
  };
};
