# Simple Finance

A full-stack personal finance app with a .NET 8 Web API backend and a Vite + React frontend. It includes authentication (JWT), categories, goals, and transactions management.

## Tech stack

- Backend: ASP.NET Core 8, Entity Framework Core, SQL Server, JWT auth, Swagger
- Frontend: React, Vite, TypeScript, Tailwind CSS, Axios

## Project structure

- Backend/ - ASP.NET Core Web API
- Frontend/ - React app (Vite)

## Prerequisites

- .NET SDK 8.x
- Node.js 18+ (or 20+)
- SQL Server (local or container)

## Configuration

Backend settings live in Backend/appsettings.json:

- Connection string: ConnectionStrings:DefaultConnection
- JWT settings: Jwt:Key, Jwt:Issuer, Jwt:Audience

Frontend API base URL is in Frontend/src/services/api.ts:

- baseURL: http://localhost:5000/api

If you change ports, update the base URL and the CORS origin in Backend/Program.cs (AllowFrontend policy).

## Run the backend

From the repository root:

```bash
cd Backend
dotnet restore
dotnet run
```

Swagger UI is available in development at https://localhost:5001/swagger (or the port shown in the console).

## Run the frontend

From the repository root:

```bash
cd Frontend
npm install
npm run dev
```

The app runs at http://localhost:3000 by default.

## Typical local flow

1. Start the backend
2. Start the frontend
3. Use the UI to register and log in

## Notes

- The backend enforces JWT authentication. The frontend stores the token in localStorage under auth_token and sends it as a Bearer token.
- If SQL Server is not available, update the connection string to your environment.
