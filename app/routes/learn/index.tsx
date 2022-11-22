import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>문제 풀 선택</h1>
      <Link to="/learn/adsp">응애 </Link>
    </div>
  );
}
