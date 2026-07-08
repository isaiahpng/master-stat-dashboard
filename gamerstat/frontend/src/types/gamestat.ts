export type GameStatSummary = {
    gamestat_score: number
    ai_review?: string

    pressure_rating: number
    pressure_rating_5: number

    reliability_score: number
    reliability_label: string

    flex_rating: number
    flex_label: string

    performance_snapshot: {
        scores: {
            key: string
            label: string
            score: number
        }[]
        strongest_area: {
            key?: string
            label: string
            score: number
        }
        weakest_area: {
            key?: string
            label: string
            score: number
        }
    }

    hero_confidence: {
        top_heroes: {
            hero: string
            games_played: number
            winrate: number
            kda: number
            hero_confidence: number
            hero_pool: string
        }[]
    }

    role_confidence: {
        best_role: {
            role: string
            role_confidence: number
            winrate: number
            kda: number
            games_played: number
        } | null
        all_roles: {
            role: string
            role_confidence: number
            winrate: number
            kda: number
            games_played: number
        }[]
    }

    hero_pool: {
        counts: Record<string, number>
        risk_picks: {
            hero: string
            games_played: number
            winrate: number
            kda: number
            hero_confidence: number
        }[]
    }
}