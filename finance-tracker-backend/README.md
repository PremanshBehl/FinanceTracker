# Personal Finance Tracker Backend

A production-ready backend foundation for a Personal Finance Tracker application built with Node.js, Express.js, PostgreSQL, and Prisma ORM.

## Tech Stack
- Node.js & Express.js
- PostgreSQL & Prisma ORM
- JWT Authentication
- bcrypt for password hashing
- Zod for payload validation
- express-rate-limit, cors, helmet for security
- dotenv for environment variables

## Features
- **User Authentication**: Register, Login, Get Profile
- **Category Management**: Create, Read, Delete (Expense & Income)
- **Transaction Management**: CRUD, filtering by type/date, pagination, sorting
- **Budget Tracking**: Set monthly budgets for categories, auto-updates on expenses
- **Dashboard Summary**: Aggregate data for total income, expenses, savings, and category-wise spending

## Prerequisites
- Node.js (v16+)
- PostgreSQL installed and running locally or on the cloud

## Local Setup Guide

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd finance-tracker-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Copy `.env.example` to `.env` and update the database URL and JWT credentials:
   ```bash
   cp .env.example .env
   ```
   *Note: Update the `DATABASE_URL` in `.env` to match your local PostgreSQL credentials.*

4. **Database Setup**:
   Run Prisma migrations to create the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed Database (Optional)**:
   Populate the database with a test user, categories, and transactions:
   ```bash
   npx prisma db seed
   ```

6. **Start the Server**:
   Run the backend in development mode:
   ```bash
   npm run dev
   ```
   *Server will run at http://localhost:3000*

## API Endpoints Overview

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to account
- `GET /api/auth/profile` - Get logged-in user profile (Requires Auth)

### Categories (Requires Auth)
- `GET /api/categories` - List categories
- `POST /api/categories` - Create a new category
- `DELETE /api/categories/:id` - Delete a category

### Transactions (Requires Auth)
- `GET /api/transactions` - List all transactions (supports pagination, filtering, sorting)
- `POST /api/transactions` - Create a transaction
- `GET /api/transactions/:id` - Get transaction by ID
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets (Requires Auth)
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create a monthly budget for a category

### Dashboard (Requires Auth)
- `GET /api/dashboard/summary` - Get financial summary

## Testing API
A Postman collection is included in the root directory: `postman_collection.json`. Import it into Postman to quickly test all endpoints.

## Example Flow
1. Register a user at `/api/auth/register`
2. Login and get the JWT token.
3. Pass the token as `Bearer <token>` in the Authorization header.
4. Create a Category (`INCOME` or `EXPENSE`).
5. Create a Budget for an `EXPENSE` category.
6. Create a Transaction tied to that category.
7. Observe the budget's `spentAmount` update automatically.
8. Fetch `/api/dashboard/summary` for analytical insights.
