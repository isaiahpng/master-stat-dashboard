import GaugeComponent from "react-gauge-component";

export default function Gauge() {
    return (
        <GaugeComponent
            value={50}
            type="grafana"
            arc={{
                width: 0.25,
                padding: 0.01,
                subArcs: [],
                effects: { glow: true, glowBlur: 15, glowSpread: 0.5 },
                nbSubArcs: 10,
                colorArray: ["#5BE12C", "#F5CD19", "#EA4228"]
            }}
            pointer={{
                type: "needle",
                color: "#fff",
                length: 0.8,
                width: 6,
                maxFps: 30
            }}
            labels={{
                valueLabel: {
                    style: {
                        fontSize: "26px",
                        fill: "#e0f7fa",
                        fontWeight: "300"
                    }
                },
                tickLabels: { hideMinMax: true }
            }}
        />
    );
}