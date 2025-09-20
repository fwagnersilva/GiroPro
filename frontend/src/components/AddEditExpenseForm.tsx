import React, { useState, useEffect } from 'react';
import { Button, Input, colors, spacing, typography } from './ui';

interface ExpenseFormProps {
  initialData?: any; // Replace with actual Expense type if available
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

const AddEditExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSave,
  onCancel,
  loading,
  error,
}) => {
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [valor, setValor] = useState(initialData?.valor || '');
  const [categoria, setCategoria] = useState(initialData?.categoria || 'outros');
  const [data, setData] = useState(initialData?.data || new Date().toISOString().split('T')[0]);
  const [veiculoId, setVeiculoId] = useState(initialData?.veiculoId || ''); // Mock vehicle ID
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setDescricao(initialData.descricao || '');
      setValor(initialData.valor || '');
      setCategoria(initialData.categoria || 'outros');
      setData(initialData.data || new Date().toISOString().split('T')[0]);
      setVeiculoId(initialData.veiculoId || '');
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!valor || parseFloat(valor) <= 0) newErrors.valor = 'Valor deve ser maior que zero';
    if (!data) newErrors.data = 'Data é obrigatória';
    if (!veiculoId) newErrors.veiculoId = 'Veículo é obrigatório'; // In a real app, this would be a dropdown
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        id: initialData?.id, // For editing
        descricao,
        valor: parseFloat(valor),
        categoria,
        data,
        veiculoId,
        tipo: categoria, // Assuming categoria and tipo are the same for now
      });
    }
  };

  const categories = [
    { value: 'combustivel', label: 'Combustível' },
    { value: 'manutencao', label: 'Manutenção' },
    { value: 'seguro', label: 'Seguro' },
    { value: 'ipva', label: 'IPVA' },
    { value: 'multa', label: 'Multas' },
    { value: 'outros', label: 'Outros' }
  ];

  // Mock vehicles for dropdown (in a real app, this would come from an API)
  const mockVehicles = [
    { id: '1', nome: 'Toyota Corolla' },
    { id: '2', nome: 'Honda Civic' },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <Input
        label="Descrição"
        value={descricao}
        onChange={setDescricao}
        error={formErrors.descricao}
        required
      />
      <Input
        label="Valor"
        type="number"
        value={valor}
        onChange={setValor}
        error={formErrors.valor}
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
          Categoria {<span style={{ color: colors.secondary.error }}> *</span>}
        </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
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
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Data"
        type="date"
        value={data}
        onChange={setData}
        error={formErrors.data}
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
          {initialData ? 'Salvar Alterações' : 'Adicionar Despesa'}
        </Button>
      </div>
    </form>
  );
};

export default AddEditExpenseForm;

