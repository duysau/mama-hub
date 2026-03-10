"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-context";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // In a real app, this would be your backend URL
    // For now, we'll try to connect but handle the connection errors gracefully
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3005",
      {
        reconnectionAttempts: 3,
        timeout: 5000,
      },
    );

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.log(
        "Socket connection error (expected since backend is pending):",
        err.message,
      );
    });

    // Set up BroadcastChannel to forward messages to other Micro Frontends
    const bc = new BroadcastChannel("mamahub_events");

    socketInstance.on("sync_event", (data) => {
      // Forward to other apps
      bc.postMessage({ type: "sync_event", payload: data });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      bc.close();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
