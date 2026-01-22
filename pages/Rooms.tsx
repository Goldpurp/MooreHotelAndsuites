import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { Room, RoomCategory, RoomStatus } from "../types";

const Rooms: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [budget, setBudget] = useState(3000000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const activeCategory = searchParams.get("category") || "All";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "2";

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: Room[];

        // Only call search if there are real values
        const shouldSearch =
          (checkIn && checkOut) || activeCategory !== "All";

        if (shouldSearch) {
          data = await api.searchRooms({
            checkIn,
            checkOut,
            category: activeCategory === "All" ? undefined : activeCategory,
          });
        } else {
          data = await api.getRooms("");
        }

        const availableRooms = data.filter(
          (r) => r.isOnline && r.status !== RoomStatus.Maintenance
        );

        setRooms(availableRooms);
      } catch (err: any) {
        setError("Failed to load rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [activeCategory, checkIn, checkOut]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.roomNumber.includes(searchQuery);

      const matchesBudget = room.pricePerNight <= budget;

      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((a) => room.amenities.includes(a));

      return matchesSearch && matchesBudget && matchesAmenities;
    });
  }, [rooms, searchQuery, budget, selectedAmenities]);

  const handleCategoryChange = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") newParams.delete("category");
    else newParams.set("category", cat);

    setSearchParams(newParams);
  };

  return (
    <div className="pt-28 min-h-screen bg-background-dark pb-24">
      <div className="max-w-[1800px] mx-auto px-6 md:px-10">
        {/* Header & Filters */}
        <header className="mb-10 space-y-16">
          <div className="flex overflow-x-auto scrollbar-hide gap-8 md:gap-12 pb-4 border-b border-white/5">
            <button
              onClick={() => handleCategoryChange("All")}
              className={`text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap transition-all pb-4 relative ${
                activeCategory === "All" ? "text-primary" : "text-gray-600 hover:text-gray-300"
              }`}
            >
              All Suites
              {activeCategory === "All" && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary"></span>
              )}
            </button>
            {Object.values(RoomCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap transition-all pb-4 relative ${
                  activeCategory === cat ? "text-primary" : "text-gray-600 hover:text-gray-300"
                }`}
              >
                {cat} Tier
                {activeCategory === cat && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary"></span>
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Room Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-white/[0.02] animate-pulse rounded-sm border border-white/5"
              />
            ))}
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 lg:gap-y-32">
            {filteredRooms.map((room) => (
              <Link
                key={room.id}
                to={`/rooms/${room.id}`}
                className="group flex flex-col gap-8"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface-dark border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                  <img
                    src={room.images?.[0]}
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-[3000ms] group-hover:scale-110"
                    alt={room.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                  <div className="absolute bottom-10 left-10 right-10 space-y-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <p className="text-primary text-[9px] uppercase tracking-[0.4em] font-black">
                      {room.category} Unit
                    </p>
                    <h3 className="serif-font text-4xl text-white italic leading-tight group-hover:text-primary transition-colors">
                      {room.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-52 text-center space-y-10">
            <p className="serif-font text-3xl text-gray-600 italic">
              No rooms match your lookup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
