import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { deleteSet } from "../../api/sets";

export default function SetList({ sets, syncRoutine }) {
  return (
    <>
      <h3>Sets</h3>
      {sets.length > 0 ? (
        <ul className="sets">
          {sets.map((set) => (
            <Set key={set.id} set={set} syncRoutine={syncRoutine} />
          ))}
        </ul>
      ) : (
        <p>This routine doesn't have any sets. Add one?</p>
      )}
    </>
  );
}

function Set({ set, syncRoutine }) {
  const { token } = useAuth();

  const [error, setError] = useState(null);

  const tryDeleteSet = async () => {
    setError(null);

    try {
      await deleteSet(token, set.id);
      syncRoutine();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li>
      <p>
        {set.name} × {set.count}
      </p>
      {token && <button onClick={tryDeleteSet}>Delete</button>}
      {error && <p role="alert">{error}</p>}
    </li>
  );
}
