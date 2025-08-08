#!/bin/bash

# Script para converter snake_case para camelCase no projeto GiroPro

echo "Iniciando conversão de snake_case para camelCase..."

# Função para converter snake_case para camelCase
convert_files() {
    local dir=$1
    echo "Processando diretório: $dir"
    
    find "$dir" -name "*.ts" -type f | while read file; do
        echo "Processando arquivo: $file"
        
        # Backup do arquivo original
        cp "$file" "$file.backup"
        
        # Conversões principais
        sed -i 's/id_usuario/idUsuario/g' "$file"
        sed -i 's/id_veiculo/idVeiculo/g' "$file"
        sed -i 's/data_abastecimento/dataAbastecimento/g' "$file"
        sed -i 's/valor_total/valorTotal/g' "$file"
        sed -i 's/valor_litro/valorLitro/g' "$file"
        sed -i 's/preco_litro/precoLitro/g' "$file"
        sed -i 's/quantidade_litros/quantidadeLitros/g' "$file"
        sed -i 's/km_atual/kmAtual/g' "$file"
        sed -i 's/tipo_combustivel/tipoCombustivel/g' "$file"
        sed -i 's/nome_posto/nomePosto/g' "$file"
        sed -i 's/data_despesa/dataDespesa/g' "$file"
        sed -i 's/valor_despesa/valorDespesa/g' "$file"
        sed -i 's/tipo_despesa/tipoDespesa/g' "$file"
        sed -i 's/descricao_despesa/descricaoDespesa/g' "$file"
        sed -i 's/deleted_at/deletedAt/g' "$file"
        sed -i 's/created_at/createdAt/g' "$file"
        sed -i 's/updated_at/updatedAt/g' "$file"
        sed -i 's/data_inicio/dataInicio/g' "$file"
        sed -i 's/data_fim/dataFim/g' "$file"
        sed -i 's/km_inicial/kmInicial/g' "$file"
        sed -i 's/km_final/kmFinal/g' "$file"
        sed -i 's/data_viagem/dataViagem/g' "$file"
        sed -i 's/valor_ganho/valorGanho/g' "$file"
        
        echo "✅ Convertido: $file"
    done
}

# Converter arquivos do backend
convert_files "backend/src"

echo "Conversão concluída!"
echo "Arquivos de backup criados com extensão .backup"
