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
      <p>Deadline: {deadline || 'Loading...'}</p>
    </div>
  );
}

export default GetDeadline;