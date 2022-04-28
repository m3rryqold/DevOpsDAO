import { useAddress, useMetamask, useEditionDrop } from "@thirdweb-dev/react";
import { useState,useEffect } from "react";

const App = () => {
  // Use thirdweb hooks
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👌 Address:", address);

  const editionDrop = useEditionDrop("0xF65fe7Dc6702C3915707F54E770D49308C510EF0");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if(!address){
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if(balance.gt(0)){
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😥 this user doesn't have a membership NFT.")
        }
      } catch(error){
        console.error("Failed to get balance", error);
      }
    };
    checkBalance();
  },[address,editionDrop]);

  const mintNFT = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0",1);
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch(error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false)
    }
  }

  //ask user to connect wallet if not connected
  if(!address){
    return (
      <div className="landing">
        <h1>👋Welcome to DevOps<span className="tint">DAO</span></h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect Wallet
        </button>
      </div>
    );
  }
  // Already claimed NFT, display dashboard
  if(hasClaimedNFT){
    return (
      <div className="member-page">
        <h1>💻 DevOps DAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    )
  }
  // Wallet connected, Mint NFT
  return (
    <div className="mint-nft">
      <h1>👋Mint your free DevOps DAO💻 Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={mintNFT}
        >
          {isClaiming ? "Minting..." : "Mint your FREE NFT"}
        </button>
    </div>
  );
};
export default App;
