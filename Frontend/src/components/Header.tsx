// Header.tsx
import { Link } from "react-router-dom";

export default function Header({ user }: any) {

  if (!user) return null; // hide header if not logged in

  return (
    <div className="p-6 flex items-center gap-6 bg-gray-300  shadow-md">
      <Link
        to="/dashboard"
        className="text-2xl font-bold text-blue-700  hover:underline"
      >
        Dashboard
      </Link>
      <Link
        to="/projects"
        className="text-2xl font-bold text-blue-700  hover:underline"
      >
        Projects
      </Link>
    
      <Link
        to="/messages"
        className="text-2xl font-bold text-blue-700  hover:underline"
      >
        Chat
      </Link>
      {user.role === "ADMIN" && (
        <Link
          to="/team-create"
          className="text-2xl font-bold text-blue-700 hover:underline"
        >
          Create Team
        </Link>
      )}

    </div>
  );
}
