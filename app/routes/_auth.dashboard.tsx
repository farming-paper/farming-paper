import { Link, useOutletContext } from "react-router-dom";
import DefaultLayout from "~/common/components/DefaultLayout";
import type { IOutletProps } from "~/types";

export default function Dashboard() {
  const context = useOutletContext<IOutletProps>();

  return (
    <DefaultLayout>
      <div>
        <h1>Welcome to the Auth Dashboard!</h1>
        <pre>{context.session?.user.email}</pre>
        <p>User:</p>
        <Link to="/logout">Logout</Link>
      </div>
    </DefaultLayout>
  );
}
