import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface GuestAvatarProps {
  name: string
  imageUrl?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function GuestAvatar({ name, imageUrl, size = "md", className = "" }: GuestAvatarProps) {
  // Generate a consistent color based on the name
  const getColorClass = (name: string) => {
    const colors = [
      "from-pink-400 to-purple-400",
      "from-purple-400 to-indigo-400",
      "from-indigo-400 to-blue-400",
      "from-blue-400 to-cyan-400",
      "from-cyan-400 to-teal-400",
      "from-teal-400 to-green-400",
      "from-green-400 to-lime-400",
      "from-lime-400 to-yellow-400",
      "from-yellow-400 to-orange-400",
      "from-orange-400 to-red-400",
      "from-red-400 to-pink-400",
    ]

    // Simple hash function to get a consistent index
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  // Get initials from name
  const getInitials = (name: string) => {
    // Split the name by spaces
    const parts = name.split(" ")

    // Filter out parts that don't start with a letter and get the first character of each remaining part
    const initials = parts
      .filter((part) => /^[a-zA-Z]/.test(part)) // Only keep parts that start with a letter
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    return initials
  }

  // Determine size class
  const sizeClass = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
  }[size]

  // Generate a dummy avatar URL if none provided
  const avatarUrl =
    imageUrl ||
    `https://source.boringavatars.com/beam/120/${encodeURIComponent(name)}?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D`

  return (
    <Avatar className={`${sizeClass} border-2 border-pink-200 ${className}`}>
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className={`bg-gradient-to-r ${getColorClass(name)} text-white font-medium`}>
        {getInitials(name) || <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  )
}

