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
   const socketRef = useRef<Socket | null>(null)


   
  // Replace with actual teamId from logged-in user
  const teamId = localStorage.getItem("teamId") || "";

  // Initialize socket
  useEffect(() => {
    socketRef.current = io("http://localhost:5000"); // replace with your backend URL
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


   // Fetch previous messages
  // useEffect(() => {
  //   fetchMessages();
  // }, []);


  async function fetchMessages() {
    try {
      const { data } = await api.get("/api/messages");
      setMessages(data);
      // scroll bottom
      setTimeout(()=> listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
    } catch  {
      setError("Failed to register user");
    }
  }

  useEffect(() => {
    fetchMessages();
    timerRef.current = window.setInterval(fetchMessages, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);




    async function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    console.log(text.trim())

    try {
      // Send to backend API
      const { data } = await api.post("/api/messages", { content: text.trim() });

      // Emit to socket for real-time update
      socketRef.current?.emit("sendMessage", { ...data, teamId });

      setText("");
    } catch {
      setError("Failed to send message");
    }
  }



  return (
    <div className="p-6 flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Team Chat</h1>
      <div ref={listRef} className="flex-1 overflow-auto p-3 bg-gray-600 rounded-md space-y-2 mb-4">
        {messages.map(m => (
          <div key={m._id} className="p-2 bg-transparent">
            <div className="text-sm font-semibold">{m.senderId?.name || "Unknown"}</div>
            <div className="text-sm">{m.content}</div>
            <div className="text-xs text-[var(--muted)]">{new Date(m.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={sendMessage} className="flex gap-2">
        <Input  className=" text-white"  value={text} onChange={(e)=>setText(e.target.value)} placeholder="Write a message..." />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
