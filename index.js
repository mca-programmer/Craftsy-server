require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Test route
app.get("/", (req, res) => {
  res.send("Craftsy API is running!");
});

// Helper to create slugs
const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

async function run() {
  try {
    // Connect to MongoDB
    // await client.connect();

    const db = client.db("Craftsy");
    const productsCol = db.collection("products");
    const ordersCol = db.collection("orders");
    const usersCol = db.collection("users");

    // === POST users in DB ===
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = newUser.email;
      const query = { email: email };

      const existingUser = await usersCol.findOne(query);
      if (existingUser) {
        res.send({ message: "User exists!" });
      } else {
        const result = await usersCol.insertOne(newUser);
        res.send(result);
      }
    });

    // === GET all products (public) ===
    app.get("/products", async (req, res) => {
      const result = await productsCol.find().sort({ createdAt: -1 }).toArray();
      res.send(result);
    });

    // === Ping MongoDB ===
    console.log("Connected to MongoDB! (crafty DB)");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`Crafty server running on http://localhost:${port}`);
});
