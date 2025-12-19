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
