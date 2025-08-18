import React from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const myNFTs = [
  {
    id: 101,
    name: "Samurai Warrior",
    image: "https://picsum.photos/300/300?random=11",
    description: "Epic warrior NFT owned by you.",
  },
  {
    id: 102,
    name: "Golden Cat",
    image: "https://picsum.photos/300/300?random=12",
    description: "A rare golden cat NFT.",
  },
  {
    id: 103,
    name: "Space Odyssey",
    image: "https://picsum.photos/300/300?random=13",
    description: "Sci-fi inspired NFT artwork.",
  },
];


const MyNFTs = () => {
  return (
    <div>
    {myNFTs.length===0?(
       <p className="text-gray-500">You don’t own any NFTs yet.</p>
    ):(<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {myNFTs.map((nft,index)=>(
         <Link to={`/nft/${nft.id}`}>
        <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
                 <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-56 object-cover"
              />
                <div className="p-4">
                <h2 className="font-semibold text-lg">{nft.name}</h2>
                <p className="text-gray-500 text-sm">{nft.description}</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 
                             text-white py-2 rounded-xl font-medium hover:opacity-90 transition"
                >
                  List for Sale
                </motion.button>
              </div>
          </motion.div>
          </Link>
      ))}
    </div>)}
    </div>
  )
}

export default MyNFTs