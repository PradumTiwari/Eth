// src/pages/ListNFT.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function ListNFT() {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-gray-800"
      >
        List Your NFT
      </motion.h1>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow-lg rounded-2xl p-6 space-y-6"
      >
        {/* Upload */}
        <div>
          <label className="block font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full border border-gray-300 rounded-lg p-2"
          />
          {preview && (
            <motion.img
              src={preview}
              alt="Preview"
              className="mt-4 rounded-xl w-60 h-60 object-cover shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium mb-2">NFT Name</label>
          <input
            type="text"
            placeholder="e.g., Cyber Punk Samurai"
            className="block w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            placeholder="Describe your NFT..."
            rows={4}
            className="block w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-2">Price (ETH)</label>
          <input
            type="number"
            placeholder="0.25"
            className="block w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                     text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          List NFT
        </motion.button>
      </motion.form>
    </div>
  );
}
