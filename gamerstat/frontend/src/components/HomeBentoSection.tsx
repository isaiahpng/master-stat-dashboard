import { useState } from "react"
import { Typewriter } from "react-simple-typewriter"
import SegmentedPressureBar from "./SegmentedPressureBar"
import "./HomeBentoSection.css"
import type { GameStatSummary } from "../types/gamestat"

type HomeBentoSectionProps = {
    summary: GameStatSummary | null
    playerInput: string
    setPlayerInput: (value: string) => void
    onSearch: (playerName: string) => void
}

function getGameStatColor(score: number) {
    const min = 0
    const max = 100

    const t = Math.max(min, Math.min(score, max)) / max

    const start = { r: 222, g: 40, b: 17 }
    const end = { r: 216, g: 254, b: 43 }

    const r = Math.round(start.r + (end.r - start.r) * t)
    const g = Math.round(start.g + (end.g - start.g) * t)
    const b = Math.round(start.b + (end.b - start.b) * t)

    return `rgb(${r}, ${g}, ${b})`
}

function formatScore(score: number) {
    return Number.isInteger(score) ? score.toString() : score.toFixed(1)
}

export default function HomeBentoSection({
    summary,
    playerInput,
    setPlayerInput,
    onSearch,
}: HomeBentoSectionProps) {
    const [isEditingPlayer, setIsEditingPlayer] = useState(false)

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!playerInput.trim()) {
            return
        }

        onSearch(playerInput)
        setIsEditingPlayer(false)
    }

    const gameStatScore = summary?.gamestat_score ?? 0

    const pressureRating = summary?.pressure_rating_5 ?? 0

    const reliabilityScore = summary?.reliability_score ?? 0
    const reliabilityLabel = summary?.reliability_label ?? "Loading"

    const strongestArea = summary?.performance_snapshot.strongest_area
    const weakestArea = summary?.performance_snapshot.weakest_area

    return (
        <section id="overview" className="relative z-10 pt-2 pb-40">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="welcome-title">Welcome back,</h2>

                <div className="text-center">
                    <div className="username-box" onClick={() => setIsEditingPlayer(true)}>
                        {isEditingPlayer ? (
                            <form onSubmit={handleSubmit} className="username-form">
                                <input
                                    value={playerInput}
                                    onChange={(event) => setPlayerInput(event.target.value)}
                                    onBlur={() => {
                                        if (!playerInput.trim()) {
                                            setIsEditingPlayer(false)
                                        }
                                    }}
                                    placeholder="ChakaKhan#11335"
                                    className="username-input"
                                    autoFocus
                                />
                            </form>
                        ) : (
                            <button
                                type="button"
                                className="username-box-button"
                                onClick={() => setIsEditingPlayer(true)}
                            >
                                <Typewriter
                                    words={[playerInput || "Guest"]}
                                    loop={1}
                                    cursor
                                    cursorStyle="|"
                                    typeSpeed={90}
                                />
                            </button>
                        )}
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
                                        {formatScore(gameStatScore)
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
                                                        color: getGameStatColor(gameStatScore),
                                                    }}
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                    </p>

                                    <p className="z-score-title">Your GameStat</p>

                                    <p className="z-score-info">
                                        {summary
                                            ? "Overall player performance score"
                                            : "Loading stat information"}
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

                            <div className="relative px-8 pt-8 pb-8 sm:px-10 sm:pt-10 sm:pb-8">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Pressure Rating
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Estimates performance under pressure using win rate, KDA, and survivability.
                                </p>

                                <SegmentedPressureBar value={pressureRating} />
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[1.35rem] outline outline-white/15" />
                    </div>

                    {/* Bottom middle card */}
                    <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative px-8 pt-8 pb-8 sm:px-10 sm:pt-10 sm:pb-8">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Reliability Score
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Measures dependable performance based on win rate, KDA, and sample size.
                                </p>

                                <div className="mt-4 text-center">
                                    <p className="text-5xl font-semibold tracking-tight text-white">
                                        {reliabilityScore}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        {reliabilityLabel}
                                    </p>
                                </div>

                                <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">

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
                                    Performance Snapshot
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Compares current strengths across pressure, flexibility, role confidence, and hero confidence.
                                </p>

                                <div className="mt-8 space-y-5">
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                        <p className="text-sm text-gray-400">
                                            Strongest Area
                                        </p>

                                        <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                                            {strongestArea?.label ?? "Loading"}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-400">
                                            {strongestArea?.score ?? 0} / 100
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                        <p className="text-sm text-gray-400">
                                            Weakest Area
                                        </p>

                                        <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                                            {weakestArea?.label ?? "Loading"}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-400">
                                            {weakestArea?.score ?? 0} / 100
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[2rem] outline outline-white/15" />
                    </div>
                </div>
            </div>
        </section>
    )
}