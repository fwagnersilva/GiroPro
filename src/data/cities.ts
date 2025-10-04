// Lista de cidades brasileiras organizadas por estado
export interface City {
  name: string;
  state: string;
  displayName: string; // Nome formatado para exibição (ex: "Fortaleza/Ceará")
}

export const BRAZILIAN_CITIES: City[] = [
  // Ceará
  { name: "Fortaleza", state: "CE", displayName: "Fortaleza/Ceará" },
  { name: "Caucaia", state: "CE", displayName: "Caucaia/Ceará" },
  { name: "Juazeiro do Norte", state: "CE", displayName: "Juazeiro do Norte/Ceará" },
  { name: "Maracanaú", state: "CE", displayName: "Maracanaú/Ceará" },
  { name: "Sobral", state: "CE", displayName: "Sobral/Ceará" },
  { name: "Crato", state: "CE", displayName: "Crato/Ceará" },
  { name: "Itapipoca", state: "CE", displayName: "Itapipoca/Ceará" },
  { name: "Maranguape", state: "CE", displayName: "Maranguape/Ceará" },
  { name: "Iguatu", state: "CE", displayName: "Iguatu/Ceará" },
  { name: "Quixadá", state: "CE", displayName: "Quixadá/Ceará" },

  // São Paulo
  { name: "São Paulo", state: "SP", displayName: "São Paulo/São Paulo" },
  { name: "Guarulhos", state: "SP", displayName: "Guarulhos/São Paulo" },
  { name: "Campinas", state: "SP", displayName: "Campinas/São Paulo" },
  { name: "São Bernardo do Campo", state: "SP", displayName: "São Bernardo do Campo/São Paulo" },
  { name: "Santo André", state: "SP", displayName: "Santo André/São Paulo" },
  { name: "Osasco", state: "SP", displayName: "Osasco/São Paulo" },
  { name: "São José dos Campos", state: "SP", displayName: "São José dos Campos/São Paulo" },
  { name: "Ribeirão Preto", state: "SP", displayName: "Ribeirão Preto/São Paulo" },
  { name: "Sorocaba", state: "SP", displayName: "Sorocaba/São Paulo" },
  { name: "Santos", state: "SP", displayName: "Santos/São Paulo" },

  // Rio de Janeiro
  { name: "Rio de Janeiro", state: "RJ", displayName: "Rio de Janeiro/Rio de Janeiro" },
  { name: "São Gonçalo", state: "RJ", displayName: "São Gonçalo/Rio de Janeiro" },
  { name: "Duque de Caxias", state: "RJ", displayName: "Duque de Caxias/Rio de Janeiro" },
  { name: "Nova Iguaçu", state: "RJ", displayName: "Nova Iguaçu/Rio de Janeiro" },
  { name: "Niterói", state: "RJ", displayName: "Niterói/Rio de Janeiro" },
  { name: "Campos dos Goytacazes", state: "RJ", displayName: "Campos dos Goytacazes/Rio de Janeiro" },
  { name: "Belford Roxo", state: "RJ", displayName: "Belford Roxo/Rio de Janeiro" },
  { name: "São João de Meriti", state: "RJ", displayName: "São João de Meriti/Rio de Janeiro" },
  { name: "Petrópolis", state: "RJ", displayName: "Petrópolis/Rio de Janeiro" },
  { name: "Volta Redonda", state: "RJ", displayName: "Volta Redonda/Rio de Janeiro" },

  // Minas Gerais
  { name: "Belo Horizonte", state: "MG", displayName: "Belo Horizonte/Minas Gerais" },
  { name: "Uberlândia", state: "MG", displayName: "Uberlândia/Minas Gerais" },
  { name: "Contagem", state: "MG", displayName: "Contagem/Minas Gerais" },
  { name: "Juiz de Fora", state: "MG", displayName: "Juiz de Fora/Minas Gerais" },
  { name: "Betim", state: "MG", displayName: "Betim/Minas Gerais" },
  { name: "Montes Claros", state: "MG", displayName: "Montes Claros/Minas Gerais" },
  { name: "Ribeirão das Neves", state: "MG", displayName: "Ribeirão das Neves/Minas Gerais" },
  { name: "Uberaba", state: "MG", displayName: "Uberaba/Minas Gerais" },
  { name: "Governador Valadares", state: "MG", displayName: "Governador Valadares/Minas Gerais" },
  { name: "Ipatinga", state: "MG", displayName: "Ipatinga/Minas Gerais" },

  // Bahia
  { name: "Salvador", state: "BA", displayName: "Salvador/Bahia" },
  { name: "Feira de Santana", state: "BA", displayName: "Feira de Santana/Bahia" },
  { name: "Vitória da Conquista", state: "BA", displayName: "Vitória da Conquista/Bahia" },
  { name: "Camaçari", state: "BA", displayName: "Camaçari/Bahia" },
  { name: "Itabuna", state: "BA", displayName: "Itabuna/Bahia" },
  { name: "Juazeiro", state: "BA", displayName: "Juazeiro/Bahia" },
  { name: "Lauro de Freitas", state: "BA", displayName: "Lauro de Freitas/Bahia" },
  { name: "Ilhéus", state: "BA", displayName: "Ilhéus/Bahia" },
  { name: "Jequié", state: "BA", displayName: "Jequié/Bahia" },
  { name: "Teixeira de Freitas", state: "BA", displayName: "Teixeira de Freitas/Bahia" },

  // Paraná
  { name: "Curitiba", state: "PR", displayName: "Curitiba/Paraná" },
  { name: "Londrina", state: "PR", displayName: "Londrina/Paraná" },
  { name: "Maringá", state: "PR", displayName: "Maringá/Paraná" },
  { name: "Ponta Grossa", state: "PR", displayName: "Ponta Grossa/Paraná" },
  { name: "Cascavel", state: "PR", displayName: "Cascavel/Paraná" },
  { name: "São José dos Pinhais", state: "PR", displayName: "São José dos Pinhais/Paraná" },
  { name: "Foz do Iguaçu", state: "PR", displayName: "Foz do Iguaçu/Paraná" },
  { name: "Colombo", state: "PR", displayName: "Colombo/Paraná" },
  { name: "Guarapuava", state: "PR", displayName: "Guarapuava/Paraná" },
  { name: "Paranaguá", state: "PR", displayName: "Paranaguá/Paraná" },

  // Rio Grande do Sul
  { name: "Porto Alegre", state: "RS", displayName: "Porto Alegre/Rio Grande do Sul" },
  { name: "Caxias do Sul", state: "RS", displayName: "Caxias do Sul/Rio Grande do Sul" },
  { name: "Pelotas", state: "RS", displayName: "Pelotas/Rio Grande do Sul" },
  { name: "Canoas", state: "RS", displayName: "Canoas/Rio Grande do Sul" },
  { name: "Santa Maria", state: "RS", displayName: "Santa Maria/Rio Grande do Sul" },
  { name: "Gravataí", state: "RS", displayName: "Gravataí/Rio Grande do Sul" },
  { name: "Viamão", state: "RS", displayName: "Viamão/Rio Grande do Sul" },
  { name: "Novo Hamburgo", state: "RS", displayName: "Novo Hamburgo/Rio Grande do Sul" },
  { name: "São Leopoldo", state: "RS", displayName: "São Leopoldo/Rio Grande do Sul" },
  { name: "Rio Grande", state: "RS", displayName: "Rio Grande/Rio Grande do Sul" },

  // Pernambuco
  { name: "Recife", state: "PE", displayName: "Recife/Pernambuco" },
  { name: "Jaboatão dos Guararapes", state: "PE", displayName: "Jaboatão dos Guararapes/Pernambuco" },
  { name: "Olinda", state: "PE", displayName: "Olinda/Pernambuco" },
  { name: "Caruaru", state: "PE", displayName: "Caruaru/Pernambuco" },
  { name: "Petrolina", state: "PE", displayName: "Petrolina/Pernambuco" },
  { name: "Paulista", state: "PE", displayName: "Paulista/Pernambuco" },
  { name: "Cabo de Santo Agostinho", state: "PE", displayName: "Cabo de Santo Agostinho/Pernambuco" },
  { name: "Camaragibe", state: "PE", displayName: "Camaragibe/Pernambuco" },
  { name: "Garanhuns", state: "PE", displayName: "Garanhuns/Pernambuco" },
  { name: "Vitória de Santo Antão", state: "PE", displayName: "Vitória de Santo Antão/Pernambuco" },

  // Santa Catarina
  { name: "Joinville", state: "SC", displayName: "Joinville/Santa Catarina" },
  { name: "Florianópolis", state: "SC", displayName: "Florianópolis/Santa Catarina" },
  { name: "Blumenau", state: "SC", displayName: "Blumenau/Santa Catarina" },
  { name: "São José", state: "SC", displayName: "São José/Santa Catarina" },
  { name: "Criciúma", state: "SC", displayName: "Criciúma/Santa Catarina" },
  { name: "Chapecó", state: "SC", displayName: "Chapecó/Santa Catarina" },
  { name: "Itajaí", state: "SC", displayName: "Itajaí/Santa Catarina" },
  { name: "Jaraguá do Sul", state: "SC", displayName: "Jaraguá do Sul/Santa Catarina" },
  { name: "Lages", state: "SC", displayName: "Lages/Santa Catarina" },
  { name: "Palhoça", state: "SC", displayName: "Palhoça/Santa Catarina" },

  // Goiás
  { name: "Goiânia", state: "GO", displayName: "Goiânia/Goiás" },
  { name: "Aparecida de Goiânia", state: "GO", displayName: "Aparecida de Goiânia/Goiás" },
  { name: "Anápolis", state: "GO", displayName: "Anápolis/Goiás" },
  { name: "Rio Verde", state: "GO", displayName: "Rio Verde/Goiás" },
  { name: "Luziânia", state: "GO", displayName: "Luziânia/Goiás" },
  { name: "Águas Lindas de Goiás", state: "GO", displayName: "Águas Lindas de Goiás/Goiás" },
  { name: "Valparaíso de Goiás", state: "GO", displayName: "Valparaíso de Goiás/Goiás" },
  { name: "Trindade", state: "GO", displayName: "Trindade/Goiás" },
  { name: "Formosa", state: "GO", displayName: "Formosa/Goiás" },
  { name: "Novo Gama", state: "GO", displayName: "Novo Gama/Goiás" },

  // Maranhão
  { name: "São Luís", state: "MA", displayName: "São Luís/Maranhão" },
  { name: "Imperatriz", state: "MA", displayName: "Imperatriz/Maranhão" },
  { name: "São José de Ribamar", state: "MA", displayName: "São José de Ribamar/Maranhão" },
  { name: "Timon", state: "MA", displayName: "Timon/Maranhão" },
  { name: "Caxias", state: "MA", displayName: "Caxias/Maranhão" },
  { name: "Codó", state: "MA", displayName: "Codó/Maranhão" },
  { name: "Paço do Lumiar", state: "MA", displayName: "Paço do Lumiar/Maranhão" },
  { name: "Açailândia", state: "MA", displayName: "Açailândia/Maranhão" },
  { name: "Bacabal", state: "MA", displayName: "Bacabal/Maranhão" },
  { name: "Balsas", state: "MA", displayName: "Balsas/Maranhão" },

  // Paraíba
  { name: "João Pessoa", state: "PB", displayName: "João Pessoa/Paraíba" },
  { name: "Campina Grande", state: "PB", displayName: "Campina Grande/Paraíba" },
  { name: "Santa Rita", state: "PB", displayName: "Santa Rita/Paraíba" },
  { name: "Patos", state: "PB", displayName: "Patos/Paraíba" },
  { name: "Bayeux", state: "PB", displayName: "Bayeux/Paraíba" },
  { name: "Sousa", state: "PB", displayName: "Sousa/Paraíba" },
  { name: "Cabedelo", state: "PB", displayName: "Cabedelo/Paraíba" },
  { name: "Guarabira", state: "PB", displayName: "Guarabira/Paraíba" },
  { name: "Cajazeiras", state: "PB", displayName: "Cajazeiras/Paraíba" },
  { name: "Sapé", state: "PB", displayName: "Sapé/Paraíba" },

  // Espírito Santo
  { name: "Vitória", state: "ES", displayName: "Vitória/Espírito Santo" },
  { name: "Vila Velha", state: "ES", displayName: "Vila Velha/Espírito Santo" },
  { name: "Serra", state: "ES", displayName: "Serra/Espírito Santo" },
  { name: "Cariacica", state: "ES", displayName: "Cariacica/Espírito Santo" },
  { name: "Viana", state: "ES", displayName: "Viana/Espírito Santo" },
  { name: "Linhares", state: "ES", displayName: "Linhares/Espírito Santo" },
  { name: "Colatina", state: "ES", displayName: "Colatina/Espírito Santo" },
  { name: "Guarapari", state: "ES", displayName: "Guarapari/Espírito Santo" },
  { name: "São Mateus", state: "ES", displayName: "São Mateus/Espírito Santo" },
  { name: "Aracruz", state: "ES", displayName: "Aracruz/Espírito Santo" },

  // Distrito Federal
  { name: "Brasília", state: "DF", displayName: "Brasília/Distrito Federal" },
  { name: "Gama", state: "DF", displayName: "Gama/Distrito Federal" },
  { name: "Taguatinga", state: "DF", displayName: "Taguatinga/Distrito Federal" },
  { name: "Ceilândia", state: "DF", displayName: "Ceilândia/Distrito Federal" },
  { name: "Sobradinho", state: "DF", displayName: "Sobradinho/Distrito Federal" },
  { name: "Planaltina", state: "DF", displayName: "Planaltina/Distrito Federal" },
  { name: "Paranoá", state: "DF", displayName: "Paranoá/Distrito Federal" },
  { name: "Brazlândia", state: "DF", displayName: "Brazlândia/Distrito Federal" },
  { name: "Santa Maria", state: "DF", displayName: "Santa Maria/Distrito Federal" },
  { name: "São Sebastião", state: "DF", displayName: "São Sebastião/Distrito Federal" },
];

// Função utilitária para buscar cidades por estado
export const getCitiesByState = (state: string): City[] => {
  return BRAZILIAN_CITIES.filter(city => city.state === state);
};

// Função utilitária para buscar cidade por nome
export const getCityByName = (name: string): City | undefined => {
  return BRAZILIAN_CITIES.find(city => city.name === name);
};

// Lista de estados para filtro
export const BRAZILIAN_STATES = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];
