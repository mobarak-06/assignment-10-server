const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyqxkty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("Arts&craftItemDB");
    const craftCollection = database.collection("craftItem");

    const database2 = client.db("ceramicsAndPottery");
    const potteryCollection = database2.collection("potteryItem");

    app.get("/allCraftItems", async (req, res) => {
      const query = craftCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/allCraftItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    app.get("/myCraftItems/:email", async (req, res) => {
      const email = { email: req.params.email };
      const result = await craftCollection.find(email).toArray();
      res.send(result);
    });

    app.post("/addCraftItem", async (req, res) => {
      const users = req.body;
      const result = await craftCollection.insertOne(users);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const user = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUser = {
        $set: {
          itemName: user.itemName,
          subcategoryName: user.subcategoryName,
          shortDescription: user.shortDescription,
          price: user.price,
          rating: user.rating,
          processingTime: user.processingTime,
          customization: user.customization,
          stockStatus: user.stockStatus,
          photo: user.photo,
        },
      };
      const result = await craftCollection.updateOne(
        filter,
        updatedUser,
        options
      );
      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    // ceramicsAndPottery database

    app.get("/ceramicsAndPottery", async (req, res) => {
      const query = potteryCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/ceramicsAndPottery/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await potteryCollection.findOne(query);
      res.send(result);
    });

    app.post("/ceramicsAndPottery", async (req, res) => {
      const ceramicsAndPotteryItem = req.body;
      console.log(ceramicsAndPotteryItem);
      const result = await potteryCollection.insertOne(ceramicsAndPotteryItem);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//

app.get("/", (req, res) => {
  res.send("Hello From Backend Of Assignment 10");
});

app.listen(port, () => {
  console.log(`assignment 10 is running on port ${port} `);
});
