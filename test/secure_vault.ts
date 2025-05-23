import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("SecureVault", function()  {
  
  // Create test fixture for further reuse
  async function deployVault()  {
    // Generate random address
    const [owner, hunter, otherAccount] = await hre.ethers.getSigners();

    // Amount locked in the contract
    const lockedAmount = ethers.parseEther("1.0");

    // Deploy the contract
    const secure_vault = await hre.ethers.deployContract("SecureVault",[owner], {
      value: lockedAmount,
    });

    return { secure_vault, owner, hunter, otherAccount, lockedAmount};
  }

  // Test 1: only hunter is allowed to withdraw
  it("should not allow anyone but the hunter to withdraw", async function()  {
    
    const { secure_vault, otherAccount, owner, hunter } = await loadFixture(deployVault);

    await secure_vault.connect(owner).assign_hunter(hunter);
    
    await expect(
      secure_vault.connect(otherAccount).claim_bounty()).to.be.revertedWith("Only the hunter can claim the bounty");
  })

  //  Test 2: hunter can withdraw
 it("should allow the hunter to claim the bounty", async function () {
  const { secure_vault, owner, hunter, lockedAmount } = await loadFixture(deployVault);

  // Assign the hunter
  await secure_vault.connect(owner).assign_hunter(hunter);

  // Record balances before
  const balanceBefore = await hre.ethers.provider.getBalance(hunter);

  // Claim the bounty
  const tx = await secure_vault.connect(hunter).claim_bounty();
  const receipt = await tx.wait();

  // Calculate gas cost
  const gasUsed = receipt.gasUsed;
  const effectiveGasPrice = receipt.gasPrice ?? receipt.effectiveGasPrice;
  const gasCost = gasUsed * effectiveGasPrice;

  // Balance after
  const balanceAfter = await hre.ethers.provider.getBalance(hunter);

  // Check that bounty was received (minus gas)
  expect(balanceAfter).to.equal(balanceBefore + lockedAmount - gasCost);

  // Contract balance should be zero
  const contractBalance = await hre.ethers.provider.getBalance(secure_vault.target);
  expect(contractBalance).to.equal(0n);

  // Hunter address should be reset
  const storedHunter = await secure_vault.hunter();
  expect(storedHunter).to.equal(hre.ethers.ZeroAddress);
});
})



// // Test 2: only owner is allowed to assign hunter
//   it("should allow anyone to deposit funds", async function() {
//     const { secure_vault, otherAccount } = await loadFixture(deployVault);

//     const depositAm = ethers.parseEther("1.0");
//     // const tx = await secure_vault.connect(otherAccount).deposit;
//     // await tx.wait();

//     const balance = await secure_vault.checkBalance();
//     expect(balance).to.equal(ethers.parseEther("2.0"));
//   })

  

// // Test 3: bounty can only be claimed before the deadline
//   it("should return the balance of the contract", async function()  {
//     const { secure_vault } = await loadFixture(deployVault);
//     const balance = await secure_vault.checkBalance();
//     expect(balance).to.equal(ethers.parseEther("1.0"));
//   })

// // Test 4: Refunds can only be done after the deadline
//   it("should allow the owner to withdraw the funds", async function () {
//     const { secure_vault, owner } = await loadFixture(deployVault);
    
//     // const tx = await secure_vault.connect(owner).withdraw();
//     // const receipt = tx.wait();

//     const contractBalance = await secure_vault.checkBalance();
//     expect(contractBalance).to.equal(0);
//   })

// // Test 5: it should allow multiple users to deposit funds
// it("should allow multiple users to deposit funds", async function() {
//   const [ user1, user2, user3 ] = await hre.ethers.getSigners();
//   const  { secure_vault } = await loadFixture(deployVault);

//   // const deposit1 = await secure_vault.connect(user1).deposit({ value: ethers.parseEther("0.5")});
//   // const deposit2 = await secure_vault.connect(user2).deposit({ value: ethers.parseEther("0.5")});
//   // const deposit3 = await secure_vault.connect(user3).deposit({ value: ethers.parseEther("0.5")});

//   const contractBalance = await secure_vault.checkBalance();
//   expect(contractBalance).to.equal(ethers.parseEther("2.5"));
// })
// 