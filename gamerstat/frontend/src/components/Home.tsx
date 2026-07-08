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

    async function handlePlayerSearch(playerName: string) {
        const playerId = normalizePlayerId(playerName)

        if (!playerId) {
            return
        }

        console.log("Searching player:", playerId)

        try {
            const response = await fetch(
                `/.netlify/functions/gamestat?playerId=${encodeURIComponent(playerId)}`
            )

            console.log("Function response status:", response.status)

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Function returned an error:", errorData)
                return
            }

            const data = await response.json()

            console.log("GameStat summary returned:", data)

            setSummary(data)
        } catch (error) {
            console.error("Failed to search player:", error)
        }
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