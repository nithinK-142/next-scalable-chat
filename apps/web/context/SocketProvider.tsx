"use client";
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { io } from "socket.io-client";

interface SocketProviderProps {
  children?: ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("state is undefined!");

  return state;
};

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => {
    console.log(msg);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");

    return () => {
      _socket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
