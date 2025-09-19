import { useState, useEffect } from "react";
import { getActivity } from "../api/activities";
import { useParams } from "react-router";

export default function ActivityDetails() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const syncActivity = async () => {
      const data = await getActivity(id);
      setActivity(data);
    };
    syncActivity();
  }, [id]);

  if (!activity) return <p>Loading...</p>;

  return (
    <article>
      <h1>{activity.name}</h1>
      <p>by {activity.creatorName}</p>
      <p>{activity.description}</p>
    </article>
  );
}
