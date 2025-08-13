// frontend/src/utils/ipfs.js
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
export async function uploadFileToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload-file`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return `ipfs://${data.ipfsHash}`;
}

export async function uploadJSONToIPFS(jsonData) {
  const res = await fetch(`${API_BASE}/upload-json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonData),
  });

  const data = await res.json();
  return `ipfs://${data.ipfsHash}`;
}
