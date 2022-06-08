import { useAddress, useMetamask, useEditionDrop, useToken, useVote } from "@thirdweb-dev/react";
import { useState, useEffect, useMemo } from "react";

const App = () => {
  // Use thirdweb hooks
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👌 Address:", address);

  const editionDrop = useEditionDrop("0xF65fe7Dc6702C3915707F54E770D49308C510EF0");
  const token = useToken("0x0e12650bb3BC8e6ce4Bd672E8A2D3310ee1F0784")
const vote = useVote("0x1d716267C01A80e1e5c02e36A42a8e9542615149")

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // holds amount of token each member has in state
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // holds member addresses
  const [memberAddresses, setMemberAddresses] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);


  // display short version of wallet address
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
   // fetch existing proposals from the contract
   useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
  // call vote.getAll() to fetch proposals
  const getAllProposals = async () => {
    try {
      const proposals = await vote.getAll();
      setProposals(proposals);
      console.log("🌈 Proposals:", proposals);
    } catch (error) {
      console.log("failed to get proposals", error);
    }
  };
  getAllProposals();
}, [hasClaimedNFT, vote])

// check if the user already voted
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  // until proposals above are retrieved in previous useEffect before user can vote
if (!proposals.length) {
  return;
}

const checkIfUserHasVoted = async () => {
  try {
    const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
    setHasVoted(hasVoted);
    if (hasVoted) {
      console.log("🥵 User has already voted");
    } else {
      console.log("🙂 User has not voted yet");
    }
  } catch (error) {
    console.error("Failed to check if wallet has voted", error);
  }
};
checkIfUserHasVoted();
}, [hasClaimedNFT,proposals,address,vote]);

  // fetch all addresses of members holding NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    // fetch users holding NFT with tokenId 0
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  // fetch the # of tokens each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getallBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (error) {
        console.error("failed to get member balances", error);
      }
    };
    getallBalances();
  }, [hasClaimedNFT, token.history]);

  // combine memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      // check if address is found in memberTokenAmounts array, or return 0.
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);


  useEffect(() => {
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😥 this user doesn't have a membership NFT.")
        }
      } catch (error) {
        console.error("Failed to get balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNFT = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false)
    }
  }

  //ask user to connect wallet if not connected
  if (!address) {
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
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>💻 DevOps DAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
