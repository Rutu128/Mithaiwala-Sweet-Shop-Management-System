# Mithaiwala Sweet Shop Management System

A comprehensive full-stack web application for managing a sweet shop business, built with React, TypeScript, Node.js, Express, and MongoDB.

## 🍬 Project Overview

The Mithaiwala Sweet Shop Management System is designed to streamline operations for sweet shop businesses. It provides a modern, user-friendly interface for managing inventory, orders, and customer interactions.

## ✨ Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Built with React 19, TypeScript, and Tailwind CSS
- **Authentication System**: Secure login with JWT token management
- **Protected Routes**: Route protection for authenticated users
- **Responsive Design**: Mobile-first approach with modern UI components
- **Component Library**: Custom UI components using Radix UI primitives

### Backend (Node.js + Express + TypeScript)
- **RESTful API**: Well-structured API endpoints for all operations
- **Authentication & Authorization**: JWT-based authentication system
- **Database Integration**: MongoDB with Mongoose ODM
- **Data Models**: Comprehensive models for sweets, orders, users, and order items
- **Middleware**: Custom authentication and error handling middleware
- **Testing**: Jest test suite for API endpoints

### Core Functionality
- **Sweet Inventory Management**: Add, edit, delete, and view sweet items
- **Order Management**: Create and track customer orders
- **User Management**: Secure user registration and authentication
- **Category Management**: Organize sweets by categories (chocolate, caramel, toffee, fudge, other)
- **Real-time Updates**: Dynamic inventory tracking

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.6** - Fast build tool and dev server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **React Router 7.9.1** - Client-side routing
- **Axios 1.12.2** - HTTP client for API calls
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web framework
- **TypeScript 5.9.2** - Type-safe server development
- **MongoDB** - NoSQL database
- **Mongoose 8.18.1** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Jest 30.1.3** - Testing framework
- **Supertest** - HTTP assertion library

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mithaiwala-Sweet-Shop-Management-System
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mithaiwala
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

5. **Start the development servers**

   **Terminal 1 - Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
Mithaiwala-Sweet-Shop-Management-System/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components (Button, Card, Input, etc.)
│   │   │   ├── LoginComponent.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/          # React contexts for state management
│   │   │   ├── AuthContext.tsx
│   │   │   └── AuthContextType.ts
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useAuth.ts
│   │   ├── pages/             # Page components
│   │   │   ├── DashboardPage.tsx
│   │   │   └── LoginPage.tsx
│   │   ├── services/          # API service layer
│   │   │   └── api.ts
│   │   ├── lib/               # Utility functions
│   │   │   └── utils.ts
│   │   ├── App.tsx            # Main App component
│   │   └── main.tsx           # Application entry point
│   ├── public/                # Static assets
│   └── package.json
├── server/                     # Node.js backend application
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── sweets.controller.ts
│   │   ├── models/            # Database models
│   │   │   ├── user.model.ts
│   │   │   ├── sweet.model.ts
│   │   │   ├── order.model.ts
│   │   │   └── orderItems.model.ts
│   │   ├── routes/            # API routes
│   │   │   ├── auth.route.ts
│   │   │   ├── sweet.route.ts
│   │   │   └── index.ts
│   │   ├── middlewares/       # Custom middleware
│   │   │   └── auth.middleware.ts
│   │   ├── db/                # Database configuration
│   │   │   └── index.ts
│   │   ├── tests/             # Test files
│   │   │   ├── auth.test.ts
│   │   │   ├── sweet.test.ts
│   │   │   └── inventory.test.ts
│   │   ├── app.ts             # Express app configuration
│   │   └── index.ts           # Server entry point
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Client Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Server Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run test suite
```

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
cd server
npm test
```

Tests cover:
- Authentication endpoints
- Sweet management APIs
- Inventory operations
- Error handling scenarios

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Sweets Management
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create new sweet (protected)
- `PUT /api/sweets/:id` - Update sweet (protected)
- `DELETE /api/sweets/:id` - Delete sweet (protected)

## 🎨 UI Components

The application uses a custom component library built on Radix UI primitives:
- **Button** - Customizable button component
- **Card** - Container component for content
- **Input** - Form input component
- **Label** - Form label component

