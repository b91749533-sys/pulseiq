# InsightFlow — AI-Powered Social Media Analytics Dashboard

InsightFlow is a production-quality, premium SaaS platform built for creators, marketers, and businesses to monitor analytics across all social networks from a single, gorgeous dashboard. Receive contextual advice, generate viral captions, plan schedules, and track competitor analytics.

**Created By Youssef Manssouri**

---

## 🌊 Architecture & Technology Stack

The platform is designed with a decoupled clean monorepo architecture:

*   **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Zustand (client states), React Query (caching & refetching), Recharts (dynamic visual plotting).
*   **Backend**: Node.js, NestJS (Controllers, Services, Modules, Dependency Injection), PostgreSQL (Data storage), Prisma ORM (Schema migrations and client queries), Redis & BullMQ (Background data sync workers).
*   **Auth**: Clerk (Frontend session tokens checked by NestJS JWT guard verification).
*   **AI**: Google Gemini API (Contextual recommendations utilizing actual user analytics metrics).

---

## 🚀 Setup & Execution Guide

### Prerequisites

Ensure you have Node.js (v18 or higher), Docker, and Docker Compose installed.

### 1. Configure Environmental Variables

Copy the template from the root:
```bash
cp .env.example .env
```
Open `.env` and fill in your keys (e.g. `GEMINI_API_KEY`, Clerk keys). If you do not have Clerk keys yet, you can leave them empty; the platform will automatically activate the **Developer Simulator Mode** and authorize you using the seeded developer user credentials (`youssef.manssouri@example.com`).

---

### 2. Start Local Databases (Docker)

Spin up PostgreSQL and Redis:
```bash
docker-compose up -d
```
This runs PostgreSQL on port `5432` and Redis on port `6379`.

---

### 3. Setup and Run the Backend API

Go into the `backend/` directory, install packages, compile migrations, and seed the database:
```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
```
This generates the Prisma Client, pushes the normalized schema to PostgreSQL, and seeds 30 days of daily historical views, followers, and engagement rates for both Youssef Manssouri and his competitors.

Start the backend NestJS development server:
```bash
npm run start:dev
```
The NestJS API will start on: `http://localhost:4000/api`
API documentation is available at: `http://localhost:4000/docs`

---

### 4. Setup and Run the Frontend Dashboard

Open a new terminal window, go into the `frontend/` directory, install packages, and start Next.js:
```bash
cd frontend
npm install
npm run dev
```
The Next.js client will start on: `http://localhost:3000`

---

## 📦 Docker Container Packaging

To build and package the entire app into Docker containers:

1. Build backend service:
   ```bash
   docker build -t insightflow-backend ./backend
   ```
2. Build frontend static server:
   ```bash
   docker build -t insightflow-frontend ./frontend
   ```

---

## 💡 Developer Simulation Highlights

*   **Social Connections**: Link simulated YouTube, Instagram, TikTok, LinkedIn, or Twitter channels inside settings. The system automatically inserts mock metrics to immediately light up your Recharts curves.
*   **Contextual AI**: Prompt the AI Assistant about views spikes. If the Gemini API key is missing, a custom rules-based analyzer evaluates your database metrics and outputs tailored hooks and audits.
*   **Reports Exporter**: Create reports and download compiled spreadsheets (CSV) of your historical metrics directly from the UI.
