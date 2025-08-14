import { useEffect, useState } from "react";
import { api } from "../api/axios";

type Member = {
  _id: string;
  name: string;
  role: string;
  email?: string;
};

type TaskLog = {
  _id: string;
  title: string;
  assignedTo?: { name: string };
  updatedAt: string;
};

type MessageLog = {
  _id: string;
  content: string;
  senderId?: { name: string };
  createdAt: string;
};

type Team = {
  _id: string;
  name: string;
  description?: string;
  adminId?: { name: string; email?: string };
};

export default function TeamOverview() {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<TaskLog[]>([]);
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setTeamId(user.teamId || null);
  }, []);

  useEffect(() => {
    if (teamId) {
      fetchTeamMembers();
      fetchActivityLogs();
    }
  }, [teamId]);

  async function fetchTeamMembers() {
    try {
     // const { data } = await api.get(`/api/team/${teamId}/members`);
     
      const response = await api.get(`/api/team/${teamId}/members`);
    const teamData = response.data as { team: Team | null; members: Member[] };
     
     setTeam(teamData.team || null);
      setMembers(Array.isArray(teamData.members) ? teamData.members : []);
    } catch (err) {
      console.error("Failed to fetch team members", err);
      setMembers([]);
    }
  }

  async function fetchActivityLogs() {
    try {
     // const { data } = await api.get(`/api/team/${teamId}/activity`);
     
      const response = await api.get(`/api/team/${teamId}/activity`);
    const activityData = response.data as {
      tasks: Task[];
      messages: Message[];
    };
     
    //  setTasks(Array.isArray(data.tasks) ? data.tasks : []);
    //   setMessages(Array.isArray(data.messages) ? data.messages : []);

    setTasks(Array.isArray(activityData.tasks) ? activityData.tasks : []);
    setMessages(Array.isArray(activityData.messages) ? activityData.messages : []);


    } catch (err) {
      console.error("Failed to fetch activity logs", err);
      setTasks([]);
      setMessages([]);
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Team Overview</h1>

      {team && (
        <div className="mb-6 p-4 bg-gray-200 dark:bg-gray-800 rounded-md">
          <h2 className="font-semibold mb-2">Team: {team.name}</h2>
          <p className="text-sm mb-1">Description: {team.description || "N/A"}</p>
          <p className="text-sm">
            Admin: {team.adminId?.name} ({team.adminId?.email})
          </p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Team Members</h2>
        <ul className="list-disc ml-5">
          {members.length > 0 ? (
            members.map((m) => (
              <li key={m._id}>
                {m.name} - <span className="font-semibold">{m.role}</span>
              </li>
            ))
          ) : (
            <li>No members found</li>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Recent Task Updates</h2>
        <ul className="list-disc ml-5">
          {tasks.length > 0 ? (
            tasks.map((t) => (
              <li key={t._id}>
                {t.title} - Assigned to {t.assignedTo?.name || "Unassigned"} (
                {new Date(t.updatedAt).toLocaleString()})
              </li>
            ))
          ) : (
            <li>No recent tasks</li>
          )}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Recent Messages</h2>
        <ul className="list-disc ml-5">
          {messages.length > 0 ? (
            messages.map((m) => (
              <li key={m._id}>
                {m.senderId?.name || "Unknown"}: {m.content} (
                {new Date(m.createdAt).toLocaleString()})
              </li>
            ))
          ) : (
            <li>No recent messages</li>
          )}
        </ul>
      </div>
    </div>
  );
}
