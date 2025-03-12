"use client"

interface HallLayoutProps {
  className?: string
}

export default function HallLayout({ className = "" }: HallLayoutProps) {
  return (
    <svg viewBox="0 0 1000 600" className={`w-full h-full ${className}`} preserveAspectRatio="xMidYMid meet">
      {/* Background */}
      <rect x="0" y="0" width="1000" height="600" fill="#f9f5ff" />

      {/* Walls */}
      <rect x="20" y="20" width="960" height="560" fill="#ffffff" stroke="#d8b4fe" strokeWidth="4" rx="10" />

      {/* Entrance */}
      <rect x="450" y="560" width="100" height="20" fill="#f9f5ff" stroke="#d8b4fe" strokeWidth="2" />
      <text x="500" y="575" textAnchor="middle" fill="#9333ea" fontSize="14" fontWeight="bold">
        Entrance
      </text>

      {/* Stage/Head Table Area */}
      <rect x="300" y="40" width="400" height="80" fill="#fdf4ff" stroke="#d8b4fe" strokeWidth="2" rx="5" />
      <rect x="350" y="50" width="300" height="60" fill="#f0abfc" stroke="#d8b4fe" strokeWidth="2" rx="5" />
      <text x="500" y="85" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="bold">
        Head Table
      </text>

      {/* Dance Floor */}
      <rect x="400" y="250" width="200" height="200" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="2" rx="5" />
      <text x="500" y="350" textAnchor="middle" fill="#9333ea" fontSize="16" fontWeight="bold">
        Dance Floor
      </text>

      {/* Round Tables */}
      {/* Left Side */}
      <circle cx="150" cy="180" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="150" y="180" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 1
      </text>

      <circle cx="150" cy="300" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="150" y="300" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 2
      </text>

      <circle cx="150" cy="420" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="150" y="420" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 3
      </text>

      <circle cx="250" cy="180" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="250" y="180" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 4
      </text>

      <circle cx="250" cy="300" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="250" y="300" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 5
      </text>

      <circle cx="250" cy="420" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="250" y="420" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 6
      </text>

      {/* Right Side */}
      <circle cx="750" cy="180" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="750" y="180" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 7
      </text>

      <circle cx="750" cy="300" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="750" y="300" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 8
      </text>

      <circle cx="750" cy="420" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="750" y="420" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 9
      </text>

      <circle cx="850" cy="180" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="850" y="180" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 10
      </text>

      <circle cx="850" cy="300" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="850" y="300" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 11
      </text>

      <circle cx="850" cy="420" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="850" y="420" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 12
      </text>

      {/* Bottom Tables */}
      <circle cx="400" cy="500" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="400" y="500" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 13
      </text>

      <circle cx="600" cy="500" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="600" y="500" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 14
      </text>

      {/* Top Tables */}
      <circle cx="400" cy="180" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="400" y="180" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 15
      </text>

      <circle cx="600" cy="180" r="40" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="600" y="180" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Table 16
      </text>

      {/* Decorative Elements */}
      <rect x="20" y="20" width="20" height="20" fill="#f0abfc" rx="5" />
      <rect x="960" y="20" width="20" height="20" fill="#f0abfc" rx="5" />
      <rect x="20" y="560" width="20" height="20" fill="#f0abfc" rx="5" />
      <rect x="960" y="560" width="20" height="20" fill="#f0abfc" rx="5" />

      {/* Legend */}
      <rect
        x="40"
        y="520"
        width="120"
        height="60"
        fill="rgba(255,255,255,0.8)"
        stroke="#d8b4fe"
        strokeWidth="1"
        rx="5"
      />
      <text x="100" y="540" textAnchor="middle" fill="#9333ea" fontSize="12" fontWeight="bold">
        Legend
      </text>
      <circle cx="60" cy="560" r="8" fill="#ffffff" stroke="#f0abfc" strokeWidth="2" />
      <text x="100" y="565" textAnchor="start" fill="#9333ea" fontSize="10">
        Table
      </text>
    </svg>
  )
}

