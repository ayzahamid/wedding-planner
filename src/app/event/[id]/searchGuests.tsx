import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import GuestAvatar from "@/components/guest-avatar";
import { debounce } from "@/utils/debounce";

interface Guest {
  id: number;
  table_id: number;
  name: string;
  member_count: number;
  phone_number: string;
  checked_at: string | null;
  avatar_url?: string; // Optional avatar URL
}

interface SearchComponentProps {
  eventId: string; // ID of the event
  switchToRegister: () => void; // Function to switch to the registration form
  selectGuest: (guest: any) => void; // Function to handle guest selection
}


const SearchComponent: React.FC<SearchComponentProps> = ({
  eventId,
  switchToRegister,
  selectGuest,
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/event/${eventId}/guests?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();

        // Add avatar URL to each guest
        const guestsWithAvatars = data.map((guest: Guest) => ({
          ...guest,
          avatar_url: `https://source.boringavatars.com/beam/120/${encodeURIComponent(
            guest.name
          )}?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D`,
        }));

        setSearchResults(guestsWithAvatars);

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
    }, 300), // 300ms debounce delay
    [eventId]
  );

  // Trigger search when searchQuery changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  return (
    <div className="space-y-4 py-6 px-4 md:px-6">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter your name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-pink-200 focus-visible:ring-pink-400"
        />
        <Button
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

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-purple-700">Search Results:</h3>
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
                    <p className="font-medium text-gray-800">{guest.name}</p>
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

      {searchResults.length === 0 && searchQuery && !isSearching && (
        <div className="text-center py-6 bg-pink-50 rounded-lg border border-pink-100">
          <p className="mb-3 text-gray-700">No guests found with that name.</p>
          <Button
            variant="outline"
            onClick={switchToRegister}
            className="border-pink-300 text-pink-600 hover:bg-pink-50"
          >
            Register as a New Guest
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
