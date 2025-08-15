# Team Collaboration Platform

A web-based platform that allows teams to manage projects, assign tasks, track progress, and communicate in real-time. Includes role-based access control, Kanban task boards, and team chat functionality.

---

## Setup and Run Instructions

### Backend

1) Clone the repository.
2) Navigate to the backend folder: cd Backend
3) Install dependencies: npm install
   
4) Create a .env file with the following variables:
PORT=5000
MONGO_URI=<your_mongodb_uri>
FIREBASE_SERVICE_ACCOUNT=<path_to_serviceAccountKey.json>
JWT_SECRET=<your_jwt_secret>

5)Start the backend server:   npm run dev



### Frontend

1) Navigate to the frontend folder: cd Frontend
2) Install dependencies: npm install
3) Configure Firebase in firebase.ts with your project credentials
4) Start the frontend server:   npm run dev
5) Open the app in the browser at: http://localhost:5173


🧰 Technology Stack

# Frontend

1) React.js
2) TypeScript
3) Tailwind CSS
4) Shadcn UI
5) React Router
6) React Beautiful DnD
7) Firebase Authentication
8) Socket.IO-client



# Backend

1)Node.js
2) Express.js
3) MongoDB with Mongoose
4) Firebase Admin SDK
5) Joi (Validation)
6) JSON Web Tokens (JWT)
7) Socket.IO





✨ Additional Features Implemented

1) Role-based access (Admin, Manager, Member) across frontend and backend.
2) Real-time chat using Socket.IO.
3) Kanban task board with drag-and-drop support.
4) Activity logs for tracking user actions.
5) Dark mode support with Tailwind CSS.
6) Input validation with Joi and secure authentication with Firebase & JWT.
7) Responsive and clean UI using Shadcn components.
