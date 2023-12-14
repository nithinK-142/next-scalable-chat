"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import "./globals.css";

export default function Page() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState("");
  return (
    <main>
      <h1 className="mt-4 text-6xl text-center text-pink-500">Messages</h1>
      <div className="flex justify-center mt-6">
        <input
          type="text"
          placeholder="Type here..."
          onChange={(e) => setMessage(e.target.value)}
          className="block w-1/2 p-4 mb-1 text-gray-900 border border-gray-300 rounded-lg outline-none bg-gray-50 sm:text-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
        <button
          type="button"
          onClick={() => sendMessage(message)}
          className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm ml-2 px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          Send
        </button>
      </div>
    </main>
  );
}
