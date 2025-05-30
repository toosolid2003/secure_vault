import { useState } from 'react';

function AssignHunterForm( {contract}) {
    const [hunter, setHunter] = useState("");
    const [txStatus, settxStatus] = useState("");

    const handleChange = (e) => {
        setHunter(e.target.value);
    };

    const handleSubmit = async (e)  => {
        e.preventDefault();
        if(!contract)   {
            alert("Contract not connected");
            return;
        }

        try {
            settxStatus("Sending transaction...");
            const tx = await contract.assign_hunter(hunter);
            await tx.wait();
            settxStatus("Hunter assigned successfully");
            setHunter("");
        }
        catch   (err)   {
            console.log(err);
            settxStatus("Transaction failed");
        }
    };

    return  (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "1em auto" }}>
            <label htmlFor="hunter">Hunter Address:</label><br />
            <input
                type="text"
                id="hunter"
                value={hunter}
                onChange={handleChange}
                placeholder='0x......'
                style={{ width: "100%", padding: "0.5em", marginTop: "0.5em" }}
                />
                <br/><br/>
                <button type="submit">Assign Hunter</button>
                <p>{txStatus}</p>
        </form>
    );
}

export default AssignHunterForm;