import { useState } from "react";
import { createRoutine } from "../api/routines";
import { useAuth } from "../auth/AuthContext";

/** Users can create new activities with a name and description. */
export default function RoutineForm({ syncRoutines }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const tryCreateRoutine = async (formData) => {
    setError(null);

    const name = formData.get("name");
    const goal = formData.get("goal");

    try {
      await createRoutine(token, { name, goal });
      syncRoutines();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h2>Add a new routine</h2>
      <form action={tryCreateRoutine}>
        <label>
          Name
          <input type="text" name="name" />
        </label>
        <label>
          Goal
          <input type="text" name="goal" />
        </label>
        <button>Add routine</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </>
  );
}
