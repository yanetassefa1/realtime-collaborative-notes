import { useEffect, useRef, useState, useCallback } from "react";
import { ActiveUser } from "../utils/types";

const WS_BASE = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

interface UseCollabOptions {
  noteId: string;
  onContentUpdate: (content: string, title: string) => void;
}

export function useCollabSocket({ noteId, onContentUpdate }: UseCollabOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !noteId) return;

    const ws = new WebSocket(`${WS_BASE}/ws/notes/${noteId}/?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "content_update") {
        onContentUpdate(data.content, data.title);
      }

      if (data.type === "user_join") {
        setActiveUsers((prev) => {
          const exists = prev.find((u) => u.user_id === data.user_id);
          if (exists) return prev;
          return [...prev, { user_id: data.user_id, username: data.username, color: data.color }];
        });
      }

      if (data.type === "user_leave") {
        setActiveUsers((prev) => prev.filter((u) => u.user_id !== data.user_id));
      }

      if (data.type === "cursor_move") {
        setActiveUsers((prev) =>
          prev.map((u) =>
            u.user_id === data.user_id ? { ...u, position: data.position } : u
          )
        );
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setActiveUsers([]);
    };

    return () => {
      ws.close();
    };
  }, [noteId]);

  const sendUpdate = useCallback((content: string, title: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "content_update", content, title }));
    }
  }, []);

  const sendCursor = useCallback((position: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "cursor_move", position }));
    }
  }, []);

  return { connected, activeUsers, sendUpdate, sendCursor };
}
