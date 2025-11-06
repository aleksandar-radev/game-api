# Game API

A RESTful API built with Express, TypeScript, and TypeORM for managing games, user data, comments, and feedback.

## ✨ Features

- 🎮 Game management system
- 👥 User authentication and profiles
- 💬 Comments and reactions on games
- 📊 Leaderboard and player statistics
- 📝 Feedback collection system
- 🔒 Role-based access control
- 🗄️ PostgreSQL database with migrations
- 📝 Winston logging with daily rotation
- 🛡️ Security with Helmet and JWT authentication
- ✅ Jest unit tests

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT
- **Testing**: Jest
- **Linting**: ESLint
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 10.20.0
- PostgreSQL database

## 🚀 Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Build the project

```bash
pnpm build
```

_Required before running migrations to compile TypeScript._

### 3. Run migrations

```bash
pnpm migration run
```

### 4. Seed the database (optional)

```bash
pnpm seed
```

_Populates the database with sample data._

## 📦 Available Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Start development server with hot reload |
| `pnpm build`     | Compile TypeScript and run migrations    |
| `pnpm start`     | Start production server                  |
| `pnpm test`      | Run Jest test suite                      |
| `pnpm lint`      | Run ESLint                               |
| `pnpm migration` | TypeORM migration commands               |
| `pnpm seed`      | Seed database with sample data           |

## 📁 Project Structure

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── config/             # Configuration (logger, etc.)
├── controllers/        # Route controllers
├── services/           # Business logic
├── repositories/       # Data access layer
├── entities/           # TypeORM entities
├── dto/                # Data Transfer Objects
├── middleware/         # Express middleware
├── database/           # TypeORM migrations and seeds
├── helpers/            # Utility functions
├── types/              # TypeScript type definitions
└── routes/             # API routes
```

## 🔌 API Endpoints

The API provides endpoints for:

- **Games**: CRUD operations, game comments, and reactions
- **Users**: Registration, authentication, profiles
- **Leaderboards**: Player statistics and rankings
- **Feedback**: User feedback collection
- **Game Data**: Player progress and statistics

## 📝 Environment Setup

Create a `.env` file in the root directory with your database configuration:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=game_api
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
```

## 🐳 Docker

Build and run with Docker:

```bash
docker build -t game-api .
docker run -p 3000:3000 game-api
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Aleksandar Radev
