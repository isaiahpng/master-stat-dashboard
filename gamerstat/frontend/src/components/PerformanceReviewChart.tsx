import "./PerformanceReviewChart.css"

import { useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

type Range = "week" | "month" | "year"

const chartData = {
    week: [
        { label: "M1", score: 3.2 },
        { label: "M2", score: 3.0 },
        { label: "M3", score: 4.4 },
        { label: "M4", score: 3.5 },
        { label: "M5", score: 3.7 },
        { label: "M6", score: 3.4 },
        { label: "M7", score: 3.9 },
    ],
    month: [
        { label: "W1", score: 3.1 },
        { label: "W2", score: 3.4 },
        { label: "W3", score: 3.8 },
        { label: "W4", score: 4.0 },
    ],
    year: [
        { label: "Jan", score: 2.8 },
        { label: "Feb", score: 3.0 },
        { label: "Mar", score: 3.4 },
        { label: "Apr", score: 3.2 },
        { label: "May", score: 3.7 },
        { label: "Jun", score: 4.0 },
        { label: "Jul", score: 3.9 },
        { label: "Aug", score: 4.2 },
        { label: "Sep", score: 4.1 },
        { label: "Oct", score: 4.3 },
        { label: "Nov", score: 4.4 },
        { label: "Dec", score: 4.5 },
    ],
}

export default function PerformanceReviewChart() {
    const [range, setRange] = useState<Range>("week")
    const data = chartData[range]

    return (
        <div className="performance-review">
            <div className="performance-review-top">
                <div>
                    <p className="performance-review-value">+12%</p>
                    <p className="performance-review-label">Overall improvement</p>
                </div>

                <div className="performance-review-tabs">
                    {(["week", "month", "year"] as Range[]).map((item) => (
                        <button
                            key={item}
                            className={`performance-review-tab ${
                                range === item ? "active" : ""
                            }`}
                            onClick={() => setRange(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="performance-review-chart">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                        />

                        <YAxis
                            domain={[0, 5]}
                            hide
                        />

                        <Tooltip
                            contentStyle={{
                                background: "rgba(10,10,10,0.85)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                borderRadius: "12px",
                                color: "white",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#D8FE2B"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#0a0a0a",
                                stroke: "#D8FE2B",
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 6,
                                fill: "#D8FE2B",
                                stroke: "#D8FE2B",
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}