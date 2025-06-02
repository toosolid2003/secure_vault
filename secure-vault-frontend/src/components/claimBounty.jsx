import { useState } from "react";



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
        <form onSubmit={handleSubmit}>
            <button type="submit">Claim</button>
            <p>{txstatus}</p>
        </form>
    )
};

export default ClaimBountyForm;
