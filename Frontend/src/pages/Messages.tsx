import { useEffect, useState, useRef } from "react";
import { api } from "../api/axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { io, Socket } from "socket.io-client";

type Message = {
  _id: string;
  content: string;
  senderId: { name: string };
  timestamp: string;
};

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Replace with actual IDs
  const teamId = localStorage.getItem("teamId") || "";
  const chatId = localStorage.getItem("chatId") || ""; // you can set this from your UI

  // Socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:5000"); // change for production
    socketRef.current.emit("joinTeam", teamId);

    socketRef.current.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [teamId]);

  // Fetch messages
  async function fetchMessages() {
    try {
      const response = await api.get(`/api/messages/${chatId}`);
      const data = response.data as Message[];
      setMessages(Array.isArray(data) ? data : []);
      setTimeout(() =>
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        }),
        50
      );
    } catch {
      setError("Failed to fetch messages");
    }
  }

  useEffect(() => {
    fetchMessages();
    timerRef.current = window.setInterval(fetchMessages, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Send message
  async function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await api.post(`/api/messages/${chatId}`, {
        content: text.trim(),
      });
      const data = response.data as Message;

      // Emit real-time update
      socketRef.current?.emit("sendMessage", { ...data, teamId });

      setText("");
    } catch {
      setError("Failed to send message");
    }
  }

  return (
    <div className="p-6 flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Team Chat</h1>
      <div
        ref={listRef}
        className="flex-1 overflow-auto p-3 bg-gray-600 rounded-md space-y-2 mb-4"
      >
        {messages.map((m) => (
          <div key={m._id} className="p-2 bg-transparent">
            <div className="text-sm font-semibold">
              {m.senderId?.name || "Unknown"}
            </div>
            <div className="text-sm">{m.content}</div>
            <div className="text-xs text-[var(--muted)]">
              {new Date(m.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={sendMessage} className="flex gap-2">
        <Input
          className="text-white"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
