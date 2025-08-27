# Guia de Uso - GraphQL API Wishlist

Este guia apresenta todas as queries e mutations disponíveis na API GraphQL do sistema de Wishlist, incluindo exemplos de uso e variáveis necessárias.

## 🔗 Endpoints e Ferramentas

### Endpoint Local

- **URL**: `http://localhost:4000/graphql`
- Use esta URL quando a aplicação estiver rodando localmente

### Ferramentas Recomendadas

- **Apollo Studio**: `https://studio.apollographql.com/sandbox/explorer`
  - **📌 Recomendado**: Conecte o Apollo Studio ao endpoint local `http://localhost:4000/graphql` para uma experiência de desenvolvimento otimizada
  - Interface amigável com autocompletar e documentação automática
  - Suporte completo para introspection do schema GraphQL

## 📋 Índice

- [🔐 Autenticação](#-autenticação)
- [📝 Mutations](#-mutations)
  - [Login](#login)
  - [Create Wishlist](#create-wishlist)
  - [Update Wishlist](#update-wishlist)
  - [Delete Wishlist](#delete-wishlist)
  - [Add Wishlist Item](#add-wishlist-item)
  - [Remove Wishlist Item](#remove-wishlist-item)
- [🔍 Queries](#-queries)
  - [Wishlist (by ID)](#wishlist-by-id)
  - [Wishlists (all)](#wishlists-all)
  - [Check Wishlist Item](#check-wishlist-item)
  - [Find Wishlist Items](#find-wishlist-items)

---

## 🔐 Autenticação

### Login

Realiza a autenticação do usuário e retorna tokens de acesso.

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
  }
}
```

**Variáveis:**

```json
{
  "input": {
    "username": "admin",
    "password": "password"
  }
}
```

---

## 📝 Mutations

### Create Wishlist

Cria uma nova lista de desejos com itens iniciais.

```graphql
mutation CreateWishlist {
  createWishlist(input: {
    name: "Favoritos Games"
    items: [
      {
        productUuid: "a7e3fa46-57c0-4d39-9337-3b0da8931e30"
        notes: "Quero comprar na Black Friday meu Super Mario World"
      },
      {
        productUuid: "8e9d0a12-c9b7-4d4b-9135-416b4429c125"
        notes: "Quero comprar na Black Friday meu The Legend of Zelda: Ocarina of Time"
      },
      {
        productUuid: "64bca7ee-0c95-4e4f-8cb7-fc171ad15ed4"
        notes: "Quero comprar na Black Friday meu Sonic the Hedgehog 2"
      },
      {
        productUuid: "b122db63-1a91-4711-b9e8-6f007e460723"
        notes: "Quero comprar na Black Friday meu Street Fighter II"
      },
      {
        productUuid: "e75f26d6-63f8-4ea3-a205-790e86cbce19"
        notes: "Quero comprar na Black Friday meu Donkey Kong Country"
      },
      {
        productUuid: "3bcf0099-d1e3-40ba-9a8e-14450c314d04"
        notes: "Quero comprar na Black Friday meu Final Fantasy VII"
      },
      {
        productUuid: "80dc8a71-52df-4b86-9fd0-42c22b8c2d50"
        notes: "Quero comprar na Black Friday meu Metal Gear Solid"
      },
      {
        productUuid: "5379d28f-1177-4d90-a3c8-cb80c8b37e35"
        notes: "Quero comprar na Black Friday meu Castlevania: Symphony of the Night"
      },
      {
        productUuid: "f9bb60c1-07f6-4970-a08a-1ee80ad3140e"
        notes: "Quero comprar na Black Friday meu Chrono Trigger"
      },
      {
        productUuid: "9f685d8c-bc3c-45e6-96b1-89c6f15fa0eb"
        notes: "Quero comprar na Black Friday meu Mega Man X"
      },
      {
        productUuid: "b2c2b5e6-c0b0-4b1c-8139-36d387bfc1f0"
        notes: "Quero comprar na Black Friday meu Resident Evil 2"
      },
      {
        productUuid: "ae7d19b0-16b0-4c89-b34d-7b34b70172ea"
        notes: "Quero comprar na Black Friday meu Mortal Kombat II"
      },
      {
        productUuid: "0ee31fa6-c6b7-4d8f-98e0-9fa697b7985f"
        notes: "Quero comprar na Black Friday meu Tetris"
      },
      {
        productUuid: "baa543c5-bdde-4dc4-9da6-f385965a32c2"
        notes: "Quero comprar na Black Friday meu Pokémon Red"
      },
      {
        productUuid: "2e53b837-8366-4c21-a363-f994cd6e830a"
        notes: "Quero comprar na Black Friday meu GoldenEye 007"
      },
      {
        productUuid: "37ffed67-1246-41a9-b382-69ab365f0b6c"
        notes: "Quero comprar na Black Friday meu F-Zero"
      },
      {
        productUuid: "5919dc6f-73a6-4700-96bb-f0290b02423b"
        notes: "Quero comprar na Black Friday meu EarthBound"
      },
      {
        productUuid: "6a227ab7-5a4e-4fd3-a176-6aa1e85f4e6c"
        notes: "Quero comprar na Black Friday meu Duck Hunt"
      },
      {
        productUuid: "ea5b91b2-36d2-4650-b0ca-0c9a9477b7a8"
        notes: "Quero comprar na Black Friday meu Contra"
      },
      {
        productUuid: "c24b7d7f-6c19-4f7a-beca-355cdf2933d2"
        notes: "Quero comprar na Black Friday meu The Legend of Zelda: A Link to the Past"
      }
    ]
  }) {
    uuid
    userUuid
    name
    items {
      productUuid
      addedAt
      notes
    }
    createdAt
    updatedAt
  }
}
```

### Update Wishlist

Atualiza uma lista de desejos existente.

```graphql
mutation UpdateWishlist($uuid: ID!, $input: UpdateWishlistInputDto!) {
  updateWishlist(uuid: $uuid, input: $input) {
    uuid
    userUuid
    name
    items {
      productUuid
      addedAt
      notes
    }
    createdAt
    updatedAt
  }
}
```

**Variáveis:**

```json
{
  "uuid": "57f8b127-ebb0-4c3b-8ed4-1215934489ef",
  "input": {
    "name": "Favoritos Games javan 45",
    "items": [
      {
        "productUuid": "123e4567-e89b-12d3-a456-426614174000",
        "notes": "Quero comprar na Black Friday meu BATTLEFIELD 611"
      }
    ]
  }
}
```

### Delete Wishlist

Remove uma lista de desejos pelo UUID.

```graphql
mutation DeleteWishlist($uuid: ID!) {
  deleteWishlist(uuid: $uuid)
}
```

**Variáveis:**

```json
{
  "uuid": "73e4edcd-48d7-4f98-bb20-1c110dbf5247"
}
```

### Add Wishlist Item

Adiciona um item a uma lista de desejos existente.

```graphql
mutation AddWishlistItem($wishlistUuid: ID!, $input: AddWishlistItemInput!) {
  addWishlistItem(wishlistUuid: $wishlistUuid, input: $input) {
    uuid
    userUuid
    name
    items {
      productUuid
      addedAt
      notes
    }
    createdAt
    updatedAt
  }
}
```

**Variáveis:**

```json
{
  "wishlistUuid": "37475d67-50e4-4e2d-a53a-39fbbceaee1b",
  "input": {
    "productUuid": "8e9d0a12-c9b7-4d4b-9135-416b4429c125",
    "notes": "Quero comprar na Black Friday meu The Legend of Zelda: Ocarina of Time"
  }
}
```

### Remove Wishlist Item

Remove um item específico de uma lista de desejos.

```graphql
mutation RemoveWishlistItem($wishlistUuid: ID!, $productUuid: ID!) {
  removeWishlistItem(wishlistUuid: $wishlistUuid, productUuid: $productUuid) {
    uuid
    userUuid
    name
    items {
      productUuid
      addedAt
      notes
    }
    createdAt
    updatedAt
  }
}
```

**Variáveis:**

```json
{
  "wishlistUuid": "37475d67-50e4-4e2d-a53a-39fbbceaee1b",
  "productUuid": "8e9d0a12-c9b7-4d4b-9135-416b4429c125"
}
```

---

## 🔍 Queries

### Wishlist (by ID)

Busca uma lista de desejos específica pelo UUID.

```graphql
query Wishlist($uuid: ID!) {
  wishlist(uuid: $uuid) {
    uuid
    userUuid
    name
    items {
      productUuid
      addedAt
      notes
    }
    createdAt
    updatedAt
  }
}
```

**Variáveis:**

```json
{
  "uuid": "37475d67-50e4-4e2d-a53a-39fbbceaee1b"
}
```

### Wishlists (all)

Busca todas as listas de desejos do usuário autenticado.

```graphql
query Wishlists {
  wishlists {
    uuid
    userUuid
    name
    items {
      productUuid
      addedAt
      notes
    }
    createdAt
    updatedAt
  }
}
```

### Check Wishlist Item

Verifica se um produto específico está em uma lista de desejos.

```graphql
query CheckWishlistItem($wishlistUuid: ID!, $productUuid: ID!) {
  checkWishlistItem(wishlistUuid: $wishlistUuid, productUuid: $productUuid) {
    exists
    item {
      productUuid
      addedAt
      notes
    }
  }
}
```

**Variáveis:**

```json
{
  "wishlistUuid": "37475d67-50e4-4e2d-a53a-39fbbceaee1b",
  "productUuid": "a7e3fa46-57c0-4d39-9337-3b0da8931e30"
}
```

### Find Wishlist Items

Consulta todos os produtos de uma lista de desejos específica.

```graphql
query FindWishlistItems($wishlistUuid: ID!) {
  findWishlistItems(wishlistUuid: $wishlistUuid) {
    items {
      productUuid
      addedAt
      notes
    }
    remainingSlots
    totalItems
    uuid
  }
}
```

**Variáveis:**

```json
{
  "wishlistUuid": "37475d67-50e4-4e2d-a53a-39fbbceaee1b"
}
```

---

## 📝 Notas Importantes

1. **Autenticação**: Todas as operações (exceto login) requerem autenticação via token JWT no header `Authorization`.

2. **Campos de Data**: Os campos `createdAt`, `updatedAt` e `addedAt` são automaticamente formatados como objetos Date.

3. **UUIDs**: Todos os IDs utilizados devem estar no formato UUID válido.

4. **Limites**: Verifique os limites de itens por wishlist através do campo `remainingSlots` na query `FindWishlistItems`.

5. **Validação**: Todos os inputs são validados antes da execução das operações.

---

## 🚀 Exemplo de Uso com Header de Autenticação

```javascript
// Headers necessários para operações autenticadas
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE",
  "Content-Type": "application/json"
}
```
