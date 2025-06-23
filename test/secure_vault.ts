import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { secureVaultSol } from "../typechain-types/contracts";

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

it("should only allow the owner to assign the hunter", async function() {
  const { secure_vault, otherAccount, hunter } = await loadFixture(deployVault);

  await expect(secure_vault.connect(otherAccount).assign_hunter(hunter)).to.be.reverted;
})

it("should allow a user to claim a refund after the deadline", async function() {
  const { secure_vault, otherAccount } = await loadFixture(deployVault);
  const deadline = await secure_vault.checkDeadline();
  const balance = ethers.provider.getBalance(otherAccount);
  
  // Deposit some eth to become a contributor
  const depo = await ethers.parseEther("1.0");
  await secure_vault.connect(otherAccount).deposit({value: depo});
  
  // Increase time to reach the deadline
  await time.increaseTo(deadline);

  // Test the refund function
  await expect(secure_vault.connect(otherAccount).refund()).to.changeEtherBalance(otherAccount, ethers.parseEther("1.0"));
})


it("should return 0 when the deadline has expired", async function() {
  const { secure_vault, otherAccount } = await loadFixture(deployVault);
  const deadline = await secure_vault.checkDeadline();
  
  // Increase time to reach the deadline
  await time.increaseTo(deadline + 1n);

  // the checkDeadline function should return 0
  const tx = await secure_vault.connect(otherAccount).checkDeadline();
  const newDeadline = await secure_vault.checkDeadline();

  expect(newDeadline).to.equal(0);
  })


it("should not allow a user to claim a refund before the deadline", async function()  {
  const { secure_vault, otherAccount } = await loadFixture(deployVault);
  const deadline = await secure_vault.checkDeadline();
  const balance = ethers.provider.getBalance(otherAccount);
  const beforeDead = deadline - 1n;
  
  // Deposit some eth to become a contributor
  const depo = await ethers.parseEther("1.0");
  await secure_vault.connect(otherAccount).deposit({value: depo});
  
  // Increase time to reach the deadline
  await time.increaseTo(beforeDead);

  await expect(secure_vault.connect(otherAccount).refund()).to.be.revertedWith("Deadline has not expired");
})


it("should not allow contriburtors to deposit more than 2 eth", async function()  {
  const { secure_vault, otherAccount } = await loadFixture(deployVault);
  
  const depo = await ethers.parseEther("2.1");

  await expect(secure_vault.deposit({value: depo})).to.be.revertedWith("Deposit value too high");
})

it("should emit a claimed event", async function(){
  const { secure_vault, owner, hunter, lockedAmount } = await loadFixture(deployVault);

  // Assign the hunter
  await secure_vault.connect(owner).assign_hunter(hunter);

  // Claim the bounty
  const tx = await secure_vault.connect(hunter).claim_bounty();
  const receipt = await tx.wait();
  expect(receipt).to.emit(secure_vault, "Claimed").withArgs(hunter.address, ethers.provider.getBalance(secure_vault));

})
it("should emit a Deposit event", async function()  {
  const {secure_vault, otherAccount} = await loadFixture(deployVault);

  const depo = ethers.parseEther("1.0");
  const tx = await secure_vault.connect(otherAccount).deposit({value: depo});
  const receipt = await tx.wait();
  expect(receipt).to.emit(secure_vault, "Deposit").withArgs(otherAccount.address, depo);
})
})