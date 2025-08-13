import fileUpload from "express-fileupload";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Enable JSON parsing
app.use(express.json());

// File upload setup
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));

const PINATA_JWT = process.env.PINATA_JWT;

app.post(async (req, res) => {
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

export default app;
export const handler = serverless(app);
