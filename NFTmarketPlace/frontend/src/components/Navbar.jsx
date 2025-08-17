import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-between px-6 py-4 
                 bg-white/80 backdrop-blur-md shadow-lg 
                 rounded-2xl mb-6 sticky top-4 z-50"
    >
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                   text-transparent bg-clip-text hover:opacity-80 transition"
      >
        NFT Marketplace
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
        <Link to="/explore" className="hover:text-blue-600 transition-colors">
          Explore
        </Link>
        <Link to="/my-nfts" className="hover:text-blue-600 transition-colors">
          My NFTs
        </Link>
        <Link to="/list" className="hover:text-blue-600 transition-colors">
          List NFT
        </Link>
        <ConnectButton />
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-md 
                       shadow-lg rounded-xl p-6 flex flex-col gap-4 md:hidden"
          >
            <Link
              to="/explore"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600 transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/my-nfts"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600 transition-colors"
            >
              My NFTs
            </Link>
            <Link
              to="/list"
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-600 transition-colors"
            >
              List NFT
            </Link>
            <div className="mt-2">
              <ConnectButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
