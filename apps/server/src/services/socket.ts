import { Server } from "socket.io";
import Redis from "ioredis";
import { config } from "dotenv";
import { produceMessage } from "./kafka";

config();

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "17951"),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};

const pub = new Redis(redisOptions);
const sub = new Redis(redisOptions);

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
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("New message received from redis -> ", message);
        io.emit("message", message);

        await produceMessage(message);
        console.log("Message produced to kafka broker.");
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
