import { useState, useEffect } from 'react';

function GetDeadline( {contract} )  {
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        async function fetchDeadline()  {
            const deadline = await contract.checkDeadline();
            setDeadline(deadline.toString());
        }

        fetchDeadline();
    }, [contract]   );
  return (
    <div>
      <h4>Deadline: {deadline || 'Loading...'}</h4>
    </div>
  );
}

export default GetDeadline;