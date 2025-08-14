import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

type Message = {
  senderId: string;
  senderEmail: string;
  content: string;
  timestamp: number;
};

const socket: Socket = io("http://localhost:4000"); // Replace with your backend URL

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Receive initial messages
    socket.on("initialMessages", (msgs: Message[]) => {
      setMessages(msgs);
    });

    // Listen for new messages
    socket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("initialMessages");
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    // Scroll chat to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg: Message = {
      senderId: user?.uid || "anonymous",
      senderEmail: user?.email || "Anonymous",
      content: input.trim(),
      timestamp: Date.now(),
    };

    socket.emit("sendMessage", msg);
    setInput("");
  };

  if (!user) return <div>Please log in to chat</div>;

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded shadow p-4">
      <div className="flex-grow overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.senderId === user.uid
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start"
            } max-w-xs break-words`}
          >
            <div className="text-xs font-semibold">{msg.senderEmail}</div>
            <div>{msg.content}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-grow rounded px-3 py-2 text-black dark:text-white dark:bg-gray-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
