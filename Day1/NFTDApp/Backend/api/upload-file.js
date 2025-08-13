import fileUpload from "express-fileupload";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import Cors from "cors";

// Initialize CORS middleware
function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) return reject(result);
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  })
);

export const config = {
  api: {
    bodyParser: false, // for file uploads
  },
};

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse file using express-fileupload
    await new Promise((resolve, reject) => {
      fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" })(
        req,
        res,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    const PINATA_JWT = process.env.PINATA_JWT;

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

    res.status(200).json({ ipfsHash: response.data.IpfsHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
