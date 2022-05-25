import sdk from "./1-initialize-sdk.js";

// get our deployed token, address is from contract deployed in 5
const token = sdk.getToken("0x0e12650bb3BC8e6ce4Bd672E8A2D3310ee1F0784");

(async () => {
    try {
        // amount of token to supply
        const amount = 700_000;
        await token.mint(amount);
        const totalSupply = await token.totalSupply();

        console.log("✅ 🥵 There now is ", totalSupply.displayValue, "$CICD in circulation");
    } catch (error) {
        console.error("Failed to print money", error);
    }
})();