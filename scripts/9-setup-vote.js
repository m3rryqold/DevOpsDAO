import sdk from "./1-initialize-sdk.js";

// governance contract
const vote = sdk.getVote("0x1d716267C01A80e1e5c02e36A42a8e9542615149")

// erc-20 - $CICD
const token = sdk.getToken("0x0e12650bb3BC8e6ce4Bd672E8A2D3310ee1F0784");

(async () => {
    try {
        // give treasury power to mint additional tokens if needed.
        await token.roles.grant("minter",vote.getAddress());

        console.log(
            "✅ Successfully gave vote contract permissions to act on token contract"
        );
    } catch(error) {
        console.error(
            "failed to grant vote contract permissions on token contract",
            error
        );
        process.exit(1);
    }

    try {
        // fetch wallet's token balance
        const ownedTokenBalance = await token.balanceOf(
            process.env.WALLET_ADDRESS
        );

        // take 90% of my current supply
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) /100*90

        // transfer 90% of our supply to the voting contract.
        await token.transfer(
            vote.getAddress(),
            percent90
        );
        console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
    } catch (err) {
        console.error("failed to transfer tokens to vote contract", err);
    }
})();