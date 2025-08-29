# Como Adicionar uma Nova API no Backend do GiroPro

Este guia detalha os passos para criar um novo endpoint (API) no backend do projeto GiroPro, incluindo validação, lógica de negócio e testes. Seguir este guia garante consistência e qualidade no desenvolvimento de novas funcionalidades.

## 1. Entendendo a Estrutura do Backend

O backend do GiroPro é construído com Node.js, Express.js (como framework web), TypeScript e Drizzle ORM para interação com o banco de dados SQLite. A estrutura segue um padrão de camadas:

*   **`src/routes/`**: Define as rotas da API e mapeia para os controladores.
*   **`src/controllers/`**: Contém a lógica de tratamento das requisições HTTP, validação de entrada e orquestração dos serviços.
*   **`src/services/`**: Implementa a lógica de negócio principal, interagindo com o banco de dados (via Drizzle ORM) e outras dependências.
*   **`src/db/schema.ts`**: Define o schema do banco de dados com Drizzle ORM.
*   **`src/types/`**: Contém as definições de tipos TypeScript para interfaces de requisição, resposta e modelos de dados.

## 2. Definindo o Schema do Banco de Dados (se necessário)

Se a nova API envolver dados que ainda não estão no banco de dados, você precisará atualizar o schema. Siga o guia "Como Realizar uma Migração de Banco de Dados" (`docs/02_guias_como_fazer/02ComoRealizarMigracaoBancoDados.md`) para adicionar ou modificar tabelas e colunas em `src/db/schema.ts`.

## 3. Definindo os Tipos TypeScript (`src/types/index.ts`)

Crie ou atualize as interfaces TypeScript necessárias para a sua nova API. Isso inclui:

*   **Interfaces de Requisição (Request Interfaces)**: Para validar os dados de entrada da API (ex: `CreateNewItemRequest`, `UpdateExistingItemRequest`).
*   **Interfaces de Resposta (Response Interfaces)**: Para tipar os dados retornados pela API.
*   **Interfaces de Modelo de Dados (Data Model Interfaces)**: Se a API manipular um novo tipo de entidade.

Exemplo:

```typescript
// src/types/index.ts

export interface CreateProductRequest {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
}

export interface Product {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## 4. Implementando o Serviço (`src/services/`)

Crie um novo arquivo de serviço (ex: `src/services/productService.ts`) ou adicione métodos a um serviço existente. O serviço deve conter a lógica de negócio, validação de dados (além da validação de esquema da rota) e interação com o banco de dados.

**Boas Práticas no Serviço:**

*   **Validação de Negócio**: Valide regras de negócio complexas que não podem ser expressas apenas por schemas de validação de rota.
*   **Interação com o Banco de Dados**: Utilize o Drizzle ORM para realizar operações de CRUD (Create, Read, Update, Delete) e consultas complexas.
*   **Tratamento de Erros**: Retorne `ServiceResult` (definido em `src/types/common.ts`) para indicar sucesso ou falha, encapsulando mensagens de erro amigáveis.
*   **Reutilização**: Seções de código que podem ser reutilizadas devem ser encapsuladas em funções auxiliares ou classes utilitárias.

Exemplo de estrutura de serviço:

```typescript
// src/services/productService.ts
import { db } from "../db/connection";
import { produtos } from "../db/schema"; // Supondo que 'produtos' seja sua tabela
import { eq } from "drizzle-orm";
import { CreateProductRequest, Product, ServiceResult } from "../types";
import crypto from 'crypto';

