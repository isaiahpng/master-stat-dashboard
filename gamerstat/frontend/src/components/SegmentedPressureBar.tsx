import "./SegmentedPressureBar.css"

interface SegmentedPressureBarProps {
    value: number
    max?: number
    segments?: number
}

export default function SegmentedPressureBar({
    value,
    max = 5,
    segments = 10,
}: SegmentedPressureBarProps) {
    const clampedValue = Math.max(0, Math.min(value, max))
    const activeSegments = Math.round((clampedValue / max) * segments)

    return (
        <div className="pressure-bar-wrapper">
            <div className="pressure-bar-top">
                <span>Pressure Rating</span>
                <span>{clampedValue.toFixed(1)} / {max}</span>
            </div>

            <div className="pressure-bar">
                {Array.from({ length: segments }).map((_, index) => {
                    const isActive = index < activeSegments

                    return (
                        <div
                            key={index}
                            className={`pressure-segment ${isActive ? "active" : ""}`}
                        />
                    )
                })}
            </div>

            <div className="pressure-bar-labels">
                <span>Low</span>
                <span>High</span>
                <span>Elite</span>
            </div>
        </div>
    )
}