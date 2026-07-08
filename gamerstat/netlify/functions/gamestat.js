function safeNumber(value, defaultValue = 0) {
    const number = Number(value)

    if (Number.isNaN(number)) {
        return defaultValue
    }

    return number
}

function clamp(value, minValue = 0, maxValue = 1) {
    return Math.max(minValue, Math.min(value, maxValue))
}

function adjustedWinrate(
    winrate,
    gamesPlayed,
    baseline = 50,
    reliableSample = 50
) {
    const sampleWeight = clamp(gamesPlayed / reliableSample)

    return baseline + (winrate - baseline) * sampleWeight
}

function getAverageStat(data, statName, fallback = 0) {
    if (data.average && data.average[statName] !== undefined) {
        return safeNumber(data.average[statName], fallback)
    }

    const flatKey = `average_${statName}`

    if (data[flatKey] !== undefined) {
        return safeNumber(data[flatKey], fallback)
    }

    return fallback
}

function calculateHeroConfidence(hero) {
    const gamesPlayed = safeNumber(hero.games_played)
    const winrate = safeNumber(hero.winrate)
    const kda = safeNumber(hero.kda)

    const adjustedWr = adjustedWinrate(winrate, gamesPlayed, 50, 50)

    const winrateScore = clamp((adjustedWr - 40) / 30)
    const kdaScore = clamp(kda / 6)
    const sampleScore = clamp(gamesPlayed / 150)

    const confidence =
        winrateScore * 0.45 +
        kdaScore * 0.35 +
        sampleScore * 0.20

    return Math.round(clamp(confidence) * 100)
}

function assignHeroPool(hero) {
    const gamesPlayed = safeNumber(hero.games_played)
    const heroConfidence = safeNumber(hero.hero_confidence)

    if (gamesPlayed < 10) {
        return "Unproven"
    }

    if (heroConfidence >= 75) {
        return "Proven Pick"
    }

    if (heroConfidence >= 55) {
        return "Comfort Pick"
    }

    return "Risk Pick"
}

function calculateFlexRating(scoredHeroes) {
    const viableHeroes = scoredHeroes.filter((hero) => {
        return hero.games_played >= 10 && hero.hero_confidence >= 55
    })

    return Math.round(clamp(viableHeroes.length / 8) * 100)
}

function assignFlexLabel(flexRating) {
    if (flexRating >= 80) {
        return "Highly Flexible"
    }

    if (flexRating >= 55) {
        return "Flexible"
    }

    if (flexRating >= 30) {
        return "Specialist"
    }

    return "One-Trick Leaning"
}

function calculateRoleConfidence(role) {
    const gamesPlayed = safeNumber(role.games_played)
    const winrate = safeNumber(role.winrate)
    const kda = safeNumber(role.kda)

    const adjustedWr = adjustedWinrate(winrate, gamesPlayed, 50, 100)

    const winrateScore = clamp((adjustedWr - 40) / 25)
    const kdaScore = clamp(kda / 5)
    const sampleScore = clamp(gamesPlayed / 300)

    const confidence =
        winrateScore * 0.50 +
        kdaScore * 0.30 +
        sampleScore * 0.20

    return Math.round(clamp(confidence) * 100)
}

function calculatePressureRating(general) {
    const winrate = safeNumber(general.winrate)
    const kda = safeNumber(general.kda)

    const deathsPerGame = getAverageStat(general, "deaths", kda)

    const winrateScore = clamp((winrate - 45) / 20)
    const kdaScore = clamp(kda / 5)
    const survivalScore = clamp((10 - deathsPerGame) / 10)

    const score =
        winrateScore * 0.40 +
        kdaScore * 0.35 +
        survivalScore * 0.25

    return Math.round(clamp(score) * 100)
}

function calculateReliabilityScore(general) {
    const gamesPlayed = safeNumber(general.games_played)
    const winrate = safeNumber(general.winrate)
    const kda = safeNumber(general.kda)

    const adjustedWr = adjustedWinrate(winrate, gamesPlayed, 50, 500)

    const winrateScore = clamp((adjustedWr - 40) / 25)
    const kdaScore = clamp(kda / 5)
    const sampleScore = clamp(gamesPlayed / 1000)

    const score =
        winrateScore * 0.45 +
        kdaScore * 0.35 +
        sampleScore * 0.20

    return Math.round(clamp(score) * 100)
}

