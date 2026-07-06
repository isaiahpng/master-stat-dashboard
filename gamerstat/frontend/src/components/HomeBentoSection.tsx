import { Typewriter } from "react-simple-typewriter"
import Example from "./LineChart"
import SegmentedPressureBar from "./SegmentedPressureBar"
import PerformanceReviewChart from "./PerformanceReviewChart"
import "./HomeBentoSection.css"

function getZScoreColor(score: number) {
    const min = 0
    const max = 5

    const t = Math.max(min, Math.min(score, max)) / max

    const start = { r: 222, g: 40, b: 17 }
    const end = { r: 216, g: 254, b: 43 }

    const r = Math.round(start.r + (end.r - start.r) * t)
    const g = Math.round(start.g + (end.g - start.g) * t)
    const b = Math.round(start.b + (end.b - start.b) * t)

    return `rgb(${r}, ${g}, ${b})`
}

const zScore = 0

export default function HomeBentoSection() {
    return (
        <div className="relative z-10 pt-2 pb-24">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="welcome-title">Welcome back,</h2>

                <div className="text-center">
                    <div className="username-box">
                        <Typewriter
                            words={["Guest"]}
                            loop={1}
                            cursor
                            cursorStyle="|"
                            typeSpeed={90}
                        />
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-3 lg:grid-rows-2">
                    {/* Left large card */}
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative flex h-full items-center justify-center">
                                <div className="z-score-container">
                                    <p className="z-score">
                                        {String(
                                            Number.isInteger(zScore)
                                                ? zScore
                                                : zScore.toFixed(1)
                                        )
                                            .split("")
                                            .map((char, index) => (
                                                <span
                                                    key={index}
                                                    className={
                                                        char === "."
                                                            ? "z-score-dot"
                                                            : "z-score-digit"
                                                    }
                                                    style={{
                                                        color: getZScoreColor(zScore),
                                                    }}
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                    </p>

                                    <p className="z-score-title">Your GameStat</p>

                                    <p className="z-score-info">
                                        Sign in to view your stat information
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[2rem] outline outline-white/15" />
                    </div>

                    {/* Top middle card */}
                    <div className="relative max-lg:row-start-1">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Clutch Index
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Measures performance in high-pressure moments.
                                </p>

                                <SegmentedPressureBar value={1.2} />
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[1.35rem] outline outline-white/15" />
                    </div>

                    {/* Bottom middle card */}
                    <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Consistency Score
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Measures how reliably you perform from match to match.
                                </p>

                                <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                                    <Example />
                                </div>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[1.35rem] outline outline-white/15" />
                    </div>

                    {/* Right large card */}
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Performance Review
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Tracks recent performance changes across your latest matches.
                                </p>
                                <PerformanceReviewChart />
                            </div>




                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[2rem] outline outline-white/15" />
                    </div>
                </div>
            </div>
        </div>
    )
}