export class ProductService {
  static async createProduct(productData: CreateProductRequest): Promise<ServiceResult<Product>> {
    try {
      // Exemplo de validação de negócio
      if (productData.preco <= 0) {
        return { success: false, error: "Preço do produto deve ser positivo." };
      }

      const [newProduct] = await db.insert(produtos).values({
        id: crypto.randomUUID(),
        nome: productData.nome,
        descricao: productData.descricao || null,
        preco: productData.preco,
        estoque: productData.estoque,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      return { success: true, data: newProduct };
    } catch (error) {
      console.error("[ProductService.createProduct]", error);
      return { success: false, error: "Erro ao criar produto." };
    }
  }

  static async getProductById(id: string): Promise<ServiceResult<Product | null>> {
    try {
      const [product] = await db.select().from(produtos).where(eq(produtos.id, id));
      return { success: true, data: product || null };
    } catch (error) {
      console.error("[ProductService.getProductById]", error);
      return { success: false, error: "Erro ao buscar produto." };
    }
  }
  // ... outros métodos (update, delete, list)
}
```

## 5. Criando o Controlador (`src/controllers/`)

Crie um novo arquivo de controlador (ex: `src/controllers/productController.ts`) ou adicione métodos a um controlador existente. O controlador é responsável por:

*   Receber a requisição HTTP.
*   Validar os dados de entrada (usando schemas de validação, se aplicável).
*   Chamar o(s) serviço(s) apropriado(s).
*   Formatar a resposta HTTP.

**Boas Práticas no Controlador:**

*   **Validação de Entrada**: Utilize `Request` e `Response` do Express para acessar os dados da requisição e enviar a resposta. Use schemas de validação (ex: `Joi` ou `Zod` se configurado) para garantir que os dados de entrada estejam no formato correto.
*   **Tratamento de Erros**: Capture erros dos serviços e retorne respostas HTTP apropriadas (ex: 400 Bad Request, 404 Not Found, 500 Internal Server Error).
*   **Autenticação/Autorização**: Se a rota exigir, adicione middlewares de autenticação/autorização.

Exemplo de estrutura de controlador:

```typescript
// src/controllers/productController.ts
import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { CreateProductRequest } from '../types';

export class ProductController {
  static async createProduct(req: Request<{}, {}, CreateProductRequest>, res: Response) {
    try {
      const productData = req.body;
      const result = await ProductService.createProduct(productData);

      if (result.success && result.data) {
        return res.status(201).json(result.data);
      } else {
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error("[ProductController.createProduct]", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  static async getProduct(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const result = await ProductService.getProductById(id);

      if (result.success && result.data) {
        return res.status(200).json(result.data);
      } else if (result.success && !result.data) {
        return res.status(404).json({ error: "Produto não encontrado." });
      } else {
        return res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error("[ProductController.getProduct]", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  // ... outros métodos (update, delete, list)
}
```

## 6. Definindo a Rota (`src/routes/`)

Crie um novo arquivo de rota (ex: `src/routes/products.ts`) ou adicione a nova rota a um arquivo existente. As rotas são responsáveis por:

*   Definir o método HTTP (GET, POST, PUT, DELETE).
*   Definir o caminho (path) da API.
*   Associar a rota a um método do controlador.
*   Aplicar middlewares (ex: autenticação).

**Boas Práticas na Rota:**

*   **Prefixos**: Utilize prefixos de rota para organizar as APIs (ex: `/api/v1/products`).
*   **Middlewares**: Aplique middlewares de autenticação (`authenticate`) e autorização conforme necessário.

Exemplo de estrutura de rota:

```typescript
// src/routes/products.ts
import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticate } from '../middlewares/auth'; // Supondo um middleware de autenticação

const router = Router();

router.post('/products', authenticate, ProductController.createProduct);
router.get('/products/:id', authenticate, ProductController.getProduct);
// ... outras rotas (PUT, DELETE, GET all)

export default router;
```

Não se esqueça de registrar a nova rota no arquivo principal de rotas (geralmente `src/app.ts` ou `src/server.ts`):

```typescript
// src/app.ts (ou similar)
import productRoutes from './routes/products';

// ... dentro da configuração do Express
app.use('/api/v1', productRoutes);
```

## 7. Testando a Nova API

Após implementar a nova API, é crucial testá-la para garantir que funcione conforme o esperado.

*   **Testes Manuais**: Utilize ferramentas como Insomnia, Postman ou `curl` para enviar requisições HTTP para o seu novo endpoint.
*   **Testes Automatizados**: Escreva testes unitários para o serviço e testes de integração para o controlador e a rota. O projeto utiliza `vitest` para testes. Crie um arquivo de teste (ex: `src/tests/product.test.ts`) e adicione seus casos de teste.

Exemplo de teste básico:

```typescript
// src/tests/product.test.ts
import { test, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app'; // Aplicação Express

beforeAll(async () => {
  // Configurações de setup se necessário
});

afterAll(async () => {
  // Limpeza se necessário
});

test('should create a new product', async () => {
  const response = await request(app)
    .post('/api/v1/products')
    .set('Authorization', 'Bearer YOUR_AUTH_TOKEN') // Substitua pelo token real
    .send({
      nome: 'Test Product',
      preco: 1000,
      estoque: 10,
    });

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  expect(response.body.nome).toBe('Test Product');
});

// ... outros testes (GET, PUT, DELETE, validações)
```

## 8. Documentando a Nova API

Atualize a documentação da API em `docs/04_referencias/02_api_endpoints.md` para incluir o novo endpoint, seus parâmetros, exemplos de requisição/resposta e qualquer informação relevante.

Seguindo estes passos, você poderá adicionar novas APIs ao GiroPro de forma organizada, testável e documentada.

