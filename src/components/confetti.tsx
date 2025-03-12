"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

export default function Confetti() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [particleCount, setParticleCount] = useState(200)

  useEffect(() => {
    // Set initial dimensions
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Update dimensions on resize
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Reduce particle count over time for performance
    const timer = setTimeout(() => {
      setParticleCount(50)
    }, 2000)

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [])

  return (
    <ReactConfetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      recycle={false}
      numberOfPieces={particleCount}
      gravity={0.15}
      colors={["#ec4899", "#d946ef", "#8b5cf6", "#f472b6", "#f9a8d4"]}
    />
  )
}

