import axios from "axios";
import Cors from "cors";

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

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const PINATA_JWT = process.env.PINATA_JWT;
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

    res.status(200).json({ ipfsHash: response.data.IpfsHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
