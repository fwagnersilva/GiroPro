# Glossário do GiroPro

Este glossário define os termos técnicos e de negócio utilizados no projeto GiroPro, visando padronizar a comunicação e facilitar o entendimento da documentação.

## Termos Técnicos

*   **Backend**: A parte do sistema responsável pela lógica de negócio, banco de dados e API. Desenvolvido com Node.js e Express.js.
*   **Frontend**: A parte do sistema responsável pela interface do usuário. Desenvolvido com React Native/Expo.
*   **API (Application Programming Interface)**: Conjunto de regras que permite a comunicação entre diferentes softwares, como o frontend e o backend do GiroPro.
*   **JWT (JSON Web Token)**: Um método seguro para transmitir informações entre partes como um objeto JSON, utilizado para autenticação no GiroPro.
*   **ORM (Object-Relational Mapper)**: Uma técnica de programação que converte dados entre sistemas de tipos incompatíveis usando linguagens de programação orientadas a objetos. No GiroPro, utilizamos Drizzle ORM.
*   **Soft Delete**: Estratégia de exclusão lógica de dados, onde registros são marcados como inativos (`deletedAt` com timestamp) em vez de removidos fisicamente, permitindo recuperação e manutenção de histórico.
*   **Timestamp**: Um valor que indica o momento em que um determinado evento ocorreu, geralmente expresso como o número de segundos ou milissegundos desde o Unix Epoch. Utilizado para registrar datas de criação, atualização e exclusão.
*   **UUID (Universally Unique Identifier)**: Um identificador de 128 bits projetado para ser único em todos os sistemas e em todos os tempos. Amplamente utilizado como chave primária no GiroPro.
*   **Zod**: Uma biblioteca de validação de esquema TypeScript-first, utilizada para garantir a integridade dos dados de entrada e saída no backend.

## Termos de Negócio

*   **Abastecimento**: Registro detalhado do reabastecimento de um veículo, incluindo data, valor, volume e quilometragem. Essencial para o cálculo de custos e eficiência de combustível.
*   **Autenticação**: Processo de verificar a identidade de um usuário para conceder acesso ao sistema.
*   **Autorização**: Processo de determinar quais permissões um usuário autenticado tem para acessar recursos ou realizar ações dentro do sistema.
*   **Dashboard**: Painel de controle visual que apresenta um resumo financeiro e operacional do usuário, com métricas chave e gráficos.
*   **Despesa**: Registro de gastos operacionais ou pessoais relacionados à atividade do motorista, como manutenção, lavagem, alimentação, etc.
*   **Faturamento**: O valor total das receitas geradas por um motorista em um determinado período, proveniente das plataformas de trabalho.
*   **Gamificação**: Aplicação de elementos de jogos (como conquistas e metas) para engajar e motivar os usuários a atingir objetivos financeiros e operacionais.
*   **Jornada**: Refere-se às viagens ou corridas realizadas por um motorista de aplicativo, incluindo informações como início, fim, distância percorrida e faturamento por plataforma.
*   **Plataforma**: Empresa ou aplicativo de transporte (ex: Uber, 99) através do qual o motorista realiza suas jornadas. O sistema permite gerenciar plataformas predefinidas e adicionar customizadas, controlando sua ativação/desativação.
*   **Veículo**: O automóvel utilizado pelo motorista para realizar suas jornadas, com informações como marca, modelo, placa, tipo de combustível e tipo de uso.

---

**Última atualização**: 01/10/2025
**Versão**: 1.2

