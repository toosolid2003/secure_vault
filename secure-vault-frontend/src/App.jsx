import { useState  } from 'react';
import { BrowserProvider, Contract } from "ethers";
import './App.css'
import SecureVault from '../../artifacts/contracts/secure_vault.sol/SecureVault.json';
import AssignHunterForm from './components/assignHunter';


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

  const assignHunter = async () => {
    if (!contract) return alert("Contract not connected");
    const value = await contract.checkBalance();
    setMessage(value.toString());
  }

  return (
    <div>
      <div style={{ padding: "2rem" }}>
        <h1>SecureVault Frontend</h1>
        <button onClick={connectWallet}>
          {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
        </button>

        <div style={{ marginTop: "1rem" }}>
          <button onClick={readContract}>Read From Contract</button>
          <p>Response: {message}</p>
        </div>
        {contract && <AssignHunterForm contract={contract} />}
        </div>
    </div>

  );
}

export default App;
