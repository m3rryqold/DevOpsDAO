import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0xF65fe7Dc6702C3915707F54E770D49308C510EF0");

( async () => {
    try {
        const claimConditions = [{
            startTime: new Date(),
            maxQuantity: 50_000,
            price: 0,
            quantityLimitPerTransaction: 1,
            waitInSeconds: MaxUint256,
        }];
        await editionDrop.claimConditions.set("0",claimConditions);
        console.log("✅ Successfully set claim conditions!");
    }catch(error){
        console.error("failed to set claim condition ",error);
    }
})();