"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function ResponsiveLayout({ children, className = "" }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()

    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return <div className={`${isMobile ? "px-4" : "px-6"} ${className}`}>{children}</div>
}
