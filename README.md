# 🔐 Secure Bounty Vault

A minimal and secure smart contract to manage bounty campaigns with refundable deposits and deadline-based payout logic — part of my journey to becoming a senior Solidity developer.

## 📌 Summary

This contract enables contributors to fund a bounty pool in ETH. The owner can assign a "hunter" who is eligible to claim the full bounty if they meet a deadline. If no claim is made by the deadline, contributors can refund their deposits. 

The contract is built with key security and design patterns including:
- Reentrancy protection (OpenZeppelin)
- Access control (Ownable)
- Deadline-based state transitions
- Fallback handling and event emissions

## 🚀 Features

- ✅ Public ETH deposits (up to 2 ETH)
- ✅ Owner-assigned hunter role
- ✅ Secure bounty claiming before deadline
- ✅ Refunds enabled after expiration
- ✅ Emits relevant events for all operations
- ✅ Fully audited for basic security threats

## 🔧 Tech Stack

- Solidity ^0.8.28
- OpenZeppelin Contracts (Ownable, ReentrancyGuard)
- Hardhat for testing & deployment
- ETH testnet compatible (e.g., Sepolia or Goerli)

## 🛠️ Functions

| Function | Description |
|---------|-------------|
| `deposit()` | Accepts ETH deposits from anyone, up to 2 ETH |
| `assign_hunter(address)` | Owner-only function to designate a hunter |
| `claim_bounty()` | Hunter-only function to claim entire bounty (before deadline) |
| `refund()` | Allows contributors to reclaim funds after deadline |
| `checkBalance()` | Returns caller’s deposit balance |
| `checkContractBalance()` | Returns full vault balance |
| `checkDeadline()` | Returns bounty expiration timestamp |

## 📂 File Structure

```bash
/contracts
  SecureVault.sol      # Main contract
/test
  secureVault.test.js  # (coming soon)
scripts/
  deploy.js            # Deployment script
README.md              # This file

---

## 🔒 Security Considerations

- ✔️ Reentrancy protected via `nonReentrant`
- ✔️ Funds cannot be claimed twice
- ✔️ ETH transfers happen after state changes
- ✔️ Invalid hunter addresses are rejected
- ❗ Max deposit per user capped (2 ETH)

---

## ✅ Audit Summary

Manual internal audit shows:

- No reentrancy risks
- Proper access control
- Gas usage is acceptable
- Minor recommendation: remove unused `_amount` param in `deposit()`
- Fixed: incorrect event in `claim_bounty()` replaced with `Claimed()`

✅ **Status**: Secure with minor improvements


## 🌍 Coming Soon

- 🌐 Full-stack dApp using Next.js, wagmi, and TailwindCSS
- 🧪 Complete test suite with Foundry or Hardhat
- 🧾 Contract verification and frontend deployment

---

## 📫 Contact

If you're hiring or collaborating on Solidity projects:

- **Email**: thibaut[at]segura.design
- **GitHub**: [@toosolid2003](https://github.com/toosolid2003)  
- **Blog**: [thedesigniconoclast.substack.com](https://thedesigniconoclast.substack.com)

---

> 💡 Feedback welcome! Feel free to open an issue or PR.