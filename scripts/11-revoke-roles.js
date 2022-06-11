import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x0e12650bb3BC8e6ce4Bd672E8A2D3310ee1F0784");
 (async () => {
    try {
        // fetch current roles
        const allRoles = await token.roles.getAll();

        console.log("👀 Roles that exist right now:", allRoles);

        // Revoke personal wallet superuser rights over ERC-20 contract
        await token.roles.setAll( { admin: [], minter: []});
        console.log(
            "🎉 Roles after revoking ourselves",
            await token.roles.getAll()
          );
          console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");
    } catch (error) {
        console.error("Failed to revoke ourselves from the DAO trasury", error);
    }
 })();