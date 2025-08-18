
import './App.css'

import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Explore from './pages/Explore'
import MyNFTs from './pages/MyNFTs'
import ListNFT from './components/ListNFT'
import NFTDetails from './pages/NFTDetails'
function App() {
 

  return (
    <BrowserRouter>
    <Navbar />
   <div className="container mx-auto p-6">
  
      
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/my-nfts" element={<MyNFTs/>} />
          <Route path="/list" element={<ListNFT />} />
          <Route path='nft/:id' element={<NFTDetails/>}></Route>
        </Routes>
      </div>
   
    </BrowserRouter>
  )
}

export default App
