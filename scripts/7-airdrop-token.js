import sdk from "./1-initialize-sdk.js";

// ERC-1155 membership NFT contract
const editionDrop = sdk.getEditionDrop("0xF65fe7Dc6702C3915707F54E770D49308C510EF0");

// ERC-20 token contract
const token = sdk.getToken("0x0e12650bb3BC8e6ce4Bd672E8A2D3310ee1F0784");

(async () => {
    try {
        // fetch addresses of people owning membership NFT with tokenId 0
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddresses.length === 0){
            console.log(
                "No NFTs claimed yet."
            );
            process.exit(0);
        }

        // loop through addresses
        const airdropTargets = walletAddresses.map((address) => {
            // pick a random number between 1000 and 10000
            const randomAmount = Math.floor(Math.random() *(10000 - 1000 + 1) + 1000);
            console.log("✅ Airdropping ",randomAmount," tokens to ",address);

            // set up the target
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTarget
        });

        // Call transferBatch on all our airdrop targets.
        console.log("🌈 Starting airdrop...");
        await token.transferBatch(airdropTargets);
        console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
    } catch (err) {
        console.error("Failed to airdrop tokens", err);
    }
})();