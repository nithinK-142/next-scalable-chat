import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

config();

const kafa = new Kafka({
  brokers: [`${process.env.KAFKA_URL}`],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem")), "utf-8"],
  },
  sasl: {
    username: `${process.env.KAFKA_USERNAME}`,
    password: `${process.env.KAFKA_PASSWORD}`,
    mechanism: "plain",
  },
});

let producer: null | Producer = null;

async function createProducer() {
  if (producer) return producer;
  const _producer = kafa.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}

export default kafa;
