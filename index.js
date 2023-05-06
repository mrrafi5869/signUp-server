require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require("fs");
const port = process.env.PORT || 5000;

const app = express();
// middlware
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

const uri = `mongodb+srv://UserData:JqY94Yy6mIqTF3Pb@cluster0.9t60goe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const usersCollection = client.db("user").collection("usersInfo");

    app.get("/user", async (req, res) => {
      const data = {};
      const option = await usersCollection.find(data).toArray();
      res.send(option);
    });
    app.post("/user", upload.single("file"), async (req, res) => {
      const file = req.file;
      const data = req.body;
      const option = await usersCollection.insertOne({file, data});
      console.log(file, data);
      res.send(option);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("signUp server running");
});

app.listen(port, () => console.log(`signUp server ${port}`));
