import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0xF65fe7Dc6702C3915707F54E770D49308C510EF0");

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "CI-CD",
                description: "This NFT gives you access to DevOpsDAO pipeline-ish",
                image: readFileSync("scripts/assets/cicd-infinity1.png"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    }catch(error){
        console.error("failed to create new NFT",error);
    }
})();