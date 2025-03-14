"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
  Pin,
  Users,
  Heart,
  Check,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import Confetti from "@/components/confetti";
import HallLayout from "@/components/hall-layout";
import GuestAvatar from "@/components/guest-avatar";
import FullScreenLayout from "./FullScreenLayout";
import { Guest, Table, Event } from "@/app/types/events";

export default function EventSeatingPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { toast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    member_count: 1,
    phone_number: "",
    table_id: "",
  });
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [showAllTables, setShowAllTables] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  // Zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Fetch event data on load
  useEffect(() => {
    console.log("Event Id", eventId)
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/event/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event data");
        const data = await response.json();
        console.log("Event Data", data[0].event)
        setEvent(data[0].event);
        const tableArray  = [data[0].table]
        console.log("tableArray", tableArray)
        console.log("Available Table", tableArray.filter(
          (table) => table.seat_available > 0
        ))
        setAvailableTables(
          tableArray.filter((table) => table.seat_available > 0)
        );

        toast({
          title: "Welcome to the Event Seating App",
          description: `${data[0].event.bride} & ${data[0].event.groom}'s special day`,
          variant: "default",
        });
      } catch (error) {
        console.error("Error fetching event data:", error);
        toast({
          title: "Error loading event data",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/event/${eventId}/guests?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      console.log("Search Data", data)
      data[0].imageUrl=`https://source.boringavatars.com/beam/120/${encodeURIComponent("Smith Family")}?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D`
      console.log("Data", data)
      setSearchResults(data);
      setSelectedGuest(null);

      if (data.length === 0) {
        toast({
          title: "No guests found",
          description: "Try another name or register as a new guest",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const selectGuest = (guest: Guest) => {

    console.log("Guest", guest)
    setSelectedGuest(guest);
    setSearchResults([]);
    setShowConfetti(true);

    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });

    const welcomeMessages = [
      `Welcome to the celebration, ${guest.name}!`,
      `We're so happy you're here, ${guest.name}!`,
      `The party can now begin! Welcome, ${guest.name}!`,
      `${guest.name}, your presence makes this day even more special!`,
      `Time to celebrate! Welcome, ${guest.name}!`,
    ];
    setWelcomeMessage(
      welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
    );

    toast({
      title: "Table found!",
      description: `You're seated at Table #${guest.table_id}`,
      variant: "default",
    });

    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registrationData.name ||
      !registrationData.phone_number ||
      !registrationData.table_id
    )
      return;

    setIsRegistering(true);
    try {
      const response = await fetch(`/api/event/${eventId}/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) throw new Error("Registration failed");

      const updatedTables = await response.json();
      setEvent((prev) => (prev ? { ...prev, tables: updatedTables } : null));
      setAvailableTables(
        updatedTables.filter(
          (table: { seat_availabe: number }) => table.seat_availabe > 0
        )
      );
      setRegistrationComplete(true);

      setSelectedGuest({
        table_id: registrationData.table_id,
        name: registrationData.name,
        member_count: registrationData.member_count,
      });

      setShowConfetti(true);

      const welcomeMessages = [
        `Welcome to the party, ${registrationData.name}! We're glad you made it!`,
        `Thanks for joining us, ${registrationData.name}! Let's celebrate!`,
        `${registrationData.name}, we're thrilled to have you with us today!`,
        `The celebration just got better with you here, ${registrationData.name}!`,
        `Welcome to our special day, ${registrationData.name}!`,
      ];
      setWelcomeMessage(
        welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
      );

      toast({
        title: "Registration successful!",
        description: `You've been assigned to Table #${registrationData.table_id}`,
        variant: "default",
      });

      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const switchToRegister = () => {
    setActiveTab("register");
    setSearchQuery("");
    setSearchResults([]);
  };

  const toggleShowAllTables = () => {
    setShowAllTables(!showAllTables);
    toast({
      title: showAllTables
        ? "Showing selected table only"
        : "Showing all tables",
      variant: "default",
    });
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    toast({
      title: "Zoomed in",
      variant: "default",
    });
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    toast({
      title: "Zoomed out",
      variant: "default",
    });
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    toast({
      title: "Zoom reset",
      variant: "default",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = (e.clientX - dragStart.x) / zoomLevel;
    const dy = (e.clientY - dragStart.y) / zoomLevel;

    setPanPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;

    const dx = (e.touches[0].clientX - dragStart.x) / zoomLevel;
    const dy = (e.touches[0].clientY - dragStart.y) / zoomLevel;

    setPanPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setDragStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const goBackToEvents = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-primary">
            Loading event details...
          </p>
          <div className="mt-2 flex justify-center space-x-1">
            <Heart className="h-5 w-5 text-pink-400 animate-pulse" />
            <Heart className="h-5 w-5 text-pink-500 animate-pulse delay-100" />
            <Heart className="h-5 w-5 text-pink-600 animate-pulse delay-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 py-8">
        {showConfetti && <Confetti />}

        <div className="container max-w-2xl mx-auto px-4">
          <Button
            variant="outline"
            className="mb-4 border-pink-200 text-pink-600 hover:bg-pink-50"
            onClick={goBackToEvents}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>

          {event && (
            <Card className="w-full border-2 border-pink-200 shadow-lg overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-t-lg pb-6">
                <div className="flex justify-center mb-2">
                  <GuestAvatar
                    name={`${event.bride} ${event.groom}`}
                    size="lg"
                    className="border-2 border-pink-300"
                  />
                </div>
                <CardTitle className="text-3xl font-serif bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                  {event.bride} & {event.groom}
                </CardTitle>
                <CardDescription className="text-gray-700 font-medium">
                  {new Date(event.wedding_date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>

              {selectedGuest ? (
                <CardContent className="pt-6 px-4 md:px-6">
                  <div className="text-center mb-6 bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
                    <div className="flex justify-center mb-3">
                      <GuestAvatar
                        name={selectedGuest.name}
                        imageUrl={selectedGuest.avatar_url}
                      />
                    </div>
                    <h2 className="text-2xl font-medium mb-3 text-pink-600">
                      {welcomeMessage}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-gray-700">
                        Your table is{" "}
                        <Badge
                          variant="outline"
                          className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-3 py-1"
                        >
                          #{selectedGuest.table_id}
                        </Badge>
                      </p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                          >
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            With {selectedGuest.member_count} seat
                            {selectedGuest.member_count !== 1 ? "s" : ""}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Hall layout with zoom functionality */}
                  <FullScreenLayout
                    event={event}
                    selectedGuest={selectedGuest}
                    showAllTables={showAllTables}
                  />

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleShowAllTables}
                      className="mb-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      {showAllTables ? "Hide Other Tables" : "Show All Tables"}
                    </Button>

                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                      onClick={() => {
                        setSelectedGuest(null);
                        setActiveTab("search");
                        setShowAllTables(false);
                        setZoomLevel(1);
                        setPanPosition({ x: 0, y: 0 });
                      }}
                    >
                      Back to Search
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-pink-100 text-pink-600">
                      <TabsTrigger
                        value="search"
                        className="data-[state=active]:bg-white data-[state=active]:text-pink-600"
                      >
                        Find Your Seat
                      </TabsTrigger>
                      <TabsTrigger
                        value="register"
                        className="data-[state=active]:bg-white data-[state=active]:text-pink-600"
                      >
                        Register
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="search"
                      className="space-y-4 px-4 md:px-6"
                    >
                      <CardContent className="space-y-4 pt-6 px-4 md:px-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter your name"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="flex-1 border-pink-200 focus-visible:ring-pink-400"
                            />
                            <Button
                              type="submit"
                              disabled={isSearching}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                            >
                              {isSearching ? (
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                              ) : (
                                <Search className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </form>

                        {searchResults.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-medium text-purple-700">
                              Search Results:
                            </h3>
                            <div className="border border-pink-200 rounded-md divide-y divide-pink-100 overflow-hidden">
                              {searchResults.map((guest, index) => (
                                <div
                                  key={index}
                                  className="p-3 hover:bg-pink-50 cursor-pointer flex justify-between items-center transition-colors"
                                  onClick={() => selectGuest(guest)}
                                >
                                  <div className="flex items-center gap-3">
                                    <GuestAvatar
                                      name={guest.name}
                                      imageUrl={guest.avatar_url}
                                      size="sm"
                                    />
                                    <div>
                                      <p className="font-medium text-gray-800">
                                        {guest.name}
                                      </p>
                                      <Badge
                                        variant="outline"
                                        className="text-pink-600 border-pink-200"
                                      >
                                        Table #{guest.table_id}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                                    <Users className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-600">
                                      {guest.member_count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.length === 0 &&
                          searchQuery &&
                          !isSearching && (
                            <div className="text-center py-6 bg-pink-50 rounded-lg border border-pink-100">
                              <p className="mb-3 text-gray-700">
                                No guests found with that name.
                              </p>
                              <Button
                                variant="outline"
                                onClick={switchToRegister}
                                className="border-pink-300 text-pink-600 hover:bg-pink-50"
                              >
                                Register as a New Guest
                              </Button>
                            </div>
                          )}
                      </CardContent>
                    </TabsContent>

                    <TabsContent value="register" className="px-4 md:px-6">
                      <CardContent className="pt-6 px-4 md:px-6">
                        {registrationComplete ? (
                          <div className="text-center py-6 space-y-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                            <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-3 w-16 h-16 flex items-center justify-center mx-auto shadow-md">
                              <Check className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-medium text-xl text-purple-700">
                              Registration Complete!
                            </h3>
                            <p className="text-gray-700">
                              You&apos;ve been assigned to table{" "}
                              <Badge
                                variant="outline"
                                className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-3 py-1"
                              >
                                #{registrationData.table_id}
                              </Badge>
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-gray-700">
                                Your Name
                              </Label>
                              <Input
                                id="name"
                                placeholder="Full Name"
                                value={registrationData.name}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    name: e.target.value,
                                  })
                                }
                                required
                                className="border-pink-200 focus-visible:ring-pink-400"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-gray-700">
                                Phone Number
                              </Label>
                              <Input
                                id="phone"
                                placeholder="Phone Number"
                                value={registrationData.phone_number}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    phone_number: e.target.value,
                                  })
                                }
                                required
                                className="border-pink-200 focus-visible:ring-pink-400"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="members"
                                className="text-gray-700"
                              >
                                Number of Family Members (including you)
                              </Label>
                              <Input
                                id="members"
                                type="number"
                                min="1"
                                value={registrationData.member_count}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    member_count:
                                      Number.parseInt(e.target.value) || 1,
                                  })
                                }
                                required
                                className="border-pink-200 focus-visible:ring-pink-400"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-gray-700">
                                Select a Table
                              </Label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                {availableTables.map((table) => (
                                  <Tooltip key={table.table_no}>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant={
                                          registrationData.table_id ===
                                          table.table_no
                                            ? "default"
                                            : "outline"
                                        }
                                        className={`h-auto py-2 flex flex-col ${
                                          registrationData.table_id ===
                                          table.table_no
                                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                                            : "border-pink-200 text-gray-700 hover:bg-pink-50"
                                        }`}
                                        onClick={() =>
                                          setRegistrationData({
                                            ...registrationData,
                                            table_id: table.table_no,
                                          })
                                        }
                                      >
                                        <span>Table #{table.table_no}</span>
                                        <span
                                          className={`text-xs ${
                                            registrationData.table_id ===
                                            table.table_no
                                              ? "text-pink-100"
                                              : "text-pink-500"
                                          }`}
                                        >
                                          {table.seat_availabe} seat
                                          {table.seat_availabe !== 1 ? "s" : ""}{" "}
                                          available
                                        </span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {table.seat_assigned} guests already
                                        seated
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                              </div>
                            </div>

                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                              disabled={
                                isRegistering || !registrationData.table_id
                              }
                            >
                              {isRegistering ? (
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                              ) : null}
                              Register
                            </Button>
                          </form>
                        )}
                      </CardContent>
                    </TabsContent>
                  </Tabs>
                </>
              )}

              <CardFooter className="flex justify-center border-t border-pink-200 pt-4 text-xs text-pink-400">
                Event Seating App • Event ID: {eventId}
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </TooltipProvider>
  );
}
