require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const appVersion = "v22.03.24.02";
console.log(appVersion);
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Intial Route
app.get("/", (req, res) => {
  res.send(`Welcome to Node App ${appVersion}`);
});

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dataBase = client.db("employee-management");
const usersCollection = dataBase.collection("employees");

app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: `Internal Server Error: ${error.message}`,
    });
  }
});

const getUsers = async () => {
  try {
    const result = await usersCollection.find().toArray();
    const data = result.map((e) => {
      const { password, ...rest } = e;
      return rest;
    });
    return data;
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
};

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
