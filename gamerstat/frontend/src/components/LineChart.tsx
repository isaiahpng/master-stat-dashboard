import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "A", pv: 2400 },
  { name: "B", pv: 1398 },
  { name: "C", pv: 9800 },
  { name: "D", pv: 3908 },
  { name: "E", pv: 4800 },
  { name: "F", pv: 3800 },
  { name: "G", pv: 4300 },
];

export default function Example() {
  return (
    <div style={{ width: "100%", height: 120 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#F36715"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#F36715",
              stroke: "#FFFFFF",
              strokeWidth: 1,
            }}
            activeDot={{
              r: 6,
              fill: "#D8FE2B",
              stroke: "#FFFFFF",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}