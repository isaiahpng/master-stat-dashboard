import { useState } from "react"
import DotBg from "./DotBg"
import HomeBentoSection from "./HomeBentoSection"
import DashboardBentoSection from "./DashboardBentoSection"
import type { GameStatSummary } from "../types/gamestat"
import "./Home.css"

const blankSummary: GameStatSummary = {
    gamestat_score: 0,
    ai_review: "Search a public Overwatch BattleTag to generate a player review.",

    pressure_rating: 0,
    pressure_rating_5: 0,

    reliability_score: 0,
    reliability_label: "Waiting for search",

    flex_rating: 0,
    flex_label: "Waiting for search",

    performance_snapshot: {
        scores: [],
        strongest_area: {
            label: "Waiting for search",
            score: 0,
        },
        weakest_area: {
            label: "Waiting for search",
            score: 0,
        },
    },

    hero_confidence: {
        top_heroes: [],
    },

    role_confidence: {
        best_role: null,
        all_roles: [],
    },

    hero_pool: {
        counts: {
            "Unproven Pick": 0,
            "Risk Pick": 0,
            "Comfort Pick": 0,
            "Proven Pick": 0,
        },
        risk_picks: [],
    },
}

function Home() {
    const [summary, setSummary] = useState<GameStatSummary>(blankSummary)
    const [playerInput, setPlayerInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    function normalizePlayerId(playerName: string) {
        return playerName.trim().replace("#", "-")
    }

    async function handlePlayerSearch(playerName: string) {
        const playerId = normalizePlayerId(playerName)

        if (!playerId) {
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(
                `/.netlify/functions/gamestat?playerId=${encodeURIComponent(playerId)}`
            )

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Function returned an error:", errorData)
                return
            }

            const data = await response.json()
            setSummary(data)
        } catch (error) {
            console.error("Failed to search player:", error)
        } finally {
            setIsLoading(false)
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
                    isLoading={isLoading}
                />

                <DashboardBentoSection summary={summary} />
            </div>
        </main>
    )
}

export default Home