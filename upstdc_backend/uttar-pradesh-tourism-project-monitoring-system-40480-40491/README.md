# uttar-pradesh-tourism-project-monitoring-system-40480-40491

Backend (Express) quick start:

1) Create environment file
- Copy upstdc_backend/.env.example to upstdc_backend/.env and fill:
  - DATABASE_URL
  - JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
  - POSTGIS_ENABLED (true/false)
  - CORS_ORIGIN as needed

2) Install dependencies
- cd upstdc_backend
- npm install

3) Run the server
- npm run dev (development with nodemon) or npm start

4) Verify
- Health check: GET /
- OpenAPI docs: GET /docs

Notes
- All configuration is read from environment variables and not hard-coded.
- Database operations require a reachable PostgreSQL instance at DATABASE_URL.
