import React, { useState, useEffect } from 'react';
import { Button, Input, colors, spacing, typography } from './ui';

interface FuelFormProps {
  initialData?: any; // Replace with actual FuelRecord type if available
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

const AddEditFuelForm: React.FC<FuelFormProps> = ({
  initialData,
  onSave,
  onCancel,
  loading,
  error,
}) => {
  const [veiculoId, setVeiculoId] = useState(initialData?.veiculoId || '');
  const [posto, setPosto] = useState(initialData?.posto || '');
  const [combustivel, setCombustivel] = useState(initialData?.combustivel || 'gasolina');
  const [litros, setLitros] = useState(initialData?.litros || '');
  const [valorLitro, setValorLitro] = useState(initialData?.valorLitro || '');
  const [quilometragem, setQuilometragem] = useState(initialData?.quilometragem || '');
  const [data, setData] = useState(initialData?.data || new Date().toISOString().split('T')[0]);
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || '');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setVeiculoId(initialData.veiculoId || '');
      setPosto(initialData.posto || '');
      setCombustivel(initialData.combustivel || 'gasolina');
      setLitros(initialData.litros || '');
      setValorLitro(initialData.valorLitro || '');
      setQuilometragem(initialData.quilometragem || '');
      setData(initialData.data || new Date().toISOString().split('T')[0]);
      setObservacoes(initialData.observacoes || '');
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!veiculoId) newErrors.veiculoId = 'Veículo é obrigatório';
    if (!posto.trim()) newErrors.posto = 'Posto é obrigatório';
    if (!litros || parseFloat(litros) <= 0) newErrors.litros = 'Litros deve ser maior que zero';
    if (!valorLitro || parseFloat(valorLitro) <= 0) newErrors.valorLitro = 'Valor por litro deve ser maior que zero';
    if (!quilometragem || parseInt(quilometragem) <= 0) newErrors.quilometragem = 'Quilometragem deve ser maior que zero';
    if (!data) newErrors.data = 'Data é obrigatória';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        id: initialData?.id, // For editing
        veiculoId,
        posto,
        combustivel,
        litros: parseFloat(litros),
        valorLitro: parseFloat(valorLitro),
        valorTotal: parseFloat(litros) * parseFloat(valorLitro),
        quilometragem: parseInt(quilometragem),
        data,
        observacoes,
      });
    }
  };

  const fuelTypes = [
    { value: 'gasolina', label: 'Gasolina' },
    { value: 'etanol', label: 'Etanol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'gnv', label: 'GNV' }
  ];

  // Mock vehicles for dropdown (in a real app, this would come from an API)
  const mockVehicles = [
    { id: '1', nome: 'Toyota Corolla' },
    { id: '2', nome: 'Honda Civic' },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <div>
        <label style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          color: colors.neutral.text.primary,
          marginBottom: spacing.sm,
          display: 'block'
        }}>
          Veículo {<span style={{ color: colors.secondary.error }}> *</span>}
        </label>
        <select
          value={veiculoId}
          onChange={(e) => setVeiculoId(e.target.value)}
          style={{
            width: '100%',
            padding: `${spacing.md} ${spacing.lg}`,
            border: `1px solid ${colors.neutral.border}`,
            borderRadius: '8px',
            backgroundColor: colors.neutral.surface,
            fontSize: typography.fontSize.base,
            color: colors.neutral.text.primary,
            outline: 'none'
          }}
        >
          <option value="">Selecione um veículo</option>
          {mockVehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.nome}
            </option>
          ))}
        </select>
        {formErrors.veiculoId && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '6px'
          }}>
            <span style={{ fontSize: typography.fontSize.base, color: colors.secondary.error, marginRight: '6px' }}>⚠️</span>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.secondary.error }}>{formErrors.veiculoId}</span>
          </div>
        )}
      </div>
      <Input
        label="Posto"
        value={posto}
        onChange={setPosto}
        error={formErrors.posto}
        required
      />
      <div>
        <label style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          color: colors.neutral.text.primary,
          marginBottom: spacing.sm,
          display: 'block'
        }}>
          Combustível {<span style={{ color: colors.secondary.error }}> *</span>}
        </label>
        <select
          value={combustivel}
          onChange={(e) => setCombustivel(e.target.value)}
          style={{
            width: '100%',
            padding: `${spacing.md} ${spacing.lg}`,
            border: `1px solid ${colors.neutral.border}`,
            borderRadius: '8px',
            backgroundColor: colors.neutral.surface,
            fontSize: typography.fontSize.base,
            color: colors.neutral.text.primary,
            outline: 'none'
          }}
        >
          {fuelTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Litros"
        type="number"
        value={litros}
        onChange={setLitros}
        error={formErrors.litros}
        required
      />
      <Input
        label="Valor por Litro"
        type="number"
        value={valorLitro}
        onChange={setValorLitro}
        error={formErrors.valorLitro}
        required
      />
      <Input
        label="Quilometragem"
        type="number"
        value={quilometragem}
        onChange={setQuilometragem}
        error={formErrors.quilometragem}
        required
      />
      <Input
        label="Data"
        type="date"
        value={data}
        onChange={setData}
        error={formErrors.data}
        required
      />
      <Input
        label="Observações (Opcional)"
        value={observacoes}
        onChange={setObservacoes}
      />

      {error && (
        <div style={{
          backgroundColor: colors.secondary.error,
          color: colors.primary.contrast,
          padding: spacing.md,
          borderRadius: '8px',
          marginBottom: spacing.lg
        }}>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Salvar Alterações' : 'Registrar Abastecimento'}
        </Button>
      </div>
    </form>
  );
};

export default AddEditFuelForm;

