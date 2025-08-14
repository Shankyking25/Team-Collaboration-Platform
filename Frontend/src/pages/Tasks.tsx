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

import TB from "./TaskBoard"


type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "Todo" | "In Progress" | "Done";
  assignedTo?: { _id: string; name: string } | null;
};

type Member = {
  _id: string;
  name: string;
};

const columns: Task["status"][] = ["Todo", "In Progress", "Done"];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Tasks() {
  const q = useQuery();
  const projectId = q.get("projectId") || "";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Create Task state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Edit Task state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState<Task["status"]>("Todo");

  useEffect(() => {
    if (projectId) {
      fetchTasks();
      fetchMembers();
    }
  }, [projectId]);

  // Fetch tasks from backend
  async function fetchTasks() {
    try {
      // const { data } = await api.get(`/api/tasks`, {
      //   params: { projectId },
      // });
      // if (!Array.isArray(data)) return setTasks([]);
      // setTasks(data);

       const response = await api.get(`/api/tasks`, { params: { projectId } });
    const data = response.data as Task[];
    setTasks(Array.isArray(data) ? data : []);


    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    }
  }

  // Fetch members
  async function fetchMembers() {
    try {
    //   const { data } = await api.get(`/api/projects/${projectId}/members`);
    //   setMembers(Array.isArray(data) ? data : []);
  const response = await api.get(`/api/projects/${projectId}/members`);
const data = response.data as Member[];
setMembers(Array.isArray(data) ? data : []);  
  } catch (err) {
      console.error(err);
      setMembers([]);
    }
  }

  // Create a new task
  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      // const { data } = await api.post("/api/tasks", {
      //   projectId,
      //   title,
      //   description,
      //   status: "Todo",
      // });

        const response = await api.post(`/api/tasks`, {
      projectId,
      title,
      description,
      status: "Todo",
    });
    const data = response.data as Task;

      setTasks((prev) => [...prev, data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    }
  }


  // Delete a task
async function deleteTask(taskId: string) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authenticated");
      return;
    }
    console.log(taskId)

    await api.delete(`/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  } catch (err: any) {
    console.error(err);
    setError(err?.response?.data?.message || "Failed to delete task");
  }
}





  // Edit task
  function startEditingTask(task: Task) {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditStatus(task.status);
  }

  async function saveEditTask() {
    if (!editingTask) return;

    try {
      // const { data } = await api.put(`/api/tasks/${editingTask._id}`, {
      //   title: editTitle,
      //   description: editDesc,
      //   status: editStatus,
      // });

       const response = await api.put(`/api/tasks/${editingTask._id}`, {
      title: editTitle,
      description: editDesc,
      status: editStatus,
    });
    const data = response.data as Task;

      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
  }

  function cancelEdit() {
    setEditingTask(null);
  }

  // Assign task to member
  async function assignTask(taskId: string, userId: string) {
    try {
      // const { data } = await api.put(`/api/tasks/${taskId}/assign`, {
      //   assignedTo: userId,
      // });

       const response = await api.put(`/api/tasks/${taskId}/assign`, {
      assignedTo: userId,
    });
    const data = response.data as Task;

      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } catch (err) {
      console.error(err);
      setError("Failed to assign task");
    }
  }

  /*
  // Update task status
  async function updateStatus(taskId: string, status: Task["status"]) {
    try {
      // const { data } = await api.put(`/api/tasks/${taskId}`, { status });

  const response = await api.put(`/api/tasks/${taskId}`, { status });
    const data = response.data as Task;

      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));

    } catch (err) {
      console.error(err);
      setError("Failed to update status");
    }
  }
*/
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl text-white font-bold mb-4">Tasks</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {!projectId ? (
        <p className="text-white">Please open a project first.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Task List */}
          <div className="md:col-span-2 space-y-3">
            {tasks.map((t) => (
              <div
                key={t._id}
                className="m-5 bg-gray-800 p-6 rounded-md flex justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <div className="text-2xl mb-2 font-semibold text-white">{t.title}</div>
                  <div className="text-xl mb-2 text-gray-200">{t.description}</div>
                  <div className="text-lg mb-2 text-gray-300">
                    Assigned: {t.assignedTo?.name || "Unassigned"}
                  </div>

                  {/* Assign member */}
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

                {/* Status & actions */}
                <div className="ml-2 flex flex-col items-center gap-2">
                  <div className="text-2xl mb-2 text-white text-center">Status</div>
                <div className="p-2 bg-gray-600 rounded text-white w-32 text-center">
                     {t.status}
                   </div>
                  <Button variant="secondary" onClick={() => startEditingTask(t)} className="w-32 text-sm">
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => deleteTask(t._id)} className="w-32 text-sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Create Task */}
          <div className="bg-gray-700 p-4 rounded-md">
            <h2 className="font-semibold text-2xl mb-5 text-white">Create Task</h2>
            <form onSubmit={createTask} className="space-y-2">
              <div>
                <Label className="text-white text-xl" htmlFor="tname">
                  Title
                </Label>
                <Input
                  id="tname"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Title"
                  className="mb-4 text-white"
                />
              </div>
              <div>
                <Label className="text-white text-xl" htmlFor="tdesc">
                  Description
                </Label>
                <Input
                  id="tdesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="mb-6 text-white"
                />
              </div>
              <Button type="submit" className="text-2xl w-full">
                Create Task
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-md w-96 space-y-4">
            <h2 className="text-xl text-white font-bold">Edit Task</h2>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
            <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" />
            <Select value={editStatus} onValueChange={(val) => setEditStatus(val as Task["status"])}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-between">
              <Button onClick={saveEditTask}>Save</Button>
              <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
            </div>
          </div>
        </div>
      )}


{/* Task Board */}
        <TB />

    </div>
  );
}
