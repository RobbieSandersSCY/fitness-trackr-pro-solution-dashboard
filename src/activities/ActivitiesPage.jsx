import { useEffect, useState } from "react";
import { getActivities } from "../api/activities";
import { useAuth } from "../auth/AuthContext";

import ActivityForm from "./ActivityForm";
import ActivityList from "./ActivityList";

export default function ActivitiesPage() {
  const { token } = useAuth();

  const [activities, setActivities] = useState([]);

  const syncActivities = async () => {
    const data = await getActivities();
    setActivities(data);
  };

  useEffect(() => {
    syncActivities();
  }, []);

  return (
    <>
      <h1>Activities</h1>
      <ActivityList activities={activities} />
      {token && <ActivityForm syncActivities={syncActivities} />}
    </>
  );
}
