import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { deleteSet, updateSet } from "../../api/sets";

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
  const [isEditing, setIsEditing] = useState(false);
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

  if (isEditing) {
    return (
      <SetEditForm
        set={set}
        onSave={() => {
          setIsEditing(false);
          syncRoutine();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <li>
      <p>
        {set.name} × {set.count}
      </p>
      {token && (
        <>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={tryDeleteSet}>Delete</button>
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </li>
  );
}

function SetEditForm({ set, onSave, onCancel }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const trySave = async (formData) => {
    setError(null);
    const count = Number(formData.get("count"));
    try {
      await updateSet(token, set.routineId, set.activityId, {
        count,
      });
      onSave();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li>
      <form action={trySave}>
        <label>
          {set.name} ×{" "}
          <input
            type="number"
            name="count"
            defaultValue={set.count}
            min="1"
          />
        </label>
        <button>Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
    </li>
  );
}
