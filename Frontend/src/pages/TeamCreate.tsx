// src/pages/TeamCreate.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function TeamCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/team", { name, description });
      console.log("Team created:", data);

      // Update localStorage user teamId
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.teamId = data._id;
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/team-overview");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create team");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 dark:bg-gray-900 p-6">
      <form
        onSubmit={handleCreateTeam}
        className="bg-white dark:bg-gray-800 p-6 rounded-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Create Your Team
        </h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <Label htmlFor="name" className="text-gray-700  text-xl dark:text-gray-300">
            Team Name
          </Label>
          <Input
            id="name"
            placeholder="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className=" mb-2 text-white w-full p-2 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="desc" className="text-gray-700  text-xl dark:text-gray-300">
            Description
          </Label>
          <Input
            id="desc"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2 text-white w-full p-2 rounded-md"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
          Create Team
        </Button>
      </form>
    </div>
  );
}
