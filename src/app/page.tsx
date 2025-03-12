"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  type: string;
  title: string;
  bride?: string;
  groom?: string;
  host?: string;
  date: string;
  venue: string;
  address: string;
  guests_count: number;
  tables_count: number;
  image: string;
  color_theme: string;
}

export default function EventsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        let newData = {
          ...data[0],
          date: "2025-06-15T18:00:00Z",
          venue: "Grand Ballroom",
          address: "123 Celebration Ave, Wedding City",
          guests_count: 150,
          tables_count: 16,
          image:
            "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
          color_theme: "pink",
          type: "wedding",
          title: "Sarah & Michael's Wedding"
        };
        console.log("New Data", newData)
        setEvents([newData]);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error loading events",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const navigateToEvent = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  // Helper function to get color classes based on event theme
  const getColorClasses = (theme: string) => {
    const themeMap: Record<
      string,
      { bg: string; border: string; text: string; badge: string }
    > = {
      pink: {
        bg: "from-pink-50 to-purple-50",
        border: "border-pink-200",
        text: "text-pink-600",
        badge: "bg-pink-100 text-pink-800",
      },
      blue: {
        bg: "from-pink-50 to-purple-50",
        border: "border-pink-200",
        text: "text-pink-600",
        badge: "bg-blue-100 text-blue-800",
      },
      purple: {
        bg: "from-purple-50 to-indigo-50",
        border: "border-purple-200",
        text: "text-purple-600",
        badge: "bg-purple-100 text-purple-800",
      },
      green: {
        bg: "from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-600",
        badge: "bg-green-100 text-green-800",
      },
    };

    return themeMap[theme] || themeMap.pink;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Event Seating Planner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your seat or register for upcoming events. Select an event to
            view its seating plan.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="overflow-hidden border-2 border-gray-200"
              >
                <div className="relative w-full h-48">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const colors = getColorClasses(event.color_theme);
              return (
                <Card
                  key={event.id}
                  className={`overflow-hidden border-2 ${colors.border} hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    {/* Image loading skeleton */}
                    <div className="absolute inset-0 bg-gray-200 animate-pulse z-0"></div>

                    <Image
                      src={
                        event.image || "/placeholder.svg?height=400&width=600"
                      }
                      alt={event.title}
                      fill
                      className="object-cover transition-opacity duration-300 z-10"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 2}
                      quality={85}
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src =
                          "/placeholder.svg?height=400&width=600";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20" />
                    <Badge
                      className={`absolute top-3 right-3 ${colors.badge} capitalize z-30`}
                      variant="secondary"
                    >
                      {event.type}
                    </Badge>
                  </div>

                  <CardHeader className={`bg-gradient-to-r ${colors.bg}`}>
                    <CardTitle className="text-xl font-bold">
                      {event.title}
                    </CardTitle>
                    <CardDescription>
                      {event.type === "wedding"
                        ? `${event.bride} & ${event.groom}`
                        : `Hosted by ${event.host}`}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className={`h-5 w-5 ${colors.text} mt-0.5`} />
                      <div>
                        <p className="font-medium">
                          {new Date(event.date).toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className={`h-5 w-5 ${colors.text} mt-0.5`} />
                      <div>
                        <p className="font-medium">{event.venue}</p>
                        <p className="text-sm text-gray-500">{event.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className={`h-5 w-5 ${colors.text}`} />
                        <span className="text-sm font-medium">
                          {event.guests_count} Guests
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className={`h-5 w-5 ${colors.text}`} />
                        <span className="text-sm font-medium">
                          {Math.ceil(
                            (new Date(event.date).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days left
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 pb-6">
                    <Button
                      onClick={() => navigateToEvent(event.id)}
                      className={`w-full bg-gradient-to-r from-${
                        event.color_theme
                      }-500 to-${
                        event.color_theme === "blue"
                          ? "cyan"
                          : event.color_theme === "green"
                          ? "emerald"
                          : event.color_theme === "purple"
                          ? "indigo"
                          : "purple"
                      }-500 hover:from-${event.color_theme}-600 hover:to-${
                        event.color_theme === "blue"
                          ? "cyan"
                          : event.color_theme === "green"
                          ? "emerald"
                          : event.color_theme === "purple"
                          ? "indigo"
                          : "purple"
                      }-600 text-white`}
                    >
                      View Seating Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