function assignReliabilityLabel(score) {
    if (score >= 75) {
        return "Highly Reliable"
    }

    if (score >= 55) {
        return "Reliable"
    }

    if (score >= 35) {
        return "Developing"
    }

    return "Unstable"
}

function calculateGameStatScore(
    general,
    scoredHeroes,
    scoredRoles,
    pressureRating,
    flexRating
) {
    const winrate = safeNumber(general.winrate)
    const kda = safeNumber(general.kda)

    const winrateScore = clamp((winrate - 40) / 25)
    const kdaScore = clamp(kda / 5)

    const trustedHeroes = scoredHeroes.filter((hero) => hero.games_played >= 10)
    const heroSource = trustedHeroes.length > 0 ? trustedHeroes : scoredHeroes

    const topHeroScore =
        Math.max(...heroSource.map((hero) => hero.hero_confidence), 0) / 100

    const bestRoleScore =
        Math.max(...scoredRoles.map((role) => role.role_confidence), 0) / 100

    const flexScore = flexRating / 100
    const pressureScore = pressureRating / 100

    const score =
        winrateScore * 0.25 +
        kdaScore * 0.20 +
        topHeroScore * 0.20 +
        bestRoleScore * 0.15 +
        flexScore * 0.10 +
        pressureScore * 0.10

    return Math.round(clamp(score) * 100)
}

function createPerformanceSnapshot(
    general,
    scoredHeroes,
    scoredRoles,
    pressureRating,
    flexRating
) {
    const winrate = safeNumber(general.winrate)
    const kda = safeNumber(general.kda)

    const winrateScore = Math.round(clamp((winrate - 40) / 25) * 100)
    const kdaScore = Math.round(clamp(kda / 5) * 100)

    const trustedHeroes = scoredHeroes.filter((hero) => hero.games_played >= 10)
    const heroSource = trustedHeroes.length > 0 ? trustedHeroes : scoredHeroes

    const topHeroScore = Math.max(
        ...heroSource.map((hero) => hero.hero_confidence),
        0
    )

    const bestRoleScore = Math.max(
        ...scoredRoles.map((role) => role.role_confidence),
        0
    )

    const scores = [
        { key: "winrate_score", label: "Win Rate", score: winrateScore },
        { key: "kda_score", label: "KDA", score: kdaScore },
        { key: "pressure_rating", label: "Pressure", score: pressureRating },
        { key: "flex_rating", label: "Flex", score: flexRating },
        { key: "best_role_score", label: "Best Role", score: bestRoleScore },
        { key: "top_hero_score", label: "Top Hero", score: topHeroScore },
    ]

    const strongestArea = scores.reduce((best, current) => {
        return current.score > best.score ? current : best
    })

    const weakestArea = scores.reduce((worst, current) => {
        return current.score < worst.score ? current : worst
    })

    return {
        scores,
        strongest_area: strongestArea,
        weakest_area: weakestArea,
    }
}

function formatHeroName(hero) {
    return hero
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

function createFallbackAiReview(summary) {
    const bestRole = summary.role_confidence.best_role
    const topHero = summary.hero_confidence.top_heroes[0]
    const weakestArea = summary.performance_snapshot.weakest_area

    if (!topHero || !bestRole) {
        return "GameStat found player data, but there was not enough public hero or role data to generate a full review."
    }

    return `You profile as a ${summary.flex_label.toLowerCase()} player with ${bestRole.role} as your strongest role. Your strongest hero is ${formatHeroName(topHero.hero)}, and your biggest improvement area is ${weakestArea.label.toLowerCase()}.`
}

async function createAiReview(summary) {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
        return createFallbackAiReview(summary)
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini"

    try {
        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                max_output_tokens: 120,
                input: [
                    {
                        role: "system",
                        content:
                            "You write short esports performance summaries for GameStat. Be direct, useful, and do not overhype. Use only the provided metrics.",
                    },
                    {
                        role: "user",
                        content: JSON.stringify({
                            gamestat_score: summary.gamestat_score,
                            pressure_rating: summary.pressure_rating,
                            reliability_score: summary.reliability_score,
                            flex_rating: summary.flex_rating,
                            flex_label: summary.flex_label,
                            best_role: summary.role_confidence.best_role,
                            top_heroes: summary.hero_confidence.top_heroes,
                            hero_pool: summary.hero_pool.counts,
                            strongest_area:
                                summary.performance_snapshot.strongest_area,
                            weakest_area:
                                summary.performance_snapshot.weakest_area,
                        }),
                    },
                ],
            }),
        })

        if (!response.ok) {
            return createFallbackAiReview(summary)
        }

        const data = await response.json()

        if (typeof data.output_text === "string") {
            return data.output_text.trim()
        }

        const nestedText = data.output?.[0]?.content?.[0]?.text

        if (typeof nestedText === "string") {
            return nestedText.trim()
        }

        return createFallbackAiReview(summary)
    } catch {
        return createFallbackAiReview(summary)
    }
}

