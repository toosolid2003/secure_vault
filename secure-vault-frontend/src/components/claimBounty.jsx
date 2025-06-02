import { useState } from "react";



function ClaimBountyForm({contract})    {
    const [txstatus, settxStatus] = useState("");
    
    

    const handleSubmit = async(e) => {
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
            settxStatus("Error: check the browser console for details");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">Claim</button>
        </form>
    )
};

export default ClaimBountyForm;
