# Full Stack Personal Finance Tracker

## Frontend (React + Vite + Tailwind + Zustand)

### Features
- JWT Auth (Login/Register/Protected Routes)
- Financial Dashboard with Recharts
- Transactions CRUD with Modals and Filtering
- Category Management (Income/Expense)
- Budget Progress Tracking
- Reports Analytics (Analytics Views)
- Profile Management
- Glassmorphism & Framer Motion animations

### Run Frontend
```bash
cd finance-tracker-frontend
npm install
npm run dev
```

## Backend (Node + Express + Prisma + Postgres)

### Features
- Secure JWT based Authentication
- RESTful JSON API
- Budget Auto-calculation triggers
- Zod Payload Validation
- Custom Global Error Handling
- Rate Limiting and Helmet Security

### Run Backend
```bash
cd finance-tracker-backend
npm install
npm run dev
```

## Testing

**Backend Tests (Jest & Supertest):**
```bash
cd finance-tracker-backend
npm run test
```

**Frontend Unit Tests (Vitest & RTL):**
```bash
cd finance-tracker-frontend
npm run test
```

**Frontend E2E Tests (Playwright):**
```bash
cd finance-tracker-frontend
npx playwright test
```

## Deployment Notes
- **Frontend**: Connect to Vercel and it will read `vercel.json` for SPA routing. Set your Production Backend API URL in your Vercel Environment Variables.
- **Backend**: Connect to Render. Make sure you set your Database URL (from Supabase/Neon), `JWT_SECRET`, and configure CORS if your Vercel URL is known.
