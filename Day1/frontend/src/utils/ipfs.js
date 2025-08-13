import axios from "axios";

// Upload file to IPFS
export async function uploadFileToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:5000/upload-file", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return `ipfs://${data.ipfsHash}`;
}

// Upload JSON metadata to IPFS
export async function uploadJSONToIPFS(jsonData) {
    const res = await fetch("http://localhost:5000/upload-json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });

  const data = await res.json();
  return `ipfs://${data.ipfsHash}`;
}
