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
import { Guest, Table, Event } from "@/app/types/types";
import SearchComponent from "./searchGuests";

export default function EventSeatingPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { toast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    member_count: 1,
    phone_number: "",
    table_id: "",
    table_no: "",
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
  const [allTables, setAllTables] = useState<Table[]>([]);

  // Zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState({
    name: "",
    phone_number: "",
    member_count: "",
    table_id: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      phone_number: "",
      member_count: "",
      table_id: "",
    };

    if (!registrationData.name || registrationData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
      valid = false;
    }

    if (!/^\d{10}$/.test(registrationData.phone_number)) {
      newErrors.phone_number = "Enter a valid 10-digit phone number.";
      valid = false;
    }

    if (!registrationData.member_count || registrationData.member_count < 1) {
      newErrors.member_count = "Must have at least 1 member.";
      valid = false;
    }

    if (!registrationData.table_id) {
      newErrors.table_id = "Please select a table.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Fetch event data on load
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/event/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }

        const data = await response.json();

        // Extract event and table data from the response
        const eventData = data[0].event[0] || null;
        const tableData = data[0].tables;

        // Update event state
        setEvent(eventData);

        // Update tables state
        setAllTables(tableData);

        // Filter available tables
        const available = tableData.filter(
          (table: { seat_available: number }) => table.seat_available > 0
        );
        setAvailableTables(available);

        // Show success toast
        if (eventData) {
          toast({
            title: "Welcome to the Event Seating App",
            description: `${eventData.bride} & ${eventData.groom}'s special day`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error fetching event data:", error);

        // Show error toast
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
  }, [eventId]); // Add `eventId` as a dependency

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const selectGuest = (guest: Guest) => {
    const selectedTable = allTables.filter(
      (table) => table.id == Number(guest.table_id)
    );
    setSelectedTable(selectedTable[0]);

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
      description: `You're seated at Table #${selectedTable[0]?.table_no}`,
      variant: "default",
    });

    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        table_no: registrationData.table_no,
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
                          #{selectedTable?.table_no}
                        </Badge>
                      </p>
                      <div className="text-gray-700">
                        with {selectedGuest.member_count} seat
                        {selectedGuest.member_count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  {/* Hall layout with zoom functionality */}
                  <FullScreenLayout
                    event={{ ...event, tables: allTables }}
                    selectedGuest={selectedGuest}
                    showAllTables={showAllTables}
                    selectedTable={selectedTable}
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
                      <SearchComponent
                        eventId={eventId}
                        switchToRegister={switchToRegister}
                        selectGuest={selectGuest}
                      ></SearchComponent>
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
                              {errors.name && (
                                <p className="text-red-500 text-xs">
                                  {errors.name}
                                </p>
                              )}
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
                              {errors.phone_number && (
                                <p className="text-red-500 text-xs">
                                  {errors.phone_number}
                                </p>
                              )}
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
                                    member_count: Number(e.target.value) || 1,
                                  })
                                }
                                required
                                className="border-pink-200 focus-visible:ring-pink-400"
                              />
                              {errors.member_count && (
                                <p className="text-red-500 text-xs">
                                  {errors.member_count}
                                </p>
                              )}
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
                                          {table.seat_available} seat
                                          {table.seat_available !== 1
                                            ? "s"
                                            : ""}{" "}
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
                              {errors.table_id && (
                                <p className="text-red-500 text-xs">
                                  {errors.table_id}
                                </p>
                              )}
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
