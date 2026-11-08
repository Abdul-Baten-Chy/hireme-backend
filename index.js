import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";
import cors from "cors";

const app = express();
const port = process.env.port || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const client = new MongoClient(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.MONGO_PASS}@cluster0.yjorklr.mongodb.net/`,
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  },
);

export async function connectToMongoDB() {
  try {
    await client.connect();
    const database = client.db("hireme");
    const jobs = database.collection("jobs");
    const company = database.collection("company");

    app.post("/api/jobs", async (req, res) => {
      const job = req.body;

      const result = await jobs.insertOne(job);
      res.send(result);
    });
    app.post("/api/company", async (req, res) => {
      const newCompany = req.body;

      const result = await company.insertOne(newCompany);
      res.send(result);
    });
    app.get("/api/jobs", async (req, res) => {
      const query = {};
      if (req.query.companyId) {
        query.companyID = req.query.companyID;
      }
      if (req.query.status) {
        query.status = req.query.status;
      }
      const cursor = jobs.find(query);

      const result = await cursor.toArray();
      res.send(result);
    });

    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
