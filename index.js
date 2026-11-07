import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
cors = require("cors");
const app = express();
const port = process.env.port || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const client = new MongoClient(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.MONGO_PASS}@cluster0.yjorklr.mongodb.net/`,
);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
