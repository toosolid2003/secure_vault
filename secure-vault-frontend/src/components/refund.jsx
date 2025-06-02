import { useState } from "react";



function RefundForm({contract})    {
    const [txstatus, settxStatus] = useState("");
    
    

    const handleSubmit = async (e) => {
        e.preventDefault(); // Preventing page reload on submit
        if(!contract)   {
            alert("Contract not connected");
            settxStatus("Contract not connected");
            return;
        }

        try{
            settxStatus("Claiming refund...");
            const tx = await contract.refund();
            await tx.wait();
            settxStatus("Refund successful!");
        }
        catch (err) {
            console.log(err)
            if (err.reason) {
                settxStatus(`Sorry: ${err.reason}`);    // Displaying the error message sent by the contract
            }
            
        }
    };

    return (
        
        <form onSubmit={handleSubmit}>
            <button type="submit">Ask refund</button>
            <p>{txstatus}</p>
        </form>
    )
};

export default RefundForm;
