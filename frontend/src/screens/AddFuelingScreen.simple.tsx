import React, { useState } from 'react';

const AddFuelingScreenSimple: React.FC = () => {
  const [formData, setFormData] = useState({
    idVeiculo: '',
    dataAbastecimento: new Date().toISOString().split('T')[0],
    tipoCombustivel: 'gasolina',
    litros: '',
    valorLitro: '',
    valorTotal: '',
    kmAtual: '',
    nomePosto: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idVeiculo) {
      alert("Por favor, selecione um veículo.");
      return;
    }
    if (parseFloat(formData.litros) <= 0 || isNaN(parseFloat(formData.litros))) {
      alert("Por favor, insira uma quantidade de litros válida e positiva.");
      return;
    }
    if (parseFloat(formData.valorLitro) <= 0 || isNaN(parseFloat(formData.valorLitro))) {
      alert("Por favor, insira um valor por litro válido e positivo.");
      return;
    }
    if (parseFloat(formData.valorTotal) <= 0 || isNaN(parseFloat(formData.valorTotal))) {
      alert("Por favor, insira um valor total válido e positivo.");
      return;
    }
    if (parseFloat(formData.kmAtual) <= 0 || isNaN(parseFloat(formData.kmAtual))) {
      alert("Por favor, insira um KM atual válido e positivo.");
      return;
    }

    console.log("Dados do abastecimento:", formData);
    alert("Abastecimento adicionado com sucesso! (Mock)");
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Adicionar Abastecimento</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Veículo</label>
          <select name="idVeiculo" value={formData.idVeiculo} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
            <option value="">Selecione um veículo</option>
            <option value="1">Toyota Corolla</option>
            <option value="2">Honda Civic</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Data</label>
          <input type="date" name="dataAbastecimento" value={formData.dataAbastecimento} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Tipo de Combustível</label>
          <select name="tipoCombustivel" value={formData.tipoCombustivel} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
            <option value="gasolina">Gasolina</option>
            <option value="etanol">Etanol</option>
            <option value="diesel">Diesel</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Litros</label>
          <input type="number" name="litros" value={formData.litros} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Valor por Litro</label>
          <input type="number" name="valorLitro" value={formData.valorLitro} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Valor Total</label>
          <input type="number" name="valorTotal" value={formData.valorTotal} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>KM Atual</label>
          <input type="number" name="kmAtual" value={formData.kmAtual} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Nome do Posto</label>
          <input type="text" name="nomePosto" value={formData.nomePosto} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Salvar</button>
      </form>
    </div>
  );
};

export default AddFuelingScreenSimple;


