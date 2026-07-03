"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"

export interface DotBgProps {
    className?: string
    children?: React.ReactNode
    dotSize?: number
    gap?: number
    baseColor?: string
    glowColor?: string
    proximity?: number
    glowIntensity?: number
    waveSpeed?: number
}

interface Dot {
    x: number
    y: number
    baseOpacity: number
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
        }
        : { r: 0, g: 0, b: 0 }
}

export default function DotBg({
    className = "",
    children,
    dotSize = 2,
    gap = 24,
    baseColor = "#5f5f5f",
    glowColor = "#D8FE2B",
    proximity = 160,
    glowIntensity = 1.4,
    waveSpeed = 0.5,
}: DotBgProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const dotsRef = useRef<Dot[]>([])
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const animationRef = useRef<number | null>(null)
    const startTimeRef = useRef(Date.now())

    const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor])
    const glowRgb = useMemo(() => hexToRgb(glowColor), [glowColor])

    const buildGrid = useCallback(() => {
        const canvas = canvasRef.current
        const container = containerRef.current

        if (!canvas || !container) return

        const rect = container.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1

        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr

        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const cellSize = dotSize + gap
        const cols = Math.ceil(rect.width / cellSize) + 1
        const rows = Math.ceil(rect.height / cellSize) + 1

        const offsetX = (rect.width - (cols - 1) * cellSize) / 2
        const offsetY = (rect.height - (rows - 1) * cellSize) / 2

        const dots: Dot[] = []

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                dots.push({
                    x: offsetX + col * cellSize,
                    y: offsetY + row * cellSize,
                    baseOpacity: 0.3 + Math.random() * 0.2,
                })
            }
        }

        dotsRef.current = dots
    }, [dotSize, gap])

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        const width = canvas.width / dpr
        const height = canvas.height / dpr

        ctx.clearRect(0, 0, width, height)

        const { x: mx, y: my } = mouseRef.current
        const proxSq = proximity * proximity
        const time = (Date.now() - startTimeRef.current) * 0.001 * waveSpeed

        for (const dot of dotsRef.current) {
            const dx = dot.x - mx
            const dy = dot.y - my
            const distSq = dx * dx + dy * dy

            const wave =
                Math.sin(dot.x * 0.02 + dot.y * 0.02 + time) * 0.5 + 0.5

            const waveOpacity = dot.baseOpacity + wave * 0.15
            const waveScale = 1 + wave * 0.2

            let opacity = waveOpacity
            let scale = waveScale
            let r = baseRgb.r
            let g = baseRgb.g
            let b = baseRgb.b
            let glow = 0

            if (distSq < proxSq) {
                const dist = Math.sqrt(distSq)
                const t = 1 - dist / proximity
                const easedT = t * t * (3 - 2 * t)

                r = Math.round(baseRgb.r + (glowRgb.r - baseRgb.r) * easedT)
                g = Math.round(baseRgb.g + (glowRgb.g - baseRgb.g) * easedT)
                b = Math.round(baseRgb.b + (glowRgb.b - baseRgb.b) * easedT)

                opacity = Math.min(1, waveOpacity + easedT * 0.7)
                scale = waveScale + easedT * 0.8
                glow = easedT * glowIntensity
            }

            const radius = (dotSize / 2) * scale

            if (glow > 0) {
                const gradient = ctx.createRadialGradient(
                    dot.x,
                    dot.y,
                    0,
                    dot.x,
                    dot.y,
                    radius * 4
                )

                gradient.addColorStop(
                    0,
                    `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.4
                    })`
                )

                gradient.addColorStop(
                    0.5,
                    `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${glow * 0.1
                    })`
                )

                gradient.addColorStop(
                    1,
                    `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0)`
                )

                ctx.beginPath()
                ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()
            }

            ctx.beginPath()
            ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
            ctx.fill()
        }

        animationRef.current = requestAnimationFrame(draw)
    }, [baseRgb, glowRgb, dotSize, proximity, glowIntensity, waveSpeed])

    useEffect(() => {
        buildGrid()

        const container = containerRef.current
        if (!container) return

        const resizeObserver = new ResizeObserver(buildGrid)
        resizeObserver.observe(container)

        return () => {
            resizeObserver.disconnect()
        }
    }, [buildGrid])

    useEffect(() => {
        animationRef.current = requestAnimationFrame(draw)

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [draw])

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const canvas = canvasRef.current
            if (!canvas) return

            const rect = canvas.getBoundingClientRect()

            mouseRef.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            }
        }

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 }
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseout", handleMouseLeave)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseout", handleMouseLeave)
        }
    }, [])

    return (
        <div ref={containerRef} className={`dot-bg-root ${className}`}>
            <canvas ref={canvasRef} className="dot-bg-canvas" />

            <div className="dot-bg-vignette" />

            {children && <div className="dot-bg-content">{children}</div>}
        </div>
    )
}