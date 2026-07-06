import "./DashboardBentoSection.css"

export default function DashboardBentoSection() {
    return (
        <section
            id="dashboard"
            className="dashboard-bento-section relative z-10 pt-2 pb-24"
        >
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="dashboard-title">Dashboard</h2>

                <div className="dashboard-grid mt-6 grid gap-4 sm:mt-8 lg:grid-cols-3 lg:grid-rows-2">
                    {/* Left large card */}
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Hero Confidence
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Highlights your most reliable heroes based on win rate, KDA, and games played.
                                </p>
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
                                    Flex Rating
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Measures how many heroes you can perform well on consistently.
                                </p>
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
                                    Role Confidence
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Compares tank, damage, and support performance to find your strongest role.
                                </p>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[1.35rem] outline outline-white/15" />
                    </div>

                    {/* Top right card */}
                    <div className="relative max-lg:row-start-4 lg:col-start-3 lg:row-start-1">
                        <div className="absolute inset-px rounded-[2rem] border border-white/1 bg-[rgba(63, 63, 63, 0.25)] backdrop-blur-[18px] backdrop-saturate-150" />

                        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem]">
                            <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.05)_35%,rgba(255,255,255,0.00)_100%)]" />

                            <div className="relative px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    AI Review
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Gives a natural-language summary of your strongest patterns and weak spots.
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

                            <div className="relative px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center">
                                    Hero Pool
                                </p>

                                <p className="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center">
                                    Shows which heroes are proven picks, comfort picks, and low-confidence picks.
                                </p>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-px rounded-[1.35rem] outline outline-white/15" />
                    </div>
                </div>
            </div>
        </section>
    )
}