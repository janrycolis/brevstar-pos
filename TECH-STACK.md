# Brevstar POS — Technology Stack

## Workspace / Tooling

| Area     | Technology          |
| -------- | ------------------- |
| Monorepo | **pnpm workspaces** |
| Language | **TypeScript 5.8**  |
| Linting  | **ESLint**          |

## Server

| Area       | Technology                                               |
| ---------- | -------------------------------------------------------- |
| Runtime    | **Node.js**                                              |
| Framework  | **Express 5.1**                                          |
| ORM        | **TypeORM 0.3**                                          |
| Database   | **PostgreSQL** (via `pg`)                                |
| Auth       | **jsonwebtoken** (JWT) + **bcryptjs** (password hashing) |
| Middleware | **cors**                                                 |
| Metadata   | **reflect-metadata** (for TypeORM decorators)            |
| Dev runner | **tsx** (watch mode)                                     |

## Client

| Area              | Technology                                        |
| ----------------- | ------------------------------------------------- |
| UI Library        | **React 19**                                      |
| Build tool        | **Vite 6.3**                                      |
| Component library | **MUI (Material UI) 6.4**                         |
| Styling           | **Emotion** (`@emotion/react`, `@emotion/styled`) |
| Routing           | **React Router DOM 7.5**                          |
| Charts            | **Recharts 3.8**                                  |
| Barcode           | **JsBarcode 3.12**                                |

## Deployment

| Area           | Technology |
| -------------- | ---------- |
| Client hosting | **Vercel** |
