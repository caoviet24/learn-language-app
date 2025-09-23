ls # LearnLanguage - Complete Language Learning Platform

A comprehensive language learning platform with a .NET 8 backend API, React Native mobile app, and AI-powered features. This project implements Clean Architecture principles with Domain-Driven Design (DDD) and modern development practices.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running with Docker (Recommended)](#running-with-docker-recommended)
  - [Running Components Individually](#running-components-individually)
- [API Documentation](#api-documentation)
- [Mobile App](#mobile-app)
- [AI Component](#ai-component)
- [Database](#database)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                           Client Layer                              │
├─────────────────────────────────────────────┤
│                        Mobile Application                           │
│                    (React Native / Expo)                            │
├─────────────────────────────────────┤
│                          API Layer                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │   API       │  │  Application   │  │      Domain             │   │
│  │ (Endpoints) │  │   (Use Cases) │  │   (Entities/Models)     │   │
│  └─────────────┘  └────────────────┘  └─────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                        Infrastructure Layer                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌────────────────┐ ┌─────────────────────────┐   │
│  │   Data      │  │   Services     │  │   External Services     │   │
│  │ (EF Core)   │  │ (Email, Auth) │  │ (Kafka, AI, Database)   │   │
│  └─────────────┘  └────────────────┘  └─────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                          AI Layer                                   │
├─────────────────────────────────────────────────────────────┤
│                    Artificial Intelligence                          │
│            (OpenAI, HuggingFace, Text-to-Speech)                    │
└─────────────────────────────────────┘
```

### System Components

1. **API Layer** - .NET 8 Minimal API with Clean Architecture
2. **Mobile App** - Expo/React Native cross-platform mobile application
3. **AI Component** - Python Flask service for AI-powered features
4. **Infrastructure** - Docker, Kafka, SQL Server

## Technology Stack

### Backend (API)
- **.NET 8** - Latest LTS framework
- **Entity Framework Core** - ORM with SQL Server
- **MediatR** - CQRS and mediator pattern
- **FluentValidation** - Input validation
- **JWT Bearer** - Authentication
- **Apache Kafka** - Event streaming and messaging
- **SQL Server** - Production database
- **xUnit** - Unit testing
- **Docker** - Containerization

### Mobile App
- **Expo** - React Native framework
- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client
- **React Navigation** - Navigation library
- **NativeWind** - Tailwind CSS for React Native

### AI Component
- **Python 3.x** - Programming language
- **Flask** - Web framework
- **OpenAI API** - AI question generation
- **HuggingFace** - Sentence similarity
- **Transformers** - Text-to-speech
- **PyTorch** - Machine learning framework

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Apache Kafka** - Event streaming
- **SQL Server** - Relational database
- **Kafka UI** - Monitoring and management

## Project Structure

```
.
├── src/
│   ├── LearnLanguage.API/          # Web API endpoints (Minimal APIs)
│   ├── LearnLanguage.Application/  # Use cases, CQRS commands/queries
│   ├── LearnLanguage.Domain/       # Core business logic and entities
│   ├── LearnLanguage.Infrastructure/# Data access, external services
│   ├── LearnLanguage.Mobile/       # React Native mobile application
│   └── LearnLanguage.AI/           # AI services (Python Flask)
├── docker-compose.yml              # Multi-container setup
├── Dockerfile                      # API Docker configuration
├── scripts/                        # Deployment and build scripts
└── tests/                          # Unit and integration tests
```

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** (for containerized setup)
- **.NET 8 SDK** (for local API development)
- **Node.js 18+** and **npm** (for mobile app)
- **Python 3.8+** (for AI component)
- **Expo CLI** (for mobile development)

### Running with Docker (Recommended)

This is the easiest way to run the complete system with all services:

1. **Start all services (API + Kafka + SQL Server + Kafka UI):**
   ```bash
   docker-compose up -d
   ```

2. **Access services:**
   - API: `http://localhost:8081` (Swagger UI)
   - Kafka UI: `http://localhost:8080` (Event monitoring)
   - Kafka Broker: `localhost:9092` (Internal) / `localhost:9094` (External)
   - SQL Server: `localhost:1433`

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

### Running Components Individually

#### API (.NET 8)

1. **Navigate to the project directory:**
   ```bash
   cd src/LearnLanguage.API
   ```

2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

3. **Run the application:**
   ```bash
   dotnet run
   ```

4. **Access Swagger UI:**
   ```
   https://localhost:7297/swagger
   ```

#### Mobile App (Expo/React Native)

1. **Navigate to the mobile directory:**
   ```bash
   cd src/LearnLanguage.Mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npx expo start
   ```

4. **Open in:**
   - Development build
   - Android emulator
   - iOS simulator
   - Expo Go app

#### AI Component (Python Flask)

1. **Navigate to the AI directory:**
   ```bash
   cd src/LearnLanguage.AI
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables:**
   Create a `.env` file with:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

5. **Run the server:**
   ```bash
   python server.py
   ```

6. **Access the API:**
   ```
   http://localhost:5000
   ```

## API Documentation

The API is documented with Swagger/OpenAPI. When running the API, you can access the documentation at:

```
http://localhost:8081/swagger  # When running with Docker
https://localhost:7297/swagger # When running locally
```

### Key Endpoints

- **Authentication**: `/api/auth`
- **Users**: `/api/users`
- **Topics**: `/api/topics`
- **Lessons**: `/api/lessons`
- **Exercises**: `/api/exercises`

## Mobile App

The mobile application is built with Expo and React Native, providing a cross-platform experience for iOS and Android.

### Features

- User authentication
- Language learning modules
- Interactive exercises
- Progress tracking
- Audio pronunciation (via AI component)

### Navigation

The app uses file-based routing with Expo Router:
- `app/` - Main screens
- `app/(tabs)/` - Tab navigator screens
- `components/` - Reusable UI components

## AI Component

The AI component provides intelligent features for the language learning platform:

### Features

1. **Question Generation** - Generates various types of language learning questions
2. **Sentence Similarity** - Compares sentences for pronunciation practice
3. **Text-to-Speech** - Converts text to audio for pronunciation

### API Endpoints

- `POST /generate` - Generate language learning questions
- `POST /compare` - Compare sentence similarity
- `POST /text-to-speech` - Convert text to speech
- `GET /audio/<filename>` - Serve audio files

### Question Types

1. **Multiple Choice** - Choose the correct translation
2. **Fill in Blank** - Complete sentences with missing words
3. **Translation** - Translate sentences between languages
4. **Match** - Match words with their translations

## Database

The project uses SQL Server with separate read and write databases:

### Connection Strings

When running with Docker:
```
WriteDb: Server=sqlserver,1433;Database=WriteDb;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;
ReadDb: Server=sqlserver,1433;Database=ReadDb;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;
```

### Database Schema

Key entities include:
- Users
- Topics
- Lessons
- Exercises (Multiple types: MultipleChoice, FillBlank, Translation, Match)
- UserProgress
- UserActivity

## Testing

### API Tests

Run unit tests for the .NET API:
```bash
dotnet test
```

### Mobile App Tests

Run tests for the mobile application:
```bash
cd src/LearnLanguage.Mobile
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.