# Hive Board - Backend API

A robust NestJS backend API for a Trello-like project management application with real-time collaboration features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with Passport.js
- **Real-time Collaboration**: WebSocket support for live updates
- **Project Management**: Boards, Lists, and Cards management
- **User Management**: User registration, login, and profile management
- **MongoDB Integration**: Mongoose ODM for data persistence
- **API Documentation**: RESTful API endpoints
- **Validation**: Request validation using class-validator
- **Error Handling**: Comprehensive error handling and logging

## 🛠️ Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport.js
- **Real-time**: Socket.io
- **Validation**: class-validator + class-transformer
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (running locally or accessible instance)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hive-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT= #PORT_NUMBER
   MONGODB_URI= #MONGODB_URI
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```


## 🛠️ Development

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```


## 📄 License
This project is licensed under the UNLICENSED license.