function buildSummary(statsData) {
    const general = statsData.general || {}
    const heroes = statsData.heroes || {}
    const roles = statsData.roles || {}

    const scoredHeroes = Object.entries(heroes).map(([heroName, heroStats]) => {
        const heroConfidence = calculateHeroConfidence(heroStats)

        const hero = {
            hero: heroName,
            games_played: safeNumber(heroStats.games_played),
            winrate: safeNumber(heroStats.winrate),
            kda: safeNumber(heroStats.kda),
            hero_confidence: heroConfidence,
            hero_pool: "",
        }

        hero.hero_pool = assignHeroPool(hero)

        return hero
    })

    const scoredRoles = Object.entries(roles).map(([roleName, roleStats]) => {
        return {
            role: roleName,
            games_played: safeNumber(roleStats.games_played),
            winrate: safeNumber(roleStats.winrate),
            kda: safeNumber(roleStats.kda),
            role_confidence: calculateRoleConfidence(roleStats),
        }
    })

    const flexRating = calculateFlexRating(scoredHeroes)
    const flexLabel = assignFlexLabel(flexRating)

    const pressureRating = calculatePressureRating(general)
    const pressureRatingFive = Number(((pressureRating / 100) * 5).toFixed(1))

    const reliabilityScore = calculateReliabilityScore(general)
    const reliabilityLabel = assignReliabilityLabel(reliabilityScore)

    const gamestatScore = calculateGameStatScore(
        general,
        scoredHeroes,
        scoredRoles,
        pressureRating,
        flexRating
    )

    const performanceSnapshot = createPerformanceSnapshot(
        general,
        scoredHeroes,
        scoredRoles,
        pressureRating,
        flexRating
    )

    const topHeroes = scoredHeroes
        .filter((hero) => hero.games_played >= 10)
        .sort((a, b) => b.hero_confidence - a.hero_confidence)
        .slice(0, 5)

    const sortedRoles = [...scoredRoles].sort(
        (a, b) => b.role_confidence - a.role_confidence
    )

    const heroPoolCounts = scoredHeroes.reduce((counts, hero) => {
        counts[hero.hero_pool] = (counts[hero.hero_pool] || 0) + 1
        return counts
    }, {})

    const riskPicks = scoredHeroes
        .filter((hero) => hero.games_played >= 25 && hero.hero_confidence < 55)
        .sort((a, b) => b.games_played - a.games_played)
        .slice(0, 5)

    return {
        gamestat_score: gamestatScore,

        pressure_rating: pressureRating,
        pressure_rating_5: pressureRatingFive,

        reliability_score: reliabilityScore,
        reliability_label: reliabilityLabel,

        performance_snapshot: performanceSnapshot,

        hero_confidence: {
            top_heroes: topHeroes,
        },

        flex_rating: flexRating,
        flex_label: flexLabel,

        role_confidence: {
            best_role: sortedRoles[0] || null,
            all_roles: sortedRoles,
        },

        hero_pool: {
            counts: heroPoolCounts,
            risk_picks: riskPicks,
        },
    }
}

exports.handler = async function (event) {
    const playerId = event.queryStringParameters?.playerId

    if (!playerId) {
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Missing playerId query parameter.",
            }),
        }
    }

    try {
        const statsResponse = await fetch(
            `https://overfast-api.tekrop.fr/players/${encodeURIComponent(
                playerId
            )}/stats/summary`
        )

        if (!statsResponse.ok) {
            return {
                statusCode: statsResponse.status,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "Could not find stats for that player.",
                }),
            }
        }

        const statsData = await statsResponse.json()
        const summary = buildSummary(statsData)
        const aiReview = await createAiReview(summary)

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...summary,
                ai_review: aiReview,
            }),
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Something went wrong while loading GameStat data.",
            }),
        }
    }
}