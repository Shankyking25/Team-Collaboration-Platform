import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

type Project = {
  _id: string;
  name: string;
  description?: string;
  teamId?: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); // user role

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();

    // Load saved theme preference
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }

    // Get user role from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserRole(JSON.parse(storedUser).role);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
      localStorage.setItem("darkMode", newMode.toString());
      return newMode;
    });
  };

  async function fetchProjects() {
    try {
      const response = await api.get(`/api/projects`);
      const data = response.data as Project[];
    // setProjects(data);
    setProjects(Array.isArray(data) ? data : []);

    } catch (error) {
      console.log(error);
      setError("Failed to load Project");
    }
  }



//  async function createOrUpdateProject(e: React.FormEvent) {
//   e.preventDefault();
     
//   try {
//     if (editId) {      
//       const response = await api.put(`/api/projects/${editId}`, { name, description });
//       const updatedProject = response.data as Project;
//       console.log(editId)
//       console.log(updatedProject)
//       setProjects(prev =>
//         prev.map(p => (p._id === editId ? updatedProject : p))
//       );
//     } else {
//       const response = await api.post("/api/projects", { name, description });
//       const newProject = response.data as Project;
//       setProjects(prev => [...prev, newProject]);
//     }

//     setName("");
//     setDescription("");
//     setEditId(null);
//   } catch (error) {
//     console.log(error);
//     setError(editId ? "Failed to update project" : "Failed to create project");
//   }
// }



async function createOrUpdateProject(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/projects/${editId}`, { name, description });
      } else {
        await api.post("/api/projects", { name, description });
      }
      setName("");
      setDescription("");
      setEditId(null);
      fetchProjects();
    } catch (error) {
      console.log(error);
      setError(editId ? "Failed to update project" : "Failed to create project");
    }
  }





async function deleteProject(id: string) {
  if (!confirm("Are you sure you want to delete this project?")) return;
  try {
    await api.delete(`/api/projects/${id}`);
    setProjects(prev => prev.filter(p => p._id !== id));
  } catch (error) {
    console.log(error);
    setError("Failed to delete project");
  }
}


  function startEdit(project: Project) {
    setEditId(project._id);
    setName(project.name);
    setDescription(project.description || "");
  }

  return (
    <div className="p-6 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={toggleDarkMode}
          className="bg-gray-500 text-white hover:bg-gray-700"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Projects list */}
        <div className="md:col-span-2">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p._id}
                className={`p-3 rounded-md flex justify-between items-center transition-colors duration-300 ${
                  darkMode ? "bg-white text-black" : "bg-gray-800 text-white"
                }`}
              >
                <div>
                  <div className="text-xl  font-semibold">{p.name}</div>
                  <div className="text-lg text-gray-500">{p.description}</div>
                </div>
                <div className="flex gap-2">
                  {userRole === "ADMIN" && (
                    <>
                      <Button
                       // variant="outline"
                       variant="destructive" 
                       
                        onClick={() => startEdit(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        
                        onClick={() => deleteProject(p._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  <Button
                    
                    onClick={() => navigate(`/tasks?projectId=${p._id}`)}
                  >
                    Manage Tasks
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create / Edit project */}
        {userRole === "ADMIN" && (
          <div
            className={`p-4 rounded-md transition-colors duration-300 ${
              darkMode ? "bg-white text-white" : "bg-gray-800 text-white"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-2  ${
                darkMode ? "text-black" : "text-white"
              } `}
            >
              {editId ? "Edit Project" : "Create Project"}
            </h2>
            <form onSubmit={createOrUpdateProject} className="space-y-2">
              <div>
                <Label
                  htmlFor="pname"
                  className={` text-xl ${darkMode ? "text-black" : "text-white"}`}
                >
                  Name
                </Label>
                <Input
                  id="pname"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={` mb-2 text-white w-full rounded-md p-2 transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-100 text-black border-gray-300"
                      : "bg-gray-700 text-white border-gray-600"
                  }`}
                />
              </div>
              <div>
                <Label
                  htmlFor="pdesc"
                  className={` text-xl ${darkMode ? "text-black" : "text-white"}`}
                >
                  Description
                </Label>
                <Input
                  id="pdesc"
                  placeholder="Description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={` mb-2 text-white w-full rounded-md p-2 transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                      : "bg-white text-black border-gray-300 placeholder-gray-500"
                  }`}
                />
              </div>
              <Button type="submit" className="w-full">
                {editId ? "Update" : "Create"}
              </Button>
              {editId && (
                <Button
                  type="button"
                  className="w-full mt-2"
                  variant="secondary"
                  onClick={() => {
                    setEditId(null);
                    setName("");
                    setDescription("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

