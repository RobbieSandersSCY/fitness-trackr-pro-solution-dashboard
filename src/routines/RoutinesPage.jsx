import { useEffect, useState } from "react";
import { getRoutines } from "../api/routines";
import { useAuth } from "../auth/AuthContext";

import RoutineForm from "./RoutineForm";
import RoutineList from "./RoutineList";

export default function RoutinesPage() {
  const { token } = useAuth();

  const [routines, setRoutines] = useState([]);
  const syncRoutines = async () => {
    const data = await getRoutines();
    setRoutines(data);
  };

  useEffect(() => {
    syncRoutines();
  }, []);

  return (
    <>
      <h1>Routines</h1>
      <RoutineList routines={routines} />
      {token && <RoutineForm syncRoutines={syncRoutines} />}
    </>
  );
}
