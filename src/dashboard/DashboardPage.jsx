import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import {
  getActivities,
  updateActivity,
  deleteActivity,
} from "../api/activities";
import {
  getRoutines,
  updateRoutine,
  deleteRoutine,
} from "../api/routines";
import ActivityForm from "../activities/ActivityForm";
import RoutineForm from "../routines/RoutineForm";

export default function DashboardPage() {
  const { token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [routines, setRoutines] = useState([]);

  const syncActivities = async () => {
    const data = await getActivities();
    setActivities(data);
  };

  const syncRoutines = async () => {
    const data = await getRoutines();
    setRoutines(data);
  };

  useEffect(() => {
    syncActivities();
    syncRoutines();
  }, []);

  if (!token) {
    return <p>You must be logged in to access the dashboard.</p>;
  }

  return (
    <>
      <h1>Dashboard</h1>

      <section>
        <h2>Activities</h2>
        <ActivityForm syncActivities={syncActivities} />
        <ActivityDashboardList
          activities={activities}
          syncActivities={syncActivities}
        />
      </section>

      <section>
        <h2>Routines</h2>
        <RoutineForm syncRoutines={syncRoutines} />
        <RoutineDashboardList
          routines={routines}
          syncRoutines={syncRoutines}
        />
      </section>
    </>
  );
}

// ─── Activities ───────────────────────────────

function ActivityDashboardList({ activities, syncActivities }) {
  const [editingId, setEditingId] = useState(null);

  if (activities.length === 0) return <p>No activities yet.</p>;

  return (
    <ul>
      {activities.map((activity) =>
        editingId === activity.id ? (
          <ActivityEditForm
            key={activity.id}
            activity={activity}
            onSave={() => {
              setEditingId(null);
              syncActivities();
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <ActivityDashboardItem
            key={activity.id}
            activity={activity}
            onEdit={() => setEditingId(activity.id)}
            syncActivities={syncActivities}
          />
        ),
      )}
    </ul>
  );
}

function ActivityDashboardItem({ activity, onEdit, syncActivities }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const tryDelete = async () => {
    setError(null);
    try {
      await deleteActivity(token, activity.id);
      syncActivities();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li>
      <p>
        <strong>{activity.name}</strong> — {activity.description}
      </p>
      <button onClick={onEdit}>Edit</button>
      <button onClick={tryDelete}>Delete</button>
      {error && <p role="alert">{error}</p>}
    </li>
  );
}

function ActivityEditForm({ activity, onSave, onCancel }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const trySave = async (formData) => {
    setError(null);
    const name = formData.get("name");
    const description = formData.get("description");
    try {
      await updateActivity(token, activity.id, { name, description });
      onSave();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li>
      <form action={trySave}>
        <label>
          Name{" "}
          <input
            type="text"
            name="name"
            defaultValue={activity.name}
          />
        </label>
        <label>
          Description{" "}
          <input
            type="text"
            name="description"
            defaultValue={activity.description}
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

// ─── Routines ─────────────────────────────────

function RoutineDashboardList({ routines, syncRoutines }) {
  const [editingId, setEditingId] = useState(null);

  if (routines.length === 0) return <p>No routines yet.</p>;

  return (
    <ul>
      {routines.map((routine) =>
        editingId === routine.id ? (
          <RoutineEditForm
            key={routine.id}
            routine={routine}
            onSave={() => {
              setEditingId(null);
              syncRoutines();
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <RoutineDashboardItem
            key={routine.id}
            routine={routine}
            onEdit={() => setEditingId(routine.id)}
            syncRoutines={syncRoutines}
          />
        ),
      )}
    </ul>
  );
}

function RoutineDashboardItem({ routine, onEdit, syncRoutines }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const tryDelete = async () => {
    setError(null);
    try {
      await deleteRoutine(token, routine.id);
      syncRoutines();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li>
      <p>
        <strong>{routine.name}</strong> — {routine.goal}
      </p>
      <Link to={"/routines/" + routine.id}>Sets →</Link>
      <button onClick={onEdit}>Edit</button>
      <button onClick={tryDelete}>Delete</button>
      {error && <p role="alert">{error}</p>}
    </li>
  );
}

/**
 * TODO: Implement RoutineEditForm
 *
 * This component renders an edit form for a single routine inside the list.
 * It should match the shape of ActivityEditForm above.
 *
 * Props:
 *   - routine  — the routine object being edited ({ id, name, goal })
 *   - onSave   — call this after a successful save (closes the form + refreshes)
 *   - onCancel — call this if the user cancels (closes the form)
 *
 * Steps:
 *   1. Get token from useAuth()
 *   2. useState for error
 *   3. trySave(formData): get "name" + "goal" from formData, call
 *      updateRoutine(token, routine.id, { name, goal }), then onSave()
 *   4. Return a <li> containing a <form action={trySave}> with:
 *        - a Name input (defaultValue={routine.name})
 *        - a Goal input  (defaultValue={routine.goal})
 *        - Save button + Cancel button (type="button", onClick={onCancel})
 *   5. Show {error && <p role="alert">{error}</p>} below the form
 */
function RoutineEditForm({ routine, onSave, onCancel }) {
  const { token } = useAuth();
  const [error, setError] = useState(null);

  const trySave = async (formData) => {
    setError(null);
    const name = formData.get("name");
    const goal = formData.get("goal");
    try {
      await updateRoutine(token, routine.id, { name, goal });
      onSave();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <li>
      <form action={trySave}>
        <label>
          Name{" "}
          <input
            type="text"
            name="name"
            defaultValue={routine.name}
          />
        </label>
        <label>
          Goal{" "}
          <input
            type="text"
            name="goal"
            defaultValue={routine.goal}
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
