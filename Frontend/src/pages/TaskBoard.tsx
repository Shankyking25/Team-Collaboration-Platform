import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "Todo" | "In Progress" | "Done";
  assignee?: { _id: string; name: string };
};

const columns = ["Todo", "In Progress", "Done"];

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  // State for creating tasks
  const [newTaskCol, setNewTaskCol] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  async function fetchTasks() {
    try {
      const { data } = await api.get(`/api/tasks?projectId=${projectId}`);
      
       console.log(data)
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  }


  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const sourceCol = columns[parseInt(result.source.droppableId)];
    const destCol = columns[parseInt(result.destination.droppableId)];

    if (
      sourceCol === destCol &&
      result.source.index === result.destination.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = destCol;
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);

    try {
      await api.put(`/api/tasks/${movedTask._id}`, { status: movedTask.status });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }

  async function createTask(status: Task["status"]) {
    if (!projectId || !newTaskTitle.trim()) return;

    try {
      const { data } = await api.post(`/api/tasks`, {
        projectId,
        title: newTaskTitle,
        description: newTaskDesc,
        status,
      });
      setTasks((prev) => [...prev, data]);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskCol(null);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-xl text-white font-bold mb-4">Task Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((col, colIndex) => (
            <Droppable key={col} droppableId={String(colIndex)}>
              {(provided) => (
                <div
                  className="bg-gray-400 p-4 rounded-md min-h-[400px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-gray-800 font-semibold">{col}</h2>
                    <Button
                      
                      onClick={() =>
                        setNewTaskCol(newTaskCol === col ? null : col)
                      }
                    >
                      +
                    </Button>
                  </div>

                  {/* Create Task Form */}
                  {newTaskCol === col && (
                    <div className="bg-white p-2 rounded mb-2 shadow">
                      <Input
                        placeholder="Task title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="mb-2 text-white"
                        //inputClassName="text-white bg-gray-800"
                      />
                      <Input
                        className="mb-2 text-white"
                        //inputClassName="text-white bg-gray-800"
                        placeholder="Description"
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                        
                      />
                      <Button
                        
                        onClick={() => createTask(col as Task["status"])}
                        className="w-full"
                      >
                        Create
                      </Button>
                    </div>
                  )}

                  {tasks
                    .filter((t) => t.status === col)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="text-gray-900   bg-white p-3 mb-2 rounded shadow"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="font-medium text-lg">{task.title}</div>
                            {task.description && (
                              <div className="text-md text-gray-900">
                                {task.description}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}


