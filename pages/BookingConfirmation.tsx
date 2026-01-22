import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { Booking, Room } from "../types";

const BookingConfirmation: React.FC = () => {
  const { code } = useParams();
  const location = useLocation();
  const stateBooking = location.state?.booking as Booking | null;

  const [booking, setBooking] = useState<Booking | null>(stateBooking);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchRoom = async () => {
      if (!booking?.roomId) return;

      try {
        const roomData = await api.getRoomById(booking.roomId);
        setRoom(roomData);
      } catch {
        setError("Unable to load room details.");
      }
    };

    const init = async () => {
      if (!booking) {
        setError("Booking not found. Please try again.");
        setLoading(false);
        return;
      }

      await fetchRoom();

      timer = setTimeout(() => {
        setVerifying(false);
        setLoading(false);
      }, 1600);
    };

    init();
    return () => clearTimeout(timer);
  }, [booking]);

  /* =========================
     CINEMATIC LOADER
  ========================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center space-y-12 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 animate-pulse"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-32 h-32 md:w-48 md:h-48 mb-8">
            <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-2 border border-primary/40 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
            <div className="absolute inset-4 border-t-2 border-primary rounded-full animate-spin"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-primary rounded-sm flex items-center justify-center text-black font-black text-2xl md:text-4xl shadow-[0_0_50px_rgba(234,179,8,0.3)] animate-luxury-logo">
                M
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-sm mx-auto">
            <h2 className="serif-font text-3xl md:text-4xl text-white italic tracking-tight">
              Identity Verification
            </h2>

            <div className="flex flex-col gap-2">
              <p className="text-primary text-[9px] uppercase tracking-[0.6em] font-black animate-pulse">
                Establishing Secure Handshake...
              </p>

              <div className="w-48 h-[1px] bg-white/5 mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-primary w-1/3 animate-[shimmer_2s_infinite_linear]"></div>
              </div>
            </div>

            <p className="text-gray-600 text-[8px] uppercase tracking-[0.3em] mt-4 font-bold opacity-40">
              {verifying
                ? "DECRYPTING REGISTRY FRAGMENTS..."
                : "ACCESS GRANTED. INITIALIZING VIEW..."}
            </p>
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================== */

  if (error) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center space-y-12">
        <div className="w-24 h-24 bg-red-500/5 border border-red-500/20 rounded-full flex items-center justify-center text-red-500">
          <span className="material-symbols-outlined text-5xl">lock_open</span>
        </div>

        <div className="space-y-4">
          <h1 className="serif-font text-5xl text-white italic">
            Access <span className="text-red-500">Denied</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black max-w-sm mx-auto leading-loose">
            {error}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            to="/profile"
            className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] rounded-sm transition-all"
          >
            Go to Profile
          </Link>
          <Link
            to="/"
            className="bg-primary text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] rounded-sm shadow-2xl active:scale-95 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  /* =========================
     SUCCESS VIEW
  ========================== */

  return (
    <div className="min-h-screen bg-background-dark pt-32 md:pt-48 pb-20 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto space-y-16 md:space-y-20">
        <header className="text-center space-y-8">
          <div className="w-20 h-20 md:w-32 md:h-32 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-2xl animate-luxury-logo">
            <span className="material-symbols-outlined text-4xl md:text-6xl">
              verified
            </span>
          </div>
          <h1 className="serif-font text-5xl md:text-8xl lg:text-[9rem] text-white italic leading-[1.1]">
            Secured
          </h1>
          <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-[0.6em] font-black opacity-60">
            Reservation validated and active
          </p>
        </header>

        <div className="bg-surface-dark border border-white/5 rounded-sm overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4 bg-black p-8 md:p-12 space-y-10 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between">
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-black font-black">
                    M
                  </div>
                  <span className="accent-font tracking-widest text-xl font-bold text-white">
                    MOORE
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-10">
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-black">
                  <span className="text-gray-600">BOOKING CODE</span>
                  <span className="text-white tracking-[0.2em]">
                    {booking?.bookingCode}
                  </span>
                </div>
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-black">
                  <span className="text-gray-600">GATEWAY STATUS</span>
                  <span className="text-primary italic">AUTHORISED</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 p-8 md:p-16 space-y-12">
              <h2 className="serif-font text-5xl md:text-7xl text-white italic">
                Suite {room?.roomNumber || "—"}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6 py-12 border-y border-white/5">
                <div>
                  <p className="text-gray-600 text-[8px] uppercase tracking-[0.3em] font-black">
                    Check-in
                  </p>
                  <p className="text-white font-bold italic">
                    {booking?.checkIn
                      ? new Date(booking.checkIn).toDateString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-[8px] uppercase tracking-[0.3em] font-black">
                    Check-out
                  </p>
                  <p className="text-white font-bold italic">
                    {booking?.checkOut
                      ? new Date(booking.checkOut).toDateString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-[8px] uppercase tracking-[0.3em] font-black">
                    Status
                  </p>
                  <p className="text-primary font-black italic uppercase">
                    {booking?.status}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <span className="serif-font text-6xl text-primary italic">
                  ₦{booking?.amount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Link
            to="/profile"
            className="bg-primary text-black px-12 py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.4em]"
          >
            Manage Identity
          </Link>
          <Link
            to="/"
            className="border border-white/10 text-white px-12 py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.4em]"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
