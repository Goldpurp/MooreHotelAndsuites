
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ApplicationUser, 
  StatsResponse, 
  Booking, 
  AnalyticsOverview, 
  AuditLog, 
  VisitRecord, 
  BookingStatus 
} from '../types';

interface AdminDashboardProps {
  user: ApplicationUser;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'security' | 'audit'>('overview');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [s, b, a, logs, visits] = await Promise.all([
          api.getAdminStats(),
          api.getAllBookings(),
          api.getAnalyticsOverview(),
          api.getAuditLogs(),
          api.getVisitRecords()
        ]);
        setStats(s);
        setBookings(b);
        setAnalytics(a);
        setAuditLogs(logs);
        setVisitRecords(visits);
      } catch (err) {
        console.error("Admin data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: BookingStatus) => {
    try {
      const updated = await api.updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      alert(`Booking transitioned to ${newStatus}`);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-40 flex justify-center text-primary tracking-[0.5em] animate-pulse">
      AUTHENTICATING ERP ACCESS...
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 md:px-10 min-h-screen bg-background-dark">
      <div className="max-w-[1800px] mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-primary">
              <span className="w-12 h-px bg-primary"></span>
              <p className="text-[10px] uppercase tracking-[0.6em] font-black">Management Portal</p>
            </div>
            <h1 className="serif-font text-5xl md:text-8xl text-white italic">Operational <span className="text-primary">Intelligence</span></h1>
          </div>
          <div className="flex gap-4">
            {['overview', 'bookings', 'security', 'audit'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-primary text-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface-dark border border-white/5 p-10 space-y-4">
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Active Accounts</p>
              <p className="text-5xl text-white font-bold">{stats?.activeAccounts || 0}</p>
            </div>
            <div className="bg-surface-dark border border-white/5 p-10 space-y-4">
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Total Revenue</p>
              <p className="text-5xl text-primary font-bold">₦{(stats?.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-surface-dark border border-white/5 p-10 space-y-4">
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Occupancy</p>
              <p className="text-5xl text-white font-bold">{stats?.occupancyRate || 0}%</p>
            </div>
            <div className="bg-surface-dark border border-white/5 p-10 space-y-4">
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Suspended</p>
              <p className="text-5xl text-red-500/50 font-bold">{stats?.suspendedAccounts || 0}</p>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-surface-dark border border-white/5 rounded-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-[10px] font-black uppercase tracking-widest text-gray-600 border-b border-white/5">
                <tr>
                  <th className="px-8 py-6">Code</th>
                  <th className="px-8 py-6">In / Out</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Payment</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-400">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6 font-mono text-primary">{b.bookingCode}</td>
                    <td className="px-8 py-6">
                      {new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest ${
                        b.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-white/5'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs">{b.paymentStatus}</td>
                    <td className="px-8 py-6 text-right space-x-4">
                      {b.status === 'Confirmed' && (
                        <button 
                          onClick={() => handleStatusUpdate(b.id, BookingStatus.CheckedIn)}
                          className="text-primary text-[10px] font-black uppercase tracking-widest hover:text-white"
                        >
                          Check In
                        </button>
                      )}
                      {b.status === 'CheckedIn' && (
                        <button 
                          onClick={() => handleStatusUpdate(b.id, BookingStatus.CheckedOut)}
                          className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-white"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-surface-dark border border-white/5 p-10 space-y-8">
              <h3 className="serif-font text-3xl italic text-white">Physical Access Trail</h3>
              <div className="space-y-4">
                {visitRecords.map((v, i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                    <div className="space-y-1">
                      <p className="text-white font-bold">{v.bookingCode}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest">Authorized by: {v.authorizedBy}</p>
                    </div>
                    <p className="text-xs text-gray-500">{new Date(v.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-surface-dark border border-white/5 p-10 space-y-8">
            <h3 className="serif-font text-3xl italic text-white">System Integrity Log</h3>
            <div className="space-y-2">
              {auditLogs.map((log, i) => (
                <div key={i} className="p-4 bg-black/20 text-xs border-l-2 border-primary/20 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-primary uppercase tracking-widest font-black">{log.action}</span>
                    <span className="text-gray-600">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[10px] opacity-40 italic">
                    <p className="truncate">Prev: {log.oldDataJson}</p>
                    <p className="truncate">Next: {log.newDataJson}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
