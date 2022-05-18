const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster1.btxmn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    await client.connect();

    const todoColection = client.db("todo").collection("Alltodo");

    // <<===all Todo===>

    app.get("/todo", async (req, res) => {
      const query = {};
      const cursor = todoColection.find(query);
      const todo = await cursor.toArray();
      res.send(todo);
    });

    app.post("/mytodo", async (req, res) => {
      const myTodo = req.body;
      //   if (!myTodo.name || !myTodo.img) {
      //     return res.send({
      //       succsess: false,
      //       error: "Plase provide all information",
      //     });
      //   }
      const result = await todoColection.insertOne(myTodo);
      res.send(result);
    });

    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoColection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

run().catch(console.dir);
