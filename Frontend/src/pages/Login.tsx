import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface LoginProps {
  setUser: (user: any) => void; // Receive from App.tsx
}

export default function Login({ setUser }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/api/auth/login", { email, password });

      // Save token and user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update App state so Header shows links
      setUser(data.user);

      alert(`Welcome ${data.user.name} (${data.user.role})`);

      navigate("/dashboard");
    } catch {
      setError("Failed to login user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-[var(--card)] p-6 rounded-xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-semibold">Log in</h1>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-2"
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </Button>
      </form>
    </div>
  );
}


