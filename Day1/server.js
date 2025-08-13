import express from "express";
import fileUpload from "express-fileupload";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Enable CORS for frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

// Setup file upload with temp files
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));

const PINATA_JWT = process.env.PINATA_JWT;

// 1️⃣ Upload file to Pinata
app.post("/upload-file", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.tempFilePath), file.name);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          ...formData.getHeaders(),
        },
      }
    );

    res.json({ ipfsHash: response.data.IpfsHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ Upload JSON metadata to Pinata
app.post("/upload-json", async (req, res) => {
  try {
    const jsonData = req.body;

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
