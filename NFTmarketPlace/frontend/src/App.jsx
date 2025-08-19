
import './App.css'

import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Explore from './pages/Explore'
import MyNFTs from './pages/MyNFTs'
import ListNFT from './pages/ListNFT'
import NFTDetails from './pages/NFTDetails'
import Profile from './pages/Profile';
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
          <Route path='/profile' element={<Profile/>}></Route>
        </Routes>
      </div>
   
    </BrowserRouter>
  )
}

export default App
