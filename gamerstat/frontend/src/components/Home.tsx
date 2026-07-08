import { useEffect, useState } from "react"
import DotBg from "./DotBg"
import HomeBentoSection from "./HomeBentoSection"
import DashboardBentoSection from "./DashboardBentoSection"
import type { GameStatSummary } from "../types/gamestat"
import "./Home.css"

function Home() {
    const [summary, setSummary] = useState<GameStatSummary | null>(null)
    const [playerInput, setPlayerInput] = useState("")

    useEffect(() => {
        fetch("/data/ChakaKhan-11335_gamestat_summary.json")
            .then((response) => response.json())
            .then((data) => setSummary(data))
            .catch((error) => {
                console.error("Failed to load GameStat summary:", error)
            })
    }, [])

    function normalizePlayerId(playerName: string) {
        return playerName.trim().replace("#", "-")
    }

    function handlePlayerSearch(playerName: string) {
        const playerId = normalizePlayerId(playerName)

        console.log("Searching player:", playerId)

        // Later this will become the real API call:
        // fetch(`/api/gamestat?playerId=${playerId}`)
    }

    return (
        <main className="home">
            <DotBg />

            <div className="home-overlay" />

            <div className="home-content">
                <HomeBentoSection
                    summary={summary}
                    playerInput={playerInput}
                    setPlayerInput={setPlayerInput}
                    onSearch={handlePlayerSearch}
                />

                <DashboardBentoSection summary={summary} />
            </div>
        </main>
    )
}

export default Home