// src/components/DarkModeToggle.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Button
      variant="outline"
      onClick={() => setIsDark(!isDark)}
      className="ml-auto"
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </Button>
  );
}
