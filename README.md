# 🚀 Team Collaboration Platform

![GitHub Repo Size](https://img.shields.io/github/repo-size/<username>/<repo>) 
![GitHub last commit](https://img.shields.io/github/last-commit/<username>/<repo>) 
![License](https://img.shields.io/github/license/<username>/<repo>)

A **web-based platform** that enables teams to **manage projects**, **assign tasks**, **track progress**, and **communicate in real-time**.  

**Key Features:**
- Role-based access control (Admin, Manager, Member)
- Kanban-style task boards with drag-and-drop
- Real-time chat with Socket.IO
- Team activity logs
- Responsive and modern UI with Tailwind CSS & Shadcn components

---

## 🛠 Setup and Run Instructions

### Backend
1. **Clone the repository**
\`\`\`bash
git clone <repository_url>
\`\`\`
2. **Navigate to backend folder**
\`\`\`bash
cd Backend
\`\`\`
3. **Install dependencies**
\`\`\`bash
npm install
\`\`\`
4. **Create a \`.env\` file** with the following variables:
\`\`\`env
PORT=5000
MONGO_URI=<your_mongodb_uri>
FIREBASE_SERVICE_ACCOUNT=<path_to_serviceAccountKey.json>
JWT_SECRET=<your_jwt_secret>
\`\`\`
5. **Start the backend server**
\`\`\`bash
npm run dev
\`\`\`

### Frontend
1. **Navigate to frontend folder**
\`\`\`bash
cd Frontend
\`\`\`
2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`
3. **Configure Firebase** in \`firebase.ts\` with your project credentials
4. **Start the frontend server**
\`\`\`bash
npm run dev
\`\`\`
5. **Open in browser**
\`\`\`
http://localhost:5173
\`\`\`

---

## 🧰 Technology Stack

### Frontend
- ⚛️ React.js
- 🟦 TypeScript
- 🎨 Tailwind CSS
- 🖼️ Shadcn UI
- 🧭 React Router
- 📦 React Beautiful DnD
- 🔒 Firebase Authentication
- 💬 Socket.IO-client

### Backend
- 🌐 Node.js
- 🚂 Express.js
- 🗄️ MongoDB with Mongoose
- 🔑 Firebase Admin SDK
- 📝 Joi (Validation)
- 🔐 JSON Web Tokens (JWT)
- 💬 Socket.IO

---

## ✨ Additional Features
- **Role-based access** for Admin, Manager, and Member
- **Real-time chat** for teams
- **Kanban task board** with drag-and-drop functionality
- **User activity logs** for tracking tasks and messages
- **Dark mode support** using Tailwind CSS
- **Input validation** with Joi and secure authentication via Firebase & JWT
- **Responsive UI** built with Shadcn components

---

## 📹 Demonstration
Check out the video demo to see the app in action:
- Login & Registration
- Project & Task Management
- Drag-and-Drop Kanban board
- Real-time chat
- Role-based views (Admin vs Manager vs Member)

---

Generated with ❤️ by **[Shashank Singh]**
`;

const filePath = path.join(__dirname, "README.md");
fs.writeFileSync(filePath, readmeContent.trim(), "utf8");

console.log("✅ README.md has been successfully generated!");

