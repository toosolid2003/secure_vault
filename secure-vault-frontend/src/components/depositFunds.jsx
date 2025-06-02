import { ethers } from "ethers";
import { useState } from "react";

function DepositFundsForm({contract}) {
    const [amount, setAmount] = useState("");
    const [txstatus, settxStatus] = useState("");

    // Define handler function to change amount 
    const handleChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = async (e)  =>  {
        e.preventDefault();
        if(!contract)   {
            alert("Contract not connected");
        }

        try    {
            settxStatus("Sending transaction...");
            const tx = await contract.deposit( {value: ethers.parseEther(amount) });
            await tx.wait();
            settxStatus("Your deposit has been successful!");
        }
        catch (err) {
            console.log(err);
            if(err.reason)  {
                settxStatus(`We ran into a little issue: ${err.reason}.\nMake sure you deposit less than 2 ETH.`);
            }
            else{
                settxStatus("Transaction incomplete.");
            }
            

        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="enter amount of ETH to deposit in the vault"
            value={amount}
            onChange={handleChange}
            />

            <button type="submit">
                Deposit
            </button>

            <p>{txstatus}</p>
        </form>
    );

}

export default DepositFundsForm;