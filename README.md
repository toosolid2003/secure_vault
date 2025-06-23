# 🔐 Secure Bounty Vault

A minimal and secure smart contract to manage bounty campaigns with refundable deposits and deadline-based payout logic — 
built with composability in mind.

## Demo
**Loom Demo**(https://www.loom.com/share/c358a16d411b468ea7b156a7752aabf8?sid=b7b82c55-38b4-41a2-9c3c-a357d9fde222)

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
  secure_vault.ts  # Test suite
scripts/
  deploy.js            # Deployment script
README.md              # This file

```
---

## 🔒 Security Considerations

- ✔️ Reentrancy protected via `nonReentrant`
- ✔️ Funds cannot be claimed twice
- ✔️ ETH transfers happen after state changes (check-effects-interaction pattern)
- ✔️ Invalid hunter addresses are rejected
- ❗ Max deposit per user capped (2 ETH)

---

## ✅ Audit Summary

Manual internal audit shows:

- No reentrancy risks
- Proper access control
- Gas usage is acceptable

✅ **Status**: Secure 


---

## 📫 Contact

If you're hiring or collaborating on Solidity projects:

- **Email**: thibaut[at]segura.design
- **GitHub**: [@toosolid2003](https://github.com/toosolid2003)  
- **Blog**: [designiconoclast.substack.com](https://designiconoclast.substack.com)

---

> 💡 Feedback welcome! Feel free to open an issue or PR.