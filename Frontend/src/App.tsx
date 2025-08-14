import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Messages from "./pages/Messages";
import TeamOverview from "./pages/TeamOverview";
import TeamCreate from "./pages/TeamCreate";
import Header from "./components/Header";

function AppWrapper() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Don't show header on login or register page
  const hideHeader = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideHeader && <Header user={user} setUser={setUser} />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/team-overview" element={<TeamOverview />} />
        <Route path="/team-create" element={<TeamCreate />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
