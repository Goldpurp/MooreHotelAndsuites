import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { ApplicationUser, Booking } from "../types";

interface ProfileProps {
  user: ApplicationUser;
  onLogout: () => void;
}

type Tab = "identity" | "history" | "settings";

const Profile: React.FC<ProfileProps> = ({ user: initialUser, onLogout }) => {
  const [user, setUser] = useState<ApplicationUser>(initialUser);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("identity");
  const [updating, setUpdating] = useState(false);

  const [settingsData, setSettingsData] = useState({
    name: initialUser.name || "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const me = await api.getMe();
        setUser(me);
      } catch {
        onLogout();
      }
    };

    fetchProfile();
  }, [onLogout]);

  useEffect(() => {
    setSettingsData((prev) => ({
      ...prev,
      name: user.name || "",
    }));
  }, [user.name]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await api.getMyBookings();
        setBookings(history);
      } catch {
        setBookings([]);
      }
    };

    fetchHistory();
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      settingsData.password &&
      settingsData.password !== settingsData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    setUpdating(true);

    try {
      const updated = await api.updateMe({
        name: settingsData.name,
        password: settingsData.password || undefined,
      });

      setUser(updated);
      alert("Account updated successfully.");

      setSettingsData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err: any) {
      alert(err.message || "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-10 min-h-screen bg-background-dark">
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="space-y-8">
            <div className="p-6 bg-surface-dark border border-white/5 rounded-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg">
                {user.name?.slice(0, 2).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="serif-font text-white truncate italic">
                  {user.name || "Guest"}
                </h2>

                <p className="text-[9px] text-gray-500 uppercase tracking-widest truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {(["identity", "history", "settings"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full px-6 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest transition ${
                    activeTab === tab
                      ? "bg-primary text-black"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}

              <button
                onClick={onLogout}
                className="w-full px-6 py-4 text-red-500/60 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/5"
              >
                Exit
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Identity */}
          {activeTab === "identity" && (
            <div className="space-y-12">
              <h1 className="serif-font text-5xl md:text-8xl text-white italic">
                My <span className="text-primary">Identity</span>
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface-dark border border-white/5 p-10">
                  <p className="text-[9px] uppercase tracking-widest text-gray-600 font-black">
                    Full Legal Name
                  </p>
                  <p className="text-2xl text-white italic">{user.name}</p>
                </div>

                <div className="bg-surface-dark border border-white/5 p-10">
                  <p className="text-[9px] uppercase tracking-widest text-gray-600 font-black">
                    Email Registry
                  </p>
                  <p className="text-2xl text-white italic">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {/* History */}
          {activeTab === "history" && (
            <div className="space-y-12">
              <h1 className="serif-font text-5xl md:text-8xl text-white italic">
                Stay <span className="text-primary">History</span>
              </h1>

              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-surface-dark border border-white/5 p-8 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-primary text-[10px] font-black uppercase tracking-widest">
                        {b.bookingCode}
                      </p>
                      <h4 className="serif-font text-2xl text-white italic">
                        {b.status}
                      </h4>
                      <p className="text-gray-400 text-sm mt-2">
                        {b.checkIn
                          ? new Date(b.checkIn).toLocaleDateString()
                          : "No check-in date"}
                        {" - "}
                        {b.checkOut
                          ? new Date(b.checkOut).toLocaleDateString()
                          : "No check-out date"}
                      </p>

                      {b.status === "Pending" && (
                        <h4 className="text-md text-white">
                          {b.notes}
                        </h4>
                      )}
                    </div>

                    <p className="text-xl text-white font-bold italic">
                      ₦{b.amount.toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No historical records found.
                </p>
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-12">
              <h1 className="serif-font text-5xl md:text-8xl text-white italic">
                Account <span className="text-primary">Settings</span>
              </h1>

              <form
                onSubmit={handleUpdateSettings}
                className="bg-surface-dark border border-white/5 p-10 space-y-8 max-w-3xl"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    value={settingsData.name}
                    onChange={(e) =>
                      setSettingsData({ ...settingsData, name: e.target.value })
                    }
                    placeholder="Full Name"
                    className="bg-white/5 border border-white/10 p-4 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="password"
                    value={settingsData.password}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        password: e.target.value,
                      })
                    }
                    placeholder="New Password"
                    className="bg-white/5 border border-white/10 p-4 text-white"
                  />
                  <input
                    type="password"
                    value={settingsData.confirmPassword}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm Password"
                    className="bg-white/5 border border-white/10 p-4 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="bg-primary text-black px-10 py-4 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                >
                  {updating ? "Processing..." : "Save Settings"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
