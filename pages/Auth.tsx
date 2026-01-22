import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ApplicationUser } from "../types";

interface AuthProps {
  onLogin: (user: ApplicationUser, token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let res;
      if (isRegister) {
        res = await api.register(formData);
        setSuccess("Registration successful. Welcome to Moore Hotels.");
      } else {
        res = await api.login({
          email: formData.email,
          password: formData.password,
        });
      }

      const user = await api.getMe();

      if (res && res.token) {
        onLogin(user, res.token);
        navigate("/profile");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background-dark">
      {/* Desktop Image Panel */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1920"
          className="w-full h-full object-cover grayscale brightness-50"
          alt="Luxury Interior"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-20 text-center space-y-8">
          <div className="w-24 h-24 bg-primary rounded-sm flex items-center justify-center text-black font-black text-5xl shadow-2xl">
            M
          </div>
          <div className="space-y-4">
            <h2 className="serif-font text-6xl text-white italic">Sanctuary Awaits</h2>
            <p className="text-gray-400 text-sm uppercase tracking-[0.4em] font-light max-w-sm mx-auto leading-loose">
              Exclusive access to Lagos' most prestigious private collection of suites and services.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative z-30">
        <div className="w-full max-w-md space-y-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center space-y-6 mb-12">
            <div className="w-16 h-16 bg-primary rounded-sm flex items-center justify-center text-black font-black text-3xl shadow-2xl">
              M
            </div>
            <h1 className="serif-font text-4xl text-white italic">
              {isRegister ? "Join" : "Welcome"}
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="serif-font text-4xl text-white italic hidden lg:block">
              {isRegister ? "Begin Your Story" : "Verify Identity"}
            </h2>
            <p className="text-gray-500 text-[9px] uppercase tracking-[0.5em] font-black italic">
              {isRegister
                ? "Identify yourself for a tailored residency"
                : "Provide your credentials to access the vault"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/10 text-red-500 p-5 rounded-sm text-[11px] flex items-start gap-4">
              <span className="material-symbols-outlined text-sm pt-0.5">error</span>
              <p className="font-medium italic leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/5 border border-green-500/10 text-green-500 p-5 rounded-sm text-[11px] flex items-start gap-4">
              <span className="material-symbols-outlined text-sm pt-0.5">check_circle</span>
              <p className="font-medium italic leading-relaxed">{success}</p>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">
                      First Name
                    </label>
                    <input
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-5 py-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-gray-800 font-light italic"
                      placeholder="First"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">
                      Last Name
                    </label>
                    <input
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-5 py-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-gray-800 font-light italic"
                      placeholder="Last"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">
                    Identity Contact (Phone)
                  </label>
                  <input
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-5 py-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-gray-800 font-light italic"
                    placeholder="+234 ..."
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">
                Email Registry
              </label>
              <input
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-5 py-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-gray-800 font-light italic"
                placeholder="concierge@moore.com"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-600 ml-1">
                Access Key
              </label>
              <input
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-5 py-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-gray-800"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-500 text-black font-black py-4.5 rounded-sm transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 group disabled:opacity-50 active:scale-95 h-14"
            >
              <span className="text-[10px] uppercase tracking-[0.4em]">
                {loading ? "AUTHENTICATING..." : isRegister ? "ESTABLISH IDENTITY" : "VERIFY ACCESS"}
              </span>
              {!loading && (
                <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-2">
                  arrow_right_alt
                </span>
              )}
            </button>
          </form>

          <div className="pt-6 text-center text-[9px] uppercase tracking-[0.2em] font-black border-t border-white/5">
            <span className="text-gray-700">
              {isRegister ? "EXISTING MEMBER?" : "NEW TO ANTHOLOGY?"}
            </span>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary hover:text-white ml-3 transition-colors border-b border-primary/20 pb-0.5 italic"
            >
              {isRegister ? "SIGN IN" : "JOIN CIRCLE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
