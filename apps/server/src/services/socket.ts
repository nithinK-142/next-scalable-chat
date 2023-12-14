import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "redis-371c5c3-nithin-5f74.a.aivencloud.com",
  port: 17951,
  username: "default",
  password: "AVNS_b-y93THD97E0HV-U4cg",
});

const sub = new Redis({
  host: "redis-371c5c3-nithin-5f74.a.aivencloud.com",
  port: 17951,
  username: "default",
  password: "AVNS_b-y93THD97E0HV-U4cg",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Socket service init...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this._io;
    io.on("connect", (socket) => {
      console.log("New Socket Connected. ", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New message received from redis -> ", message);

        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
