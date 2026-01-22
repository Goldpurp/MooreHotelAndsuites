import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { generateAppImage, APP_IMAGE_PROMPTS } from "../services/imageService";
import { Room } from "../types";

const RoomDetail: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [dynamicImg, setDynamicImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  
  // Availability State
  const [isAvailable, setIsAvailable] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  const [selectedCheckIn, setSelectedCheckIn] = useState(
    searchParams.get("checkIn") ?? new Date().toISOString().split("T")[0],
  );
  const [selectedCheckOut, setSelectedCheckOut] = useState(
    searchParams.get("checkOut") ??
      new Date(Date.now() + 86400000).toISOString().split("T")[0],
  );

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await api.getRoomById(id!);
        setRoom(data);

        const key =
          `${data.category.toLowerCase()}_room` as keyof typeof APP_IMAGE_PROMPTS;
        const img = await generateAppImage(
          APP_IMAGE_PROMPTS[key] || APP_IMAGE_PROMPTS.standard_room,
        );
        if (img) setDynamicImg(img);
      } catch (err: any) {
        console.error("Room fetch failed", err);
        if (err.message?.includes('unreachable')) {
          setAvailabilityMessage("Connection error: Unable to verify room details.");
        } else {
           navigate("/rooms");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, navigate]);

  // Real-world availability check effect
  useEffect(() => {
    const verifyDates = async () => {
      if (!id || !selectedCheckIn || !selectedCheckOut) return;
      
      const checkInDate = new Date(selectedCheckIn);
      const checkOutDate = new Date(selectedCheckOut);
      
      if (checkOutDate <= checkInDate) {
        setIsAvailable(false);
        setAvailabilityMessage("Invalid Date Sequence: Check-out must follow check-in.");
        return;
      }

      setAvailabilityLoading(true);
      try {
        const res = await api.checkAvailability(id, selectedCheckIn, selectedCheckOut);
        setIsAvailable(res.available);
        setAvailabilityMessage(res.available ? null : (res.message || "This room is already reserved for the selected period."));
      } catch (err) {
        setIsAvailable(true); // Default to true to allow user to try booking if check fails
      } finally {
        setAvailabilityLoading(false);
      }
    };

    const timer = setTimeout(verifyDates, 500); 
    return () => clearTimeout(timer);
  }, [id, selectedCheckIn, selectedCheckOut]);

  const stayCalculations = useMemo(() => {
    if (!room) return { nights: 0, total: 0 };
    const checkInDate = new Date(selectedCheckIn);
    const checkOutDate = new Date(selectedCheckOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    const total = room.pricePerNight * nights;
    return { nights, total };
  }, [room, selectedCheckIn, selectedCheckOut]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!room) return null;

  const images = room.images ?? [];

  const handleAuthoriseStay = () => {
    if (!isAvailable) {
      alert(availabilityMessage || "Selected dates are not available.");
      return;
    }
    navigate(
      `/checkout/${room.id}?checkIn=${selectedCheckIn}&checkOut=${selectedCheckOut}`,
    );
  };

  return (
    <div className="bg-background-dark min-h-screen pb-28">
      {/* HERO SECTION */}
      <section className="relative">
        <div className="absolute top-24 left-4 sm:left-6 lg:left-16 z-50">
          <button
            onClick={() => navigate("/rooms")}
            className="flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-sm text-white hover:text-primary transition group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
              arrow_left_alt
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] font-black">
              Back
            </span>
          </button>
        </div>

        <div className="relative h-[65vh] md:h-[85vh] w-full bg-black overflow-hidden">
          {/* MAIN IMAGE */}
          <img
            src={images[activeImage]}
            alt={room.name}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover object-center select-none will-change-transform"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/30" />

          {/* TEXT */}
          <div className="absolute bottom-10 left-4 sm:left-6 lg:left-16 z-30 max-w-[90vw] space-y-4">
            <p className="text-primary text-[9px] uppercase tracking-[0.6em] font-black">
              Room {room.roomNumber}
            </p>
            <h1 className="serif-font text-4xl md:text-6xl lg:text-9xl italic text-white leading-none tracking-tight">
              {room.name}
            </h1>
          </div>

          {/* THUMBNAIL CAROUSEL */}
          {images.length > 1 && (
            <div className="absolute bottom-16 right-4 sm:right-6 lg:right-16 z-40 flex gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-16 h-12 md:w-20 md:h-14 overflow-hidden border transition ${
                    activeImage === index
                      ? "border-primary scale-105"
                      : "border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTENT GRID */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-8 space-y-16">
          <section className="space-y-6">
            <h2 className="serif-font text-2xl md:text-5xl italic text-white">
              {room.description || "A refined escape defined by stillness and precision."}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5 mt-10">
              <div>
                <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-black">
                  Unit
                </p>
                <p className="text-white text-xl font-bold italic">
                  {room.category}
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-black">
                  Status
                </p>
                <p className="text-primary text-xl font-black uppercase">
                  {room.status}
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-black">
                  Capacity
                </p>
                <p className="text-white text-xl font-bold italic">
                  {room.capacity || 2} Guests
                </p>
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-black">
                  Room size
                </p>
                <p className="text-white text-xl font-bold italic">
                  {room.size || "65sqm"}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-primary text-[10px] uppercase tracking-[0.5em] font-black">
              Bespoke Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {room.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="p-6 bg-white/[0.03] border border-white/5 rounded-sm flex items-center gap-4 hover:border-primary/40 transition group"
                >
                  <span className="material-symbols-outlined text-primary/30 group-hover:text-primary transition text-2xl">
                    verified
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white font-black">
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-surface-dark border border-white/10 p-10 rounded-sm space-y-10 sticky top-32 shadow-2xl">
            <div className="text-center space-y-2">
              <p className="text-primary text-[9px] uppercase tracking-[0.5em] font-black">
                Nightly Rate
              </p>
              <h3 className="serif-font text-5xl md:text-6xl text-white font-bold tracking-tighter">
                ₦{room.pricePerNight.toLocaleString()}
              </h3>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5 relative">
              {/* AVAILABILITY WARNING MESSAGE - RIGHT ON TOP OF CALENDAR */}
              {availabilityMessage && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-sm animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg shrink-0">warning</span>
                    <p className="text-[10px] uppercase tracking-wider text-primary font-black italic leading-relaxed">
                      {availabilityMessage}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-widest text-primary font-black ml-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={selectedCheckIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSelectedCheckIn(e.target.value)}
                    className={`w-full bg-white/[0.07] border rounded-sm p-4 text-xs text-white focus:border-primary outline-none transition-all cursor-pointer hover:bg-white/[0.1] ${!isAvailable ? 'border-red-500/40' : 'border-primary/40'}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-widest text-primary font-black ml-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={selectedCheckOut}
                    min={selectedCheckIn}
                    onChange={(e) => setSelectedCheckOut(e.target.value)}
                    className={`w-full bg-white/[0.07] border rounded-sm p-4 text-xs text-white focus:border-primary outline-none transition-all cursor-pointer hover:bg-white/[0.1] ${!isAvailable ? 'border-red-500/40' : 'border-primary/40'}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 pb-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 uppercase tracking-widest font-black text-[9px]">
                  Duration
                </span>
                <span className="text-white italic">
                  {stayCalculations.nights} Nights
                </span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-primary uppercase tracking-[0.2em] font-black text-[10px]">
                  Total Stay
                </span>
                <span className="serif-font text-3xl text-white font-bold italic tracking-tighter">
                  ₦{stayCalculations.total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleAuthoriseStay}
              disabled={!isAvailable || availabilityLoading}
              className={`w-full h-16 uppercase text-[10px] font-black tracking-[0.4em] transition shadow-2xl active:scale-95 flex items-center justify-center gap-4 group ${
                !isAvailable 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5' 
                  : 'bg-primary hover:bg-yellow-500 text-black'
              }`}
            >
              {availabilityLoading ? (
                <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : isAvailable ? (
                <>
                  Confirm Stay{" "}
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition">
                    arrow_right_alt
                  </span>
                </>
              ) : (
                "Room Unavailable"
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RoomDetail;
