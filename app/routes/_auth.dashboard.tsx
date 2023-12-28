import { Link, useOutletContext } from "react-router-dom";
import type { IOutletProps } from "~/types";

export default function Dashboard() {
  const context = useOutletContext<IOutletProps>();

  return (
    <div>
      <h1>Welcome to the Auth Dashboard!</h1>
      <pre>{context.session?.user.email}</pre>
      <p>User:</p>
      <Link to="/logout">Logout</Link>
    </div>
  );
}
