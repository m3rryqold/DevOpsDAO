import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// governance contract
const vote = sdk.getVote("0x1d716267C01A80e1e5c02e36A42a8e9542615149")

// erc-20 contract
const token = sdk.getToken("0x0e12650bb3BC8e6ce4Bd672E8A2D3310ee1F0784");

(async () => {
    try {
        // create proposal to mint 400k+ new token to the treasury.
        const amount = 470_000
        const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
        const executions = [
            {
                // token contract executes the mint
                toAddress: token.getAddress(),
                // eth is native token but we are sending 0eth in this proposal
                nativeTokenValue: 0,
                // use ethers.js to convert the amount we are minting to wei (the correct format)
                transactionData: token.encoder.encode(
                    "mintTo", [
                    vote.getAddress(),
                    ethers.utils.parseUnits(amount.toString(), 18),
                ]
                ),
            },
        ];

        await vote.propose(description, executions);

        console.log("✅ Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1);
    }

    try {
        // create proposal to transfer 7k to myself for turning up.
        const amount = 7_000
        const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
            process.env.WALLET_ADDRESS + " for turning up?";
        const executions = [
            {
                toAddress: token.getAddress(),
                nativeTokenValue: 0,
                // transferring from treasury to our wallet
                transactionData: token.encoder.encode(
                    "transfer", [
                    process.env.WALLET_ADDRESS,
                    ethers.utils.parseUnits(amount.toString(), 18),
                ]
                ),
            },
        ];
        await vote.propose(description, executions);

        console.log(
            "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
        );
    } catch (error) {
        console.error("failed to create second proposal", error);
    }
})();