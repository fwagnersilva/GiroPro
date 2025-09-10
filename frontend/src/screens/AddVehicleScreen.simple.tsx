import React, { useState } from 'react';

const AddVehicleScreenSimple: React.FC = () => {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    placa: '',
    tipoCombustivel: 'flex'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do veículo:', formData);
    alert('Veículo adicionado com sucesso! (Mock)');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Adicionar Veículo</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Marca</label>
          <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Modelo</label>
          <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Ano</label>
          <input type="number" name="ano" value={formData.ano} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Placa</label>
          <input type="text" name="placa" value={formData.placa} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Tipo de Combustível</label>
          <select name="tipoCombustivel" value={formData.tipoCombustivel} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
            <option value="flex">Flex</option>
            <option value="gasolina">Gasolina</option>
            <option value="etanol">Etanol</option>
            <option value="diesel">Diesel</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Salvar</button>
      </form>
    </div>
  );
};

export default AddVehicleScreenSimple;


