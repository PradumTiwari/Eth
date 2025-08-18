// src/pages/NFTDetails.jsx
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";

const dummyNFTs = [
  {
    id: 1,
    name: "Cyber Punk #001",
    image: "https://picsum.photos/600/600?random=1",
    price: 0.25,
    creator: "Alice",
    avatar: "https://i.pravatar.cc/80?img=1",
    likes: 128,
    description:
      "A unique cyberpunk-inspired NFT artwork showcasing futuristic neon vibes.",
  },
  {
    id: 2,
    name: "Abstract Wave",
    image: "https://picsum.photos/600/600?random=2",
    price: 0.18,
    creator: "Bob",
    avatar: "https://i.pravatar.cc/80?img=2",
    likes: 96,
    description:
      "An abstract generative art piece representing digital fluidity.",
  },
  {
    id: 3,
    name: "Pixel Art Dragon",
    image: "https://picsum.photos/600/600?random=3",
    price: 0.4,
    creator: "Charlie",
    avatar: "https://i.pravatar.cc/80?img=3",
    likes: 210,
    description: "A pixelated dragon NFT breathing digital flames.",
  },
  {
    id: 101,
    name: "Samurai Warrior",
    image: "https://picsum.photos/300/300?random=11",
    creator: "Charlie",
    avatar: "https://i.pravatar.cc/80?img=3",

    description: "Epic warrior NFT owned by you.",
  },
  {
    id: 102,
    name: "Golden Cat",
    image: "https://picsum.photos/300/300?random=12",
    creator: "Charlie",
    avatar: "https://i.pravatar.cc/80?img=3",
    description: "A rare golden cat NFT.",
  },
  {
    id: 103,
    name: "Space Odyssey",
    image: "https://picsum.photos/300/300?random=13",
    description: "Sci-fi inspired NFT artwork.",
  },
];

export default function NFTDetails() {
  const { id } = useParams();
  const nft = dummyNFTs.find((item) => item.id === Number(id));

  if (!nft) return <p className="text-center mt-20">NFT not found</p>;

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
   
      <Link
        to="/explore"
        className="flex items-center text-gray-600 hover:text-purple-600 mb-6"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back to Explore
      </Link>

      <div className="grid md:grid-cols-2 gap-10 items-center">
     
        <motion.img
          src={nft.image}
          alt={nft.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg w-full"
        />

       
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{nft.name}</h1>

          <p className="text-gray-600">{nft.description}</p>

          
          <div className="flex items-center gap-4">
            <img
              src={nft.avatar}
              alt={nft.creator}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-gray-500 text-sm">Creator</p>
              <p className="font-medium">{nft.creator}</p>
            </div>
          </div>

          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600">
              {nft.price} ETH
            </span>
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="text-red-500" /> {nft.likes}
            </div>
          </div>

          {/* Buy Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                       text-white py-3 rounded-xl font-semibold shadow-md"
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </div>
  );
}
