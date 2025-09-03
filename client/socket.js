import { io } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";

export function useSocket() {
  const { getToken } = useAuth();

  const socket = io(import.meta.env.VITE_BASE_URL, {
    auth: async (cb) => {
      const token = await getToken();
      cb({ token });   // send token in handshake
    },
    withCredentials: true,
  });

  return socket;
}
