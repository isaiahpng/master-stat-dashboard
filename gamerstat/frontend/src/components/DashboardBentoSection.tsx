import "./DashboardBentoSection.css"
import type { GameStatSummary } from "../types/gamestat"

type DashboardBentoSectionProps = {
    summary: GameStatSummary | null
}

function formatLabel(value: string | undefined) {
    if (!value) {
        return "No data"
    }

    return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

function getPoolCount(counts: Record<string, number>, label: string) {
    return counts[label] ?? 0
}

export default function DashboardBentoSection({ summary }: DashboardBentoSectionProps) {
    const topHeroes = summary?.hero_confidence.top_heroes ?? []
    const topHero = topHeroes[0]

    const flexRating = summary?.flex_rating ?? 0
    const flexLabel = summary?.flex_label ?? "Loading"

    const bestRole = summary?.role_confidence.best_role

    const heroPoolCounts = summary?.hero_pool.counts ?? {}

    const provenCount = getPoolCount(heroPoolCounts, "Proven Pick")
    const comfortCount = getPoolCount(heroPoolCounts, "Comfort Pick")
    const riskCount = getPoolCount(heroPoolCounts, "Risk Pick")
    const unprovenCount = getPoolCount(heroPoolCounts, "Unproven")

    const trustedHeroCount = provenCount + comfortCount

    const aiReviewText = summary?.ai_review
        ?? (
            summary
                ? `You profile as a ${flexLabel.toLowerCase()} player with ${formatLabel(bestRole?.role)} as your strongest role. Your top hero is ${formatLabel(topHero?.hero)}, and your biggest improvement area is ${summary.performance_snapshot.weakest_area.label.toLowerCase()}.`
                : "Loading player review..."
        )

    return (
        <section
            id="advanced-stats"
            className="dashboard-bento-section relative z-10 pt-2 pb-24"
        >
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="dashboard-title">Advanced Stats</h2>

                <div className="dashboard-grid mt-3 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
                    {/* Left large card */}
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative px-8 pt-8 pb-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Hero Confidence
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Highlights your most reliable heroes based on win rate, KDA, and games played.
                                </p>

                                <div className="mt-6">
                                    <p className="text-5xl font-semibold tracking-tight text-white max-lg:text-center">
                                        {topHero?.hero_confidence ?? 0}
                                    </p>

                                    <p className="mt-2 text-base text-gray-300 max-lg:text-center">
                                        {formatLabel(topHero?.hero)}
                                    </p>

                                    <div className="mt-5 space-y-3">
                                        {topHeroes.slice(0, 3).map((hero) => (
                                            <div
                                                key={hero.hero}
                                                className="rounded-2xl border border-white/10 bg-white/5 p-3"
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <p className="text-sm font-medium text-white">
                                                        {formatLabel(hero.hero)}
                                                    </p>

                                                    <p className="text-sm text-gray-300">
                                                        {hero.hero_confidence}
                                                    </p>
                                                </div>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {hero.winrate}% WR · {hero.kda} KDA · {hero.hero_pool}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
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

                            <div className="relative flex h-full flex-col px-8 pt-8 pb-7 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Flex Rating
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Measures how many heroes you can perform well on consistently.
                                </p>

                                <div className="mt-6">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-5xl font-semibold tracking-tight text-white">
                                                {flexRating}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-400">
                                                {flexLabel}
                                            </p>
                                        </div>

                                        <p className="pb-2 text-sm text-gray-400">
                                            {trustedHeroCount} trusted heroes
                                        </p>
                                    </div>

                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-[#d8fe2b]"
                                            style={{ width: `${flexRating}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[1.35rem] outline outline-white/15" />
                    </div>

                    {/* Bottom middle card */}
                    <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative flex h-full flex-col px-8 pt-8 pb-7 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Role Confidence
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Compares tank, damage, and support performance to find your strongest role.
                                </p>

                                <div className="mt-6">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-5xl font-semibold tracking-tight text-white">
                                                {bestRole?.role_confidence ?? 0}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-400">
                                                {formatLabel(bestRole?.role)}
                                            </p>
                                        </div>

                                        <p className="pb-2 text-sm text-gray-400">
                                            {bestRole?.winrate ?? 0}% WR
                                        </p>
                                    </div>

                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-[#d8fe2b]"
                                            style={{
                                                width: `${bestRole?.role_confidence ?? 0}%`,
                                            }}
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-gray-500">
                                        {bestRole?.kda ?? 0} KDA · {bestRole?.games_played ?? 0} games
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[1.35rem] outline outline-white/15" />
                    </div>

                    {/* Top right card */}
                    <div className="relative max-lg:row-start-4 lg:col-start-3 lg:row-start-1">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative px-8 pt-8 pb-7 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    AI Review
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Gives a natural-language summary of your strongest patterns and weak spots.
                                </p>

                                <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-5 text-gray-300">
                                    {aiReviewText}
                                </p>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[1.35rem] outline outline-white/15" />
                    </div>

                    {/* Bottom right card */}
                    <div className="relative max-lg:row-start-5 lg:col-start-3 lg:row-start-2">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative px-8 pt-8 pb-7 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Hero Pool
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Shows how your played heroes are grouped by confidence level.
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                        <p className="text-lg font-semibold text-white">
                                            {provenCount}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            Proven Pick
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                        <p className="text-lg font-semibold text-white">
                                            {comfortCount}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            Comfort Pick
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                        <p className="text-lg font-semibold text-white">
                                            {riskCount}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            Risk Pick
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                        <p className="text-lg font-semibold text-white">
                                            {unprovenCount}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            Unproven
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[1.35rem] outline outline-white/15" />
                    </div>
                </div>
            </div>
        </section>
    )
}