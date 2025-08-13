import express from "express";
import serverless from "serverless-http";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Enable JSON parsing
app.use(express.json());

const PINATA_JWT = process.env.PINATA_JWT;

app.post(async (req, res) => {
  try {
    const jsonData = req.body;

    if (!jsonData || Object.keys(jsonData).length === 0) {
      return res.status(400).json({ error: "No JSON data provided" });
    }

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      jsonData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    res.json({ ipfsHash: response.data.IpfsHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
export const handler = serverless(app);
