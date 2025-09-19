import { Link } from "react-router";

/** Shows a list of routines. */
export default function RoutineList({ routines }) {
  return (
    <ul>
      {routines.map((routine) => (
        <RoutineListItem key={routine.id} routine={routine} />
      ))}
    </ul>
  );
}

/** Shows a single routine. Logged-in users will also see a delete button. */
function RoutineListItem({ routine }) {
  return (
    <li>
      <p>
        <Link to={"/routines/" + routine.id}>{routine.name}</Link>
      </p>
    </li>
  );
}
