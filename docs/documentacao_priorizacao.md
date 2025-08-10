# Priorização e Estrutura da Documentação do GiroPro

Com base na proposta de documentação alinhada ao Framework Diátaxis, apresento a seguir uma priorização dos documentos a serem criados, editados e ajustados, organizados em uma estrutura de árvore para facilitar a visualização.

**Legenda:**
*   `[NOVO]` : Documento a ser criado do zero.
*   `[EDITAR]` : Documento existente que precisa de revisão e atualização significativa.
*   `[AJUSTAR]` : Documento existente que precisa de pequenas correções ou complementos.

```
GiroPro/
├── docs/
│   ├── README.md                                   [EDITAR] - Ponto de entrada principal, deve ser atualizado com links para a nova estrutura.
│   │
│   ├── principios_arquiteturais.md                 [AJUSTAR] - Já criado, pode ser ajustado com a seção de padronização de nomenclatura.
│   │
│   ├── progresso.md                                [AJUSTAR] - Manter como log de progresso, com ajustes para refletir as novas tarefas de documentação.
│   │
│   ├── EspecificacoesTecnicasGiroPro.md            [EDITAR] - Conteúdo existente que pode ser refatorado e distribuído nas novas categorias (principalmente Explicações e Referências).
│   │
│   ├── analise_problemas.md                        [EDITAR] - Refatorar para guias de 'Como Fazer' ou 'Troubleshooting'.
│   │
│   ├── backend_correcoes_especificas.md            [EDITAR] - Refatorar para guias de 'Como Fazer' ou 'Troubleshooting'.
│   │
│   ├── detalhamento_apis_modelos_dados.md          [EDITAR] - Base para a documentação de Referência de API e Dicionário de Dados.
│   │
│   ├── estrategia_precificacao.md                  [AJUSTAR] - Seção de 'Explicação' sobre o modelo de negócio.
│   │
│   ├── mapeamento_funcionalidades.md               [EDITAR] - Base para a documentação de Referência de Funcionalidades.
│   │
│   ├── relatorio_testes_scripts.md                 [EDITAR] - Refatorar para um guia de 'Como Fazer: Testar Scripts de Setup'.
│   │
│   ├── relatorios_e_dashboards.md                  [AJUSTAR] - Seção de 'Explicação' sobre relatórios e dashboards.
│   │
│   ├── roadmap.md                                  [AJUSTAR] - Manter e ajustar conforme o andamento do projeto.
│   │
│   ├── 01_tutoriais/                             [NOVO] - Diretório para todos os tutoriais.
│   │   ├── 01_setup_inicial.md                   [NOVO] - Tutorial de setup do ambiente de desenvolvimento.
│   │   ├── 02_primeiro_uso_app.md                [NOVO] - Tutorial de primeiro uso da aplicação para usuários finais.
│   │   └── 03_contribuicao_dev.md                [NOVO] - Tutorial de contribuição para desenvolvedores.
│   │
│   ├── 02_guias_como_fazer/                      [NOVO] - Diretório para guias de 'Como Fazer'.
│   │   ├── 01_adicionar_endpoint_api.md          [NOVO] - Guia para adicionar um novo endpoint no backend.
│   │   ├── 02_implementar_funcionalidade_frontend.md [NOVO] - Guia para implementar nova funcionalidade no frontend.
│   │   ├── 03_rodar_testes_especificos.md        [NOVO] - Guia para rodar testes unitários, integração, E2E.
│   │   └── 04_gerar_relatorios_dashboards.md     [NOVO] - Guia para usuários gerarem relatórios e dashboards.
│   │
│   ├── 03_explicacoes/                         [NOVO] - Diretório para explicações aprofundadas.
│   │   ├── 01_arquitetura_geral.md             [NOVO] - Explicação da arquitetura de alto nível.
│   │   ├── 02_modelo_dados_schema.md           [NOVO] - Explicação detalhada do modelo de dados e padrões de nomenclatura.
│   │   ├── 03_fluxo_autenticacao_autorizacao.md [NOVO] - Explicação do fluxo de segurança.
│   │   └── 04_tecnologias_padroes.md           [NOVO] - Visão geral das tecnologias e padrões do backend/frontend.
│   │
│   └── 04_referencias/                         [NOVO] - Diretório para documentação de referência.
│       ├── 01_api_openapi.md                   [NOVO] - Documentação de API (gerada via OpenAPI/Swagger).
│       ├── 02_dicionario_dados.md              [NOVO] - Dicionário de dados completo do banco.
│       ├── 03_configuracoes_projeto.md         [NOVO] - Referência de variáveis de ambiente e configurações.
│       └── 04_lista_dependencias.md            [NOVO] - Lista de todas as dependências do projeto.
│
└── ... (outros arquivos e diretórios do projeto)
```

**Priorização da Implementação:**

1.  **Ajustar `README.md`**: É o ponto de entrada e deve refletir a nova estrutura de documentação, direcionando os usuários para os locais corretos.
2.  **Criar `01_tutoriais/01_setup_inicial.md`**: Essencial para o onboarding de novos desenvolvedores e para garantir que o ambiente de desenvolvimento possa ser configurado facilmente.
3.  **Criar `03_explicacoes/02_modelo_dados_schema.md`**: Fundamental para resolver as inconsistências de nomenclatura (`km_inicio` vs `kmInicio`) e padronizar o desenvolvimento, além de ser a base para o dicionário de dados.
4.  **Editar `detalhamento_apis_modelos_dados.md` e criar `04_referencias/01_api_openapi.md` e `04_referencias/02_dicionario_dados.md`**: A documentação de API e o dicionário de dados são cruciais para a comunicação entre equipes e para a manutenção do backend.
5.  **Demais documentos `[NOVO]` e `[EDITAR]`**: Podem ser abordados em seguida, conforme a necessidade e o impacto no projeto.
6.  **Documentos `[AJUSTAR]` restantes**: Podem ser feitos em paralelo ou em etapas posteriores, pois geralmente exigem menos esforço.

Esta estrutura visa organizar a documentação de forma lógica e acessível, facilitando tanto o aprendizado quanto a consulta de informações específicas, e garantindo que o projeto GiroPro tenha uma base de conhecimento robusta e bem mantida.

