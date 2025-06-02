import { useState, useEffect  } from 'react';
import { BrowserProvider, Contract } from "ethers";
import './App.css'
import SecureVault from '../../artifacts/contracts/secure_vault.sol/SecureVault.json';
import AssignHunterForm from './components/assignHunter';
import DepositFundsForm from './components/depositFunds';
import ClaimBountyForm from './components/claimBounty';
import RefundForm from './components/refund';
import GetDeadline from './components/getDeadline';

// TODO: include the Rainbowkit connect button

export const abi = SecureVault.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [message, setMessage] = useState(null);
  const [contract, setContract] = useState(null);
  const [hunter, setHunter] = useState(null);

  const connectWallet = async () => {
    try{
    if(!window.ethereum) return alert("Install MetaMask");

    const address = await window.ethereum.request({ method: "eth_requestAccounts"});
    setWalletAddress(address);

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractInstance = new Contract(contractAddress, SecureVault.abi, signer);
    console.log("Contract connected:", contractInstance);
    console.log("Signer:", signer);

    setContract(contractInstance);
    }
    catch (err) {
      console.error("Wallet connection failed:", err);
    }

  }
  const readContract = async () => {
    if (!contract) return alert("Contract not connected");
    const value = await contract.checkBalance();
    setMessage(value.toString());
  }
  useEffect(() => {
    if (contract) {
      readContract();
    }
  }, [contract]);

  return (
    <div>
      <div style={{ padding: "1rem"}}>
        {!walletAddress && (<button onClick={connectWallet}>Connect Wallet</button>)}
        {walletAddress && <p>Wallet connected: {walletAddress}</p>}

        {contract && (
          <>
            <p>Contract balance: {message ?? 'Loading...'}</p>
            <GetDeadline contract={contract} />
            <AssignHunterForm contract={contract} />
            <DepositFundsForm contract={contract} />
            <ClaimBountyForm contract={contract} />
            <RefundForm contract={contract} />
          </>
        )}
      </div>
    </div>

  );
}

export default App;
