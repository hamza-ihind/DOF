'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  KeyRound, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  Calendar, 
  Search, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import ImageUploadInput from '@/components/ImageUploadInput';

interface Member {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
  bio: string;
  location: string;
  tier: 1 | 2 | 3;
}

interface EventItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  location: string;
  imageUrl: string;
  excerpt: string;
  content: string;
  impactSummary: string;
  contributingMemberIds?: number[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'events'>('members');

  // Auth form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data state
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filter state
  const [memberSearch, setMemberSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');

  // Member Modal State
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    photoUrl: '/images/member_1.jpg',
    bio: '',
    location: 'Biougra, Morocco',
    tier: 3 as 1 | 2 | 3
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'member' | 'event'; id: number; name: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/admin/check');
      const data = await res.json();
      setIsAuthenticated(data.authenticated === true);
      if (data.authenticated) {
        fetchDashboardData();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const [membersRes, eventsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/events')
      ]);

      const membersData = await membersRes.json();
      const eventsData = await eventsRes.json();

      if (membersData.success) setMembers(membersData.members);
      if (eventsData.success) setEvents(eventsData.events);
    } catch (err) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        showToast('Welcome back, Admin!');
        fetchDashboardData();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
      showToast('Logged out successfully');
    } catch {
      showToast('Logout failed', 'error');
    }
  };

  // --- Member Handlers ---
  const openAddMemberModal = () => {
    setEditingMember(null);
    setMemberForm({
      name: '',
      role: '',
      photoUrl: '/images/member_1.jpg',
      bio: '',
      location: 'Biougra, Morocco',
      tier: 3
    });
    setMemberModalOpen(true);
  };

  const openEditMemberModal = (member: Member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role: member.role,
      photoUrl: member.photoUrl,
      bio: member.bio || '',
      location: member.location || 'Biougra, Morocco',
      tier: member.tier || 3
    });
    setMemberModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        const res = await fetch('/api/members', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingMember.id, ...memberForm })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Member "${memberForm.name}" updated!`);
          fetchDashboardData();
          setMemberModalOpen(false);
        } else {
          showToast(data.error || 'Failed to update member', 'error');
        }
      } else {
        const res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberForm)
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Member "${memberForm.name}" added successfully!`);
          fetchDashboardData();
          setMemberModalOpen(false);
        } else {
          showToast(data.error || 'Failed to add member', 'error');
        }
      }
    } catch (err) {
      showToast('Network error while saving member', 'error');
    }
  };

  const handleDeleteMember = async (id: number) => {
    try {
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Member deleted successfully');
        fetchDashboardData();
      } else {
        showToast('Failed to delete member', 'error');
      }
    } catch (err) {
      showToast('Network error during member deletion', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Event deleted successfully');
        fetchDashboardData();
      } else {
        showToast('Failed to delete event', 'error');
      }
    } catch (err) {
      showToast('Network error during event deletion', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Loading screen during auth check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0a4f6c] dark:border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN MATCHING WEBSITE BRANDING ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 relative transition-colors duration-300">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0a4f6c] dark:bg-blue-600 flex items-center justify-center shadow-lg ring-4 ring-slate-200 dark:ring-slate-800">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#0a4f6c] dark:text-sky-400 tracking-tight">
            Defenders <span className="text-[#aa1c34] dark:text-red-400">of Future</span>
          </h2>
          <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Admin Authentication Control
          </p>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-800 py-6 px-6 shadow-xl border border-slate-200 dark:border-slate-700 rounded-2xl sm:px-8 transition-colors">
            <form className="space-y-4" onSubmit={handleLogin}>
              {loginError && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-3 text-xs font-semibold text-red-600 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="block w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] dark:hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Sign In to Control Panel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Filter Members & Events
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
    m.role.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.location.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(eventSearch.toLowerCase()) || 
    e.category.toLowerCase().includes(eventSearch.toLowerCase()) ||
    e.location.toLowerCase().includes(eventSearch.toLowerCase())
  );

  // --- ADMIN DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-700 dark:border-emerald-800' 
            : 'bg-red-600 dark:bg-red-700 text-white border-red-700 dark:border-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Container - Full Website Width */}
      <main className="flex-1 wide-container py-4 space-y-4">
        
        {/* Dashboard Title & Tab Selection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a4f6c] dark:text-sky-400 tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Manage association members, events, timeline days, and photo carousels.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'members'
                  ? 'bg-[#0a4f6c] dark:bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0a4f6c] dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              Members ({members.length})
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'events'
                  ? 'bg-[#aa1c34] dark:bg-red-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#aa1c34] dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Events ({events.length})
            </button>

          </div>
        </div>

        {/* --- MEMBERS TABLE VIEW --- */}
        {activeTab === 'members' && (
          <div className="space-y-3">
            {/* Search & Add Member */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search members by name, role, location..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <button
                onClick={openAddMemberModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] dark:hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New Member
              </button>
            </div>

            {/* MEMBERS DATA TABLE */}
            {loadingData ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                Loading members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No members found</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Add a new member to display in the table.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        <th className="py-2.5 px-3.5">Photo</th>
                        <th className="py-2.5 px-3.5">Member Name</th>
                        <th className="py-2.5 px-3.5">Role / Position</th>
                        <th className="py-2.5 px-3.5">Board Tier</th>
                        <th className="py-2.5 px-3.5">Location</th>
                        <th className="py-2.5 px-3.5">Biography</th>
                        <th className="py-2.5 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-2.5 px-3.5">
                            <img
                              src={member.photoUrl}
                              alt={member.name}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute('src', '/images/member_1.jpg');
                              }}
                            />
                          </td>
                          <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-slate-100">
                            {member.name}
                          </td>
                          <td className="py-2.5 px-3.5 font-semibold text-[#0a4f6c] dark:text-sky-300">
                            {member.role}
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              member.tier === 1 
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800' 
                                : member.tier === 2 
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                            }`}>
                              {member.tier === 1 ? 'Level 1: Exec' : member.tier === 2 ? 'Level 2: Lead' : 'Level 3: Team'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300 font-medium">
                            {member.location || 'Biougra'}
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                            {member.bio || '—'}
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditMemberModal(member)}
                                className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-slate-200 dark:border-slate-600"
                              >
                                <Pencil className="w-3.5 h-3.5 text-[#0a4f6c] dark:text-sky-300" />
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'member', id: member.id, name: member.name })}
                                className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-[#aa1c34] dark:text-red-300 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-red-200 dark:border-red-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- EVENTS VIEW --- */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            {/* Search & Route to New Event Page */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events by title, category..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#aa1c34] dark:focus:border-red-400 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <Link
                href="/admin/events/new"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-[#aa1c34] dark:bg-red-700 hover:bg-[#7d1224] dark:hover:bg-red-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Create New Event Mission
              </Link>
            </div>

            {/* EVENTS TABLE */}
            {loadingData ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                Loading events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No events found</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create a new event mission to manage multi-day content.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        <th className="py-2.5 px-3.5">Cover</th>
                        <th className="py-2.5 px-3.5">Event Title</th>
                        <th className="py-2.5 px-3.5">Category</th>
                        <th className="py-2.5 px-3.5">Date</th>
                        <th className="py-2.5 px-3.5">Location</th>
                        <th className="py-2.5 px-3.5">Impact Tag</th>
                        <th className="py-2.5 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                      {filteredEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-2.5 px-3.5">
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-12 h-9 rounded-md object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute('src', '/images/school_renovation.jpg');
                              }}
                            />
                          </td>
                          <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-slate-100 max-w-xs">
                            {event.title}
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className="inline-block text-[10px] font-extrabold bg-[#0a4f6c]/10 dark:bg-sky-950/60 text-[#0a4f6c] dark:text-sky-300 px-2.5 py-0.5 rounded-md border border-[#0a4f6c]/20 dark:border-sky-800/50">
                              {event.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {event.date}
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300 font-medium">
                            {event.location}
                          </td>
                          <td className="py-2.5 px-3.5 text-[#aa1c34] dark:text-red-400 font-semibold text-[11px] truncate max-w-xs">
                            {event.impactSummary || '—'}
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/events/${event.id}/edit`}
                                className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-slate-200 dark:border-slate-600"
                              >
                                <Pencil className="w-3.5 h-3.5 text-[#0a4f6c] dark:text-sky-300" />
                                Edit
                              </Link>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'event', id: event.id, name: event.title })}
                                className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-[#aa1c34] dark:text-red-300 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-red-200 dark:border-red-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* --- ADD / EDIT MEMBER MODAL --- */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transition-colors">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <h3 className="font-bold text-sm text-[#0a4f6c] dark:text-sky-300">
                {editingMember ? 'Edit Member Details' : 'Add New Member'}
              </h3>
              <button onClick={() => setMemberModalOpen(false)} className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Member Name *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    placeholder="e.g. Youssef El Amrani"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Role / Position *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    placeholder="e.g. President & Field Lead"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Board Level Tier</label>
                  <select
                    value={memberForm.tier}
                    onChange={(e) => setMemberForm({ ...memberForm, tier: Number(e.target.value) as 1 | 2 | 3 })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                  >
                    <option value={1}>Level 1: Executive Board</option>
                    <option value={2}>Level 2: Project Directors</option>
                    <option value={3}>Level 3: Field Team & Volunteers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Location</label>
                  <input
                    type="text"
                    value={memberForm.location}
                    onChange={(e) => setMemberForm({ ...memberForm, location: e.target.value })}
                    placeholder="Biougra, Morocco"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                  />
                </div>
              </div>

              {/* INTEGRATED UPLOADTHING & FILE UPLOADER */}
              <ImageUploadInput
                label="Member Photo (UploadThing / File / URL)"
                value={memberForm.photoUrl}
                onChange={(url) => setMemberForm({ ...memberForm, photoUrl: url })}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Biography / Overview</label>
                <textarea
                  rows={3}
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                  placeholder="Describe member background and responsibilities..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                />
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] dark:hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-sm p-5 text-center shadow-2xl space-y-3 transition-colors">
            <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center mx-auto text-[#aa1c34] dark:text-red-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">Confirm Deletion</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Are you sure you want to delete <span className="text-[#aa1c34] dark:text-red-400 font-bold">"{deleteConfirm.name}"</span>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'member') handleDeleteMember(deleteConfirm.id);
                  else handleDeleteEvent(deleteConfirm.id);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#aa1c34] dark:bg-red-700 hover:bg-[#7d1224] dark:hover:bg-red-800 text-white text-xs font-bold flex-1 shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
