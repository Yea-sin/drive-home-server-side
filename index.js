const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.quagy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("drive_home");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");

    // GET PRODUCTS API
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();

      res.send(products);
    });

    // GET REVIEWS API
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();

      res.send(reviews);
    });

    // GET SINGLE PRODUCTS API
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await productsCollection.findOne(query);
      res.json(products);
    });

    // POST PRODUCTS API
    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);

      res.json(result);
    });
    // POST REVIEWS API
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await reviewsCollection.insertOne(reviews);

      res.json(result);
    });

    // GET ORDERS API
    app.get("/orders", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();

      res.send(orders);
    });

    // POST ORDERS API
    app.post("/orders", async (req, res) => {
      const order = req.body;

      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    // DELETE PRODUCTS API
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await productsCollection.deleteOne(query);
      res.json(products);
    });

    // DELETE ORDERS API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const orders = await ordersCollection.deleteOne(query);
      res.json(orders);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Drive-Home Server Test");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
