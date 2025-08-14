import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

import TB from "./TaskBoard";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  assignedTo?: { _id: string; name: string } | null;
};

type Member = {
  _id: string;
  name: string;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Tasks() {
  const q = useQuery();
  const projectId = q.get("projectId") || "";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchTasks();
      fetchMembers();
    }
  }, [projectId]);





async function fetchTasks() {
  try {
    const token = localStorage.getItem("token"); // get token from localStorage
    const { data } = await api.get("/api/tasks", {
      params: { projectId },
      headers: { Authorization: `Bearer ${token}` }, // send token in header
    });

    if (!Array.isArray(data)) return setTasks([]);

    setTasks(
      data.map((t: any) => ({
        ...t,
        status: t.status.toLowerCase().replace(" ", "-") as Task["status"],
      }))
    );
  } catch (err) {
    console.log("Failed to fetch tasks:", err);
    setError("Failed to load tasks");
  }
}








  // Fetch members of the project for assignment
  async function fetchMembers() {
    try {
      const { data } = await api.get(`/api/projects/${projectId}/members`);
      setMembers(data); // expected [{ _id, name }]
    } catch (err) {
      console.log(err);
      setMembers([]);
    }
  }





  // Create a new task
  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/api/tasks", { title, description, projectId });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      console.log(err);
      setError("Failed to create task");
    }
  }




// Helper to format status to match backend enum
function formatStatus(status: string) {
  if (status === "todo") return "Todo";
  if (status === "in-progress") return "In Progress";
  if (status === "done") return "Done";
  return status; // fallback
}

// Update task status
async function updateStatus(taskId: string, status: Task["status"]) {
  try {
    const token = localStorage.getItem("token"); // add JWT if backend requires
    const formattedStatus = formatStatus(status as string);

    await api.put(
      `/api/tasks/${taskId}`,
      { status: formattedStatus },
      { headers: { Authorization: `Bearer ${token}` } } // if needed
    );
    fetchTasks();
  } catch (err) {
    console.log(err);
    setError("Failed to update task status");
  }
}




  // Assign task to member
  async function assignTask(taskId: string, userId: string) {
    try {
      await api.put(`/api/tasks/${taskId}/assign`, { assignedTo: userId });
      fetchTasks();
    } catch (err) {
      console.log(err);
      setError("Failed to assign task");
    }
  }

  return (
    <div className="p-6 bg-gray-900">
      <h1 className="text-2xl  text-white font-bold mb-4">Tasks</h1>

      {!projectId ? (
        <p>Please open a project first.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Task List */}
          <div className="md:col-span-2 space-y-3">
            {error && <p className="text-red-500">{error}</p>}
            {tasks.map((t) => (
              <div
                key={t._id}
                className="m-5 bg-gray-800 p-6 rounded-md flex justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <div className="text-2xl mb-3 font-semibold text-white">{t.title}</div>
                  <div className="text-xl mb-3 text-gray-200">{t.description}</div>
                  <div className="text-lg mb-3 text-gray-300">
                    Assigned: {t.assignedTo?.name || "Unassigned"}
                  </div>

                  {/* Assign dropdown */}
                  <div className="mt-2">
                    {members.length > 0 ? (
                      <Select
                        value={t.assignedTo?._id || ""}
                        onValueChange={(val) => assignTask(t._id, val)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent className="z-50 max-h-60 overflow-y-auto">
                          {members.map((m) => (
                            <SelectItem key={m._id} value={m._id}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-400 italic mt-1">
                        No members available
                      </p>
                    )}
                  </div>
                </div>

                 {/* Status display */}
                <div className="ml-2">
                   <div className="text-2xl mb-4 text-white   text-center">Status</div>
                   <div className="p-2 bg-gray-600 rounded text-white w-32 text-center">
                    {t.status}
                   </div>
                </div>


              </div>
            ))}
          </div> 






          {/* Create Task */}
          <div className="bg-gray-700 p-4 rounded-md">
            <h2 className="font-semibold  text-2xl mb-5 text-white">Create Task</h2>
            <form onSubmit={createTask} className="space-y-2">
              <div>
                <Label className="text-white  text-xl" htmlFor="tname">
                  Title
                </Label>
                <Input
                  id="tname"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                    className="mb-4 text-white"
                  placeholder="Title"
                />
              </div>
              <div>
                <Label   className="text-white  text-xl"   htmlFor="tdesc">
                  Description
                </Label>
                <Input
                 placeholder="Description"
                  className="mb-6 text-white"
                  id="tdesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className="text-2xl w-full">
                Create Task
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Task Board */}
      <TB />
    </div>
  );
}











