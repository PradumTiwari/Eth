import React, { useState, useEffect } from "react"
import { useWatchContractEvent, useReadContract } from "wagmi"

import marketplacea from "../abi/NFTMarketplace.json"
import Contract from "../contracts/contract-addresses.json"

const marketplaceAddress = Contract.Marketplace
const marketplaceAbi = marketplacea.abi

function useMarketplaceEvents(setListings) {
  // Listen to ItemListed
  useWatchContractEvent({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    eventName: "ItemListed",
    listener(logs) {
      logs.forEach((log) => {
        const { nftAddress, tokenId, seller, price } = log.args
        setListings((prev) => [
          ...prev,
          { nftAddress, tokenId, seller, price },
        ])
      })
    },
  })

  // Listen to ItemSold
  useWatchContractEvent({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    eventName: "ItemSold",
    listener(logs) {
      logs.forEach((log) => {
        const { nftAddress, tokenId } = log.args
        setListings((prev) =>
          prev.filter(
            (item) =>
              !(
                item.nftAddress === nftAddress &&
                item.tokenId.toString() === tokenId.toString()
              )
          )
        )
      })
    },
  })

  // Listen to ItemCancelled
  useWatchContractEvent({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    eventName: "ItemCancelled",
    listener(logs) {
      logs.forEach((log) => {
        const { nftAddress, tokenId } = log.args
        setListings((prev) =>
          prev.filter(
            (item) =>
              !(
                item.nftAddress === nftAddress &&
                item.tokenId.toString() === tokenId.toString()
              )
          )
        )
      })
    },
  })
}

const Home = () => {
  const [listings, setListings] = useState([])

  useEffect(() => {
    async function fetchListings() {
      try {
        // Better way: call your getAllListing()
    const { data: listings, isLoading } = useReadContract({
  address: marketplaceAddress,
  abi: marketplaceAbi,
  functionName: 'getAllListing',
})

        // Filter out empty/unlisted
        const filtered = items.filter((item) => item.price > 0n)
        setListings(filtered)
      } catch (err) {
        console.error("Error fetching listings:", err)
      }
    }

    fetchListings()
  }, [])

  // Subscribe to events
  useMarketplaceEvents(setListings)

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-3 gap-4">
        {listings.length === 0 ? (
          <p>No NFTs listed yet</p>
        ) : (
          listings.map((item, idx) => (
            <div key={idx} className="border p-4 rounded-xl shadow">
              <p>
                <strong>NFT:</strong> {item.nftAddress}
              </p>
              <p>
                <strong>Token ID:</strong> {item.tokenId.toString()}
              </p>
              <p>
                <strong>Seller:</strong> {item.seller}
              </p>
              <p>
                <strong>Price:</strong> {Number(item.price) / 1e18} ETH
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Home
