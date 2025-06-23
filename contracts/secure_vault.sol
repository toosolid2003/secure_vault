// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


// ------------------------------------------------------------------------------------------  //


contract SecureVault is Ownable, ReentrancyGuard {
    
    // Define events
    event Deposit(address indexed contributor, uint amount);
    event Refund(address indexed contributor, uint amount);
    event Claimed(address indexed hunter, uint amount);

    // Define variables
    address public hunter;
    mapping(address => uint256) private balances;
    uint public deadline;

    // Constructor
    constructor(address initialOwner) Ownable(initialOwner) payable {
        deadline = block.timestamp + 90 days; // Set a deadline of 90 days from deployment
    }
    
    // Anyone can deposit ETH for the bounty
    function deposit() external payable {
        require(msg.value > 0, "Must contain ethers");
        require(msg.value <= 2 ether, "Deposit value too high");
        require(block.timestamp < deadline, "Deposit not allowed after the deadline");

        balances[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value);
    }
    // Anyone can check their balance
    function checkBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    // Anyone can check the contract balance
    function checkContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    // Anyone can check the deadline
    function checkDeadline() public view returns (uint256) {
        uint256 d = deadline;
        if(deadline < block.timestamp)  {
            d = 0; // We return 0 if the deadline is expired
        }
        return d;
    }

    // Only owner can assign a hunter
    function assign_hunter(address _hunter) onlyOwner public {
        require(_hunter != address(0), "Invalid hunter address");
        hunter = _hunter;
    }

    // The bounty must be claimed before a deadline by the hunter
    function claim_bounty() external nonReentrant {
        require(msg.sender == hunter, "Only the hunter can claim the bounty");
        require(block.timestamp < deadline, "Deadline has expired");

        uint256 contractBalance = address(this).balance;
        (bool success,) = payable(hunter).call{value: contractBalance}("");
        require(success, "Bounty claimed failed");

        emit Claimed(hunter, contractBalance);

        // Reset the hunter address to prevent double claiming
        hunter = address(0);
    }
    // After the deadline, contributors can request a refund
    function refund() public  {
        require(balances[msg.sender] > 0, "No money to refund");
        require(block.timestamp > deadline, "Deadline has not expired");

        uint256 amountToRefund = balances[msg.sender];
        require(amountToRefund > 0,"Nothing to refund");

        balances[msg.sender] = 0;

        (bool success,) = payable(msg.sender).call{value: amountToRefund}("");
        require(success, "Refund failed");

        emit Refund(msg.sender, amountToRefund);
    }
     receive() external payable {}
     fallback() external payable {}
}
