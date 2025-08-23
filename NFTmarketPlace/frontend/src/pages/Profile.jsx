import React from "react";
import { useAccount } from "wagmi";
import MintButton from "../components/MintButton";

const Profile = () => {
  const { address, isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        {isConnected ? (
          <>
            <p className="text-gray-700 mb-6">
              Connected wallet: <br />
              <span className="font-mono text-sm text-purple-600">
                {address}
              </span>
            </p>

            {/* Mint Button */}
            <MintButton />

            {/* NFT Gallery (stubbed for now) */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Your NFTs</h2>
              <p className="text-gray-500">No NFTs loaded yet...</p>
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Please connect your wallet to view your profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
