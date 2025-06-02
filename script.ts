import { ethers } from "ethers";

// Send 100 ETH from 1st local node account to Metamask

// Set up constants
const LOCAL_PRIVATE = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const LOCAL_PUBLIC = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const META = "0x385e82012850EF05222EC2392E3aD806E9F04C26";

// Setting up provider and account
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = new ethers.Wallet(LOCAL_PRIVATE, provider);

// Sending fake ETH to Metamask
async function main()   {
    const tx = await signer.sendTransaction({
        to: META,
        value: ethers.parseEther("100"),

    });
    console.log("Transaction hash: ", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed");
}

main().catch(console.error);


