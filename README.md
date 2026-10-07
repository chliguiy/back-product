# back-product

API REST de gestion de produits : NestJS, TypeORM et SQLite.

## Lancer

```bash
npm install
npm run start:dev   # http://localhost:3000
```

## Endpoints

| Méthode | Route | Action |
|---|---|---|
| POST | `/products` | Ajout |
| GET | `/products` | Liste et recherche |
| GET | `/products/:id` | Détail |
| PATCH | `/products/:id` | Modification |
| DELETE | `/products/:id` | Suppression |

Recherche : `GET /products?q=&category=&minPrice=&maxPrice=&sortBy=&order=&page=&limit=`

## Tests

```bash
npm test         # unitaires
npm run test:e2e # e2e
```
