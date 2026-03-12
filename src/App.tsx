import { LeaveGrid } from "./grid/LeaveGrid";
import "./styles/chips.css";

export default function App() {
  return (
    <div style={{ padding: 12 }}>
      <h1 style={{ margin: "0 0 8px 0" }}>AG Grid Challenge</h1>
      <p style={{ margin: "0 0 12px 0" }}>
        Edit <b>Revenue</b> or <b>Cost</b> to see <b>Profit</b>, <b>Margin</b>,
        and the <b>Status</b> chip update in real time. Scroll to test
        virtualization (20,000 rows).
      </p>
      <LeaveGrid />
    </div>
  );
}
