import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";

interface UserData {
  name: string;
  role: string;
  teamId?: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize user and theme
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));

    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);
    updateBodyTheme(savedTheme);
  }, [navigate]);

  // Update document body class for theme
  const updateBodyTheme = (enabled: boolean) => {
    if (enabled) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("darkMode", "false");
    updateBodyTheme(false);

    navigate("/login");
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode.toString());
      updateBodyTheme(newMode);
      return newMode;
    });
  };

  if (!user) return null; // Prevent flash before redirect

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Dashboard
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
      </p>

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600"
        >
          Logout
        </Button>

        {/* Dark Mode Toggle */}
        <Button
          onClick={toggleDarkMode}
          className="bg-gray-500 text-white hover:bg-gray-600"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>

        {/* Team Actions */}
        {user.role === "ADMIN" && !user.teamId && (
          <Link to="/team-create">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Create Your Team
            </Button>
          </Link>
        )}

        {user.teamId && (
          <Link to="/team-overview">
            <Button className="bg-green-500 hover:bg-green-600">
              Team Overview
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}


