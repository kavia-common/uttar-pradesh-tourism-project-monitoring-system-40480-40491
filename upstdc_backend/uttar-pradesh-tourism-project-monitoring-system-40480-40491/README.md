# uttar-pradesh-tourism-project-monitoring-system-40480-40491

Backend (Express) quick start and wiring guide

Environment
- Copy .env.example to .env and adjust as needed.
  - CORS_ORIGIN=http://localhost:3000 (frontend)
  - DATABASE_URL=postgresql://appuser:dbuser123@localhost:5001/myapp (database)
  - JWT_ACCESS_SECRET / JWT_REFRESH_SECRET set to strong values
  - UPLOAD_DIR=uploads (default)

Install
- cd upstdc_backend
- npm install

Run
- npm run dev (development with nodemon) or npm start
- Server: http://localhost:3001

Verify (smoke)
- GET / -> health JSON
- OpenAPI docs: GET /docs
- Swagger "Servers" should show your current backend URL
- Auth:
  - POST /api/auth/signup { name,email,password,role }
  - POST /api/auth/login { email,password } -> returns {access_token,refresh_token}
  - Use "Authorize" in Swagger with "Bearer <access_token>"
- Projects CRUD (protected):
  - GET /api/projects (after Authorize)
  - POST /api/projects
- Uploads:
  - POST /api/uploads with multipart form-data (field "file"), after Authorize

End-to-end wiring checklist
- Frontend .env: REACT_APP_API_BASE_URL=http://localhost:3001
- Backend .env: CORS_ORIGIN=http://localhost:3000; DATABASE_URL points to DB on 5001
- Database: run migrations (see database README)
- Login with seeded admin if available or create account via signup
- Create project in frontend; verify in backend API and DB
- Upload a sample file; GET the returned /uploads/... path
- Swagger at /docs reflects current server URL

Notes
- All configuration is read from environment variables and not hard-coded.
- Database operations require a reachable PostgreSQL instance at DATABASE_URL.
