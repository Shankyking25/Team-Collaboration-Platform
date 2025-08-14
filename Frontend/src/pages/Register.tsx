import { useState } from "react";
import { api } from "../api/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select"; 
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

export default function Register() {
  const navigate = useNavigate(); // ✅ Create navigate function
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [role,setRole]=useState<"ADMIN"|"MANAGER"|"MEMBER">("MEMBER");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    setLoading(true); 
    setError(null);
    try{
      const { data } = await api.post("/api/auth/register",{ name,email,password,role });
      localStorage.setItem("token", data.token);
      alert("Registered! JWT stored. You can now log in.");
      navigate("/login"); // ✅ Navigate to login after registration
    }catch(error){
      console.log(error)
      setError("Failed to register user");
    }finally{ 
      setLoading(false); 
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-[var(--card)] p-6 rounded-xl shadow-lg space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" required/>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jane@email.com" required/>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/>
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <div className="w-64">
            <Select
              value={role}
              onValueChange={(value) => setRole(value as "ADMIN" | "MANAGER" | "MEMBER")}
            >
              <SelectTrigger id="role" className="w-full mt-1">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
              </SelectContent>
            </Select>

            <p className="mt-3 text-sm text-gray-500">
              Selected Role: <span className="font-semibold">{role}</span>
            </p>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Creating..." : "Register"}
        </Button>

        {/* Login Switch Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full mt-2"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Button>
      </form>
    </div>
  );
}
