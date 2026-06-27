import { Typewriter } from "react-simple-typewriter";
import ReactSpeedometer from "react-d3-speedometer";

function getZScoreColor(score: number) {
    const min = 0;
    const max = 5;

    const t = Math.max(min, Math.min(score, max)) / max;

    const start = { r: 222, g: 40, b: 17 };
    const end = { r: 216, g: 254, b: 43 };

    const r = Math.round(start.r + (end.r - start.r) * t);
    const g = Math.round(start.g + (end.g - start.g) * t);
    const b = Math.round(start.b + (end.b - start.b) * t);

    return `rgb(${r}, ${g}, ${b})`;
}

const zScore = 0;

export default function BentoSection() {
    return (
        <div className="relative z-10 pt-2 pb-24">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="welcome-title">
                    Welcome back,
                </h2>

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
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-lg border border-white/15 bg-[rgba(63,63,63,0.72)] backdrop-blur-[18px] max-lg:rounded-t-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                            <div className="flex h-full items-center justify-center">
                                <div className="z-score-container">

                                    <p className="z-score">
                                        {String(Number.isInteger(zScore) ? zScore : zScore.toFixed(1))
                                            .split("")
                                            .map((char, index) => (
                                                <span
                                                    key={index}
                                                    className={char === "." ? "z-score-dot" : "z-score-digit"}
                                                    style={{ color: getZScoreColor(zScore) }}
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                    </p>

                                    <p className="z-score-title">
                                        Your GameStat
                                    </p>

                                    <p className="z-score-info">
                                        Sign in to view your stat information
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 lg:rounded-l-4xl dark:outline-white/15" />
                    </div>
                    <div className="relative max-lg:row-start-1">
                        <div className="absolute inset-px rounded-lg border border-white/15 bg-[rgba(63,63,63,0.72)] backdrop-blur-[18px] max-lg:rounded-t-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                    Performance
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.
                                </p>
                            </div>
                            <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                                    className="w-full max-lg:max-w-xs dark:hidden"
                                />
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-performance.png"
                                    className="w-full not-dark:hidden max-lg:max-w-xs"
                                />
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-t-4xl dark:outline-white/15" />
                    </div>
                    <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                        <div className="absolute inset-px rounded-lg border border-white/15 bg-[rgba(63,63,63,0.72)] backdrop-blur-[18px]" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                    Security
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                    Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.
                                </p>
                            </div>
                            <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                                    className="h-[min(152px,40cqw)] object-cover dark:hidden"
                                />
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-security.png"
                                    className="h-[min(152px,40cqw)] object-cover not-dark:hidden"
                                />
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 dark:outline-white/15" />
                    </div>
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-lg border border-white/15 bg-[rgba(63,63,63,0.72)] backdrop-blur-[18px] max-lg:rounded-b-4xl lg:rounded-r-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                    Powerful APIs
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                    Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales gravida.
                                </p>
                            </div>
                            <div className="relative min-h-120 w-full grow">
                                <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl outline outline-white/10 dark:bg-gray-900/60 dark:shadow-none">
                                    <div className="flex bg-gray-900 outline outline-white/5">
                                        <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                                            <div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-white">
                                                NotificationSetting.jsx
                                            </div>
                                            <div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
                                        </div>
                                    </div>
                                    <div className="px-6 pt-6 pb-14">{/* Your code example */}</div>
                                </div>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-b-4xl lg:rounded-r-4xl dark:outline-white/15" />
                    </div>
                </div>
            </div>
        </div>
    );
}
