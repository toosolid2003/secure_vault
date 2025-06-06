import { useState } from "react";
import './cards.css';



function ClaimBountyForm({contract})    {
    const [txstatus, settxStatus] = useState("");
    
    

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!contract)   {
            alert("Contract not connected");
            settxStatus("Contract not connected");
        }

        try{
            settxStatus("Claiming bounty...");
            const tx = await contract.claim_bounty();
            await tx.wait();
            settxStatus("Transaction sent");
        }
        catch (err) {
            console.log(err)
            if(err.reason)  {
                settxStatus(`We ran into an issue: ${err.reason}`);
            }
            else {
                settxStatus("Error: check the browser console for details");
            }

        }
    };

    return (
        <div className="card">
            <h2>Claim your bounty!</h2>
            <p>Congrats, you have been rewarded with the bounty. Claim it here!</p>
            <form onSubmit={handleSubmit} className="secure-form">
            </form>

                <button type="submit">Claim</button>
        </div>

    )
};

export default ClaimBountyForm;
