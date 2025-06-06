import { useState, useEffect  } from 'react';
import { BrowserProvider, Contract } from "ethers";
import './App.css'
import SecureVault from '../../artifacts/contracts/secure_vault.sol/SecureVault.json';
import AssignHunterForm from './components/assignHunter';
import DepositFundsForm from './components/depositFunds';
import ClaimBountyForm from './components/claimBounty';
import RefundForm from './components/refund';
import GetDeadline from './components/getDeadline';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig,RainbowKitProvider} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {mainnet,  sepolia} from 'wagmi/chains';
import {QueryClientProvider,  QueryClient} from "@tanstack/react-query";
import { ConnectButton } from '@rainbow-me/rainbowkit';


// Rainbowkit button

const rainbowConfig = getDefaultConfig({
  appName: 'Secure Vault',
  projectId: 'f99798e321897c5c286878a8180fc3a8',
  chains: [mainnet, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

const queryclient = new QueryClient();


export const abi = SecureVault.abi;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [message, setMessage] = useState(null);
  const [contract, setContract] = useState(null);
  const [hunter, setHunter] = useState(null);
  const [owner, setOwner] = useState(null);

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

      // Fetching owner and hunter addresses
      const ownerAddress = await contractInstance.owner();
      setOwner(ownerAddress);
   
      try{
        const hunterAddress = await contractInstance.hunter();
        setHunter(hunterAddress);
      } catch(e)  {
        setHunter(null);
      }
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

  // Helper functions
  const isOwner = walletAddress && owner && walletAddress.toLowerCase() === owner;
  const isHunter = walletAddress && hunter && walletAddress.toLowerCase() === hunter;

  // Card rendering logic
  const renderCards = () => {
    if (isOwner)  {
      return(
        <>
          <DepositFundsForm contract={contract} />
          <AssignHunterForm contract={contract} />
          <RefundForm contract={contract} />
        </>
      );
    } else if (isHunter)  {
      return(
      <>
          <DepositFundsForm contract={contract} />
          <ClaimBountyForm contract={contract} />
      </>
      );
    } else{
      return(
        <>
          <DepositFundsForm contract={contract} />
          <RefundForm contract={contract} />        
        </>

      );
    }
  };

  return (
    <WagmiProvider config={rainbowConfig}>
        <QueryClientProvider client={queryclient}>
          <RainbowKitProvider>
          <div className="top-menu">
            <ConnectButton>Connect wallet</ConnectButton>
          </div>
          <div className="title-box">
             <h4>The challenge</h4>
            <h1>Cross-Site Scripting (XSS) Vulnerability in User Profile Page</h1>
            <GetDeadline />
          </div>

      <div className="main">

          <div className="right-box">
              <div className="description">
                  <p>Cross-Site Scripting (XSS) vulnerability has been identified in the user profile page of the application. When a user updates their profile information, specifically the "About Me" section, it does not properly sanitize input/ 
                  This allows an attacker to inject malicious JavaScript code that executes when other users view the profile.
                     <strong><br/>Expected Result:</strong><br/>
                      The application should sanitize the input and display the text without executing any scripts.<br/>

                      <strong>Result:</strong><br/>
                      The injected script executes, displaying an alert box with the message "XSS Vulnerability!" when the profile is viewed.

                       <strong>Impact:</strong><br/>
                      This vulnerability can lead to session hijacking, data theft, or other malicious actions against users of the application. It poses a significant security risk, especially if sensitive information is accessible through the user profiles.<br/>

                      <strong>Recommendation:</strong><br/>
                      Implement proper input validation and output encoding to prevent XSS attacks. Use libraries such as DOMPurify to sanitize user inputs before rendering them on the page.
                  </p>
              </div>
              <div className="card-box">
                  {renderCards()}
              </div>
          </div>

      </div>
          </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
