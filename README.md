# BFF Wishlist - Backend for Frontend

Backend for Frontend para gerenciamento de listas de desejos em e-commerce, desenvolvido com NestJS e GraphQL.

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Docker** - Para containerização da aplicação
- **Node.js** Com NPM, PNPM ou Yarn
- **Rede Docker compartilhada** - Para comunicação entre serviços

## 🚀 Configuração Inicial

### 1. Criar a Rede Docker (OBRIGATÓRIO)

**⚠️ Execute este comando apenas uma vez:**

```bash
docker network create wishlist-net
```

> **Importante:** Se a rede não existir, o container do BFF não conseguirá se comunicar com a API pelo nome do serviço.

Depois disso, ambos os projetos (BFF e API) poderão usar a mesma rede, bastando referenciar `wishlist-net` como `external: true` em seus docker-compose.

### 2. Instalação das Dependências (local - desaconselhável)

```bash
pnpm install
```
Gerenciador ecolhido pelo alto desempenho

## 🏃‍♂️ Executando o Projeto

## Modo Desenvolvimento com Docker  (Recomendado) 

```bash
npm run start:bff:docker:dev
```

Este comando irá:

- Construir a imagem Docker se necessário
- Iniciar o container na rede `wishlist-net`
- Expor a aplicação na porta `4000`
- Habilitar hot-reload para desenvolvimento

## 🔗 Endpoints

Após iniciar a aplicação, ela estará disponível em:

- **GraphQL Playground**: `http://localhost:4000/graphql`
- **API REST** (se habilitada): `http://localhost:3000`

## 📚 Documentação da API

Para exemplos completos de queries e mutations GraphQL, consulte o arquivo:

📄 **[GRAPHQL_GUIDE.md](./GRAPHQL_GUIDE.md)**

O guia inclui:

- Todas as operações disponíveis
- Exemplos de variáveis
- Instruções de autenticação
- Como usar com Apollo Studio

## 🐳 Docker

### Estrutura do Docker

- **Dockerfile**: Imagem de produção otimizada
- **Dockerfile.dev**: Imagem para desenvolvimento com hot-reload
- **docker-compose.yml**: Orquestração dos serviços

### Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env.docker` e `.env`:

```env

API_WISHLIST_URL=http://app:3000/v1

```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com watch mode
npm run test:watch

# Testes com coverage
npm run test:cov

# Testes de integração
npm run test:e2e
```

## 🏗️ Arquitetura

O projeto segue os princípios de Clean Architecture:

```text
src/
├── application/         # Casos de uso e lógica de negócio
│   ├── enums/           # Enumerações da aplicação
│   ├── ports/           # Interfaces (contratos)
│   └── usecases/        # Casos de uso
├── domain/              # Entidades de domínio
│   └── entities/        # Modelos de dados puros
├── infrastructure/      # Implementações concretas
│   ├── gateways/        # Comunicação com APIs externas
│   └── helpers/         # Utilitários de infraestrutura
├── modules/             # Módulos do NestJS
├── presentation/        # Camada de apresentação
│   ├── dto/             # Data Transfer Objects
│   ├── resolvers/       # Resolvers GraphQL
│   └── schemas/         # Schemas GraphQL
└── shared/              # Código compartilhado
    ├── helpers/         # Funções auxiliares
    └── utils/           # Utilitários
```

## 🔧 Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **GraphQL** - API Query Language
- **Apollo Server** - Servidor GraphQL
- **TypeScript** - Linguagem de programação
- **Docker** - Containerização
- **Jest** - Framework de testes