## 🔒 Security Features

- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Secure password handling

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd server
npm run build
npm start
# Deploy to your server or cloud platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 My AI Usage

### AI Tools Used

I utilized two primary AI tools throughout the development of this project:

1. **ChatGPT** - For comprehensive assistance with code generation, debugging, and architectural decisions
2. **GitHub Copilot** - For real-time code suggestions and autocompletion during development

### How I Used AI Tools

#### ChatGPT Usage:
- **API Design & Architecture**: I used ChatGPT to brainstorm and design the RESTful API structure for the sweet shop management system. This included planning the database schema, defining endpoint structures, and establishing the relationship between different models (User, Sweet, Order, OrderItems).

- **Code Generation**: ChatGPT helped generate boilerplate code for controllers, models, and middleware. For example, I used it to create the authentication middleware, JWT token handling logic, and the complete CRUD operations for the sweets controller.

- **Database Schema Design**: I consulted ChatGPT to design the MongoDB schemas, including the Sweet model with proper validation, the User model with authentication fields, and the Order/OrderItems models for managing customer orders.

- **Frontend Component Architecture**: ChatGPT assisted in planning the React component structure, including the authentication context, protected routes, and the overall application state management approach.

- **Testing Strategy**: I used ChatGPT to generate comprehensive test cases for the API endpoints, including authentication tests, CRUD operation tests, and error handling scenarios.

- **Documentation**: ChatGPT helped structure this README file and provided guidance on best practices for project documentation.

#### GitHub Copilot Usage:
- **Real-time Code Completion**: GitHub Copilot provided intelligent code suggestions while writing TypeScript interfaces, React components, and Express route handlers. It significantly sped up the development process by suggesting appropriate imports, function signatures, and common patterns.

- **TypeScript Type Definitions**: Copilot was particularly helpful in generating TypeScript type definitions, especially for complex interfaces like the AuthContextType and API response types.

- **React Hook Implementation**: Copilot assisted in writing custom React hooks like useAuth, suggesting proper dependency arrays and hook patterns.

- **Express Route Handlers**: While writing the API controllers, Copilot provided suggestions for error handling patterns, response formatting, and middleware integration.

- **Component Props and Styling**: Copilot helped with Tailwind CSS class suggestions and React component prop definitions, making the UI development more efficient.

### Reflection on AI Impact

The integration of AI tools into my development workflow had a profound impact on both productivity and code quality:

**Positive Impacts:**
- **Accelerated Development**: AI tools reduced development time by approximately 40-50% through intelligent code suggestions and boilerplate generation.
- **Enhanced Code Quality**: ChatGPT's architectural guidance helped me implement best practices from the start, resulting in cleaner, more maintainable code.
- **Learning Enhancement**: Both tools served as learning aids, exposing me to modern patterns and best practices I might not have discovered independently.
- **Reduced Cognitive Load**: Copilot's real-time suggestions allowed me to focus on higher-level problem-solving rather than syntax and common patterns.
- **Comprehensive Testing**: AI assistance in test generation ensured better coverage and more robust error handling.

**Challenges and Considerations:**
- **Code Review Necessity**: While AI suggestions were generally accurate, I had to maintain vigilance in reviewing generated code to ensure it met project-specific requirements.
- **Dependency on AI**: There was a risk of becoming overly reliant on AI suggestions, which I mitigated by understanding the underlying concepts and making informed decisions about AI recommendations.
- **Context Limitations**: Sometimes AI suggestions needed refinement to fit the specific business logic of the sweet shop management system.

**Overall Assessment:**
The AI tools transformed my development experience from a traditional coding approach to a collaborative, AI-assisted workflow. They didn't replace my problem-solving skills but rather amplified them, allowing me to focus on business logic and user experience while AI handled routine implementation details. This project demonstrates how AI can be a powerful ally in full-stack development when used thoughtfully and with proper oversight.

---

## 📞 Support

For support or questions about this project, please open an issue in the repository or contact the development team.

---

*Built with ❤️ for sweet shop businesses everywhere*