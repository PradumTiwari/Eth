// src/pages/Explore.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Search } from "lucide-react";

const dummyNFTs = [
  {
    id: 1,
    name: "Cyber Punk #001",
    image: "https://picsum.photos/300/300?random=1",
    price: 0.25,
    creator: "Alice",
    avatar: "https://i.pravatar.cc/40?img=1",
    likes: 128,
  },
  {
    id: 2,
    name: "Abstract Wave",
    image: "https://picsum.photos/300/300?random=2",
    price: 0.18,
    creator: "Bob",
    avatar: "https://i.pravatar.cc/40?img=2",
    likes: 96,
  },
  {
    id: 3,
    name: "Pixel Art Dragon",
    image: "https://picsum.photos/300/300?random=3",
    price: 0.4,
    creator: "Charlie",
    avatar: "https://i.pravatar.cc/40?img=3",
    likes: 210,
  },
  {
    id: 4,
    name: "Glitch City",
    image: "https://picsum.photos/300/300?random=4",
    price: 0.32,
    creator: "Dana",
    avatar: "https://i.pravatar.cc/40?img=4",
    likes: 175,
  },
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");

  // Filter + Sort logic
  const filteredNFTs = dummyNFTs
    .filter((nft) =>
      nft.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "popular") return b.likes - a.likes;
      if (sort === "newest") return b.id - a.id;
      return 0;
    });

  return (
    <div className="px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Explore NFTs</h1>

     
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
       
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search NFTs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 
                       focus:ring-purple-500 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border rounded-xl focus:ring-2 
                     focus:ring-purple-500 outline-none"
        >
          <option value="popular">🔥 Most Popular</option>
          <option value="newest">🆕 Newest</option>
          <option value="low">⬇️ Price: Low to High</option>
          <option value="high">⬆️ Price: High to Low</option>
        </select>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredNFTs.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
          >
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 space-y-3">
             
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">{nft.name}</h2>
                <span className="text-sm font-medium text-purple-600">
                  {nft.price} ETH
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img
                    src={nft.avatar}
                    alt={nft.creator}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-600">{nft.creator}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Heart size={16} className="text-red-500" />
                  {nft.likes}
                </div>
              </div>

            
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white py-2 rounded-xl font-medium hover:opacity-90 transition"
              >
                Buy Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
