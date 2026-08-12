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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0a4f6c] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-xs font-semibold">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN MATCHING WEBSITE BRANDING ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl bg-[#0a4f6c] flex items-center justify-center shadow-lg ring-4 ring-slate-200">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[#0a4f6c] tracking-tight">
            Defenders <span className="text-[#aa1c34]">of Future</span>
          </h2>
          <p className="mt-1 text-center text-xs text-slate-600 font-semibold uppercase tracking-wider">
            Admin Authentication Control
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 rounded-2xl sm:px-10">
            <form className="space-y-5" onSubmit={handleLogin}>
              {loginError && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-600 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a4f6c] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0a4f6c] hover:bg-[#083c53] shadow-md transition-all disabled:opacity-50"
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

            <div className="mt-6 pt-5 border-t border-slate-200 text-center">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Credentials file path: <br />
                <code className="text-slate-700 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">src/lib/adminConfig.ts</code>
              </p>
            </div>
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-600 text-white border-emerald-700' 
            : 'bg-red-600 text-white border-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Container - Full Website Width */}
      <main className="flex-1 wide-container py-8 space-y-6">
        
        {/* Dashboard Title & Tab Selection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0a4f6c] tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-xs text-slate-500 font-semibold">Manage association members, events, timeline days, and photo carousels.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'members'
                  ? 'bg-[#0a4f6c] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-[#0a4f6c] border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Members Table ({members.length})
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'events'
                  ? 'bg-[#aa1c34] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-[#aa1c34] border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Events ({events.length})
            </button>
          </div>
        </div>

        {/* --- MEMBERS TABLE VIEW --- */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            {/* Search & Add Member */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search members by name, role, location..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
                />
              </div>

              <button
                onClick={openAddMemberModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0a4f6c] hover:bg-[#083c53] text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New Member
              </button>
            </div>

            {/* MEMBERS DATA TABLE */}
            {loadingData ? (
              <div className="py-16 text-center text-slate-500 text-xs font-semibold bg-white rounded-xl border border-slate-200">
                Loading members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">No members found</p>
                <p className="text-xs text-slate-500 mt-1">Add a new member to display in the table.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        <th className="py-3 px-4">Photo</th>
                        <th className="py-3 px-4">Member Name</th>
                        <th className="py-3 px-4">Role / Position</th>
                        <th className="py-3 px-4">Board Tier</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Biography</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {filteredMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <img
                              src={member.photoUrl}
                              alt={member.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-100"
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute('src', '/images/member_1.jpg');
                              }}
                            />
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {member.name}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#0a4f6c]">
                            {member.role}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              member.tier === 1 
                                ? 'bg-amber-50 text-amber-700 border-amber-300' 
                                : member.tier === 2 
                                ? 'bg-blue-50 text-blue-700 border-blue-300' 
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}>
                              {member.tier === 1 ? 'Level 1: Exec' : member.tier === 2 ? 'Level 2: Lead' : 'Level 3: Team'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            {member.location || 'Biougra'}
                          </td>
                          <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                            {member.bio || '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditMemberModal(member)}
                                className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-slate-200"
                              >
                                <Pencil className="w-3.5 h-3.5 text-[#0a4f6c]" />
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'member', id: member.id, name: member.name })}
                                className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-[#aa1c34] font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-red-200"
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
          <div className="space-y-4">
            {/* Search & Route to New Event Page */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events by title, category..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#aa1c34] focus:bg-white"
                />
              </div>

              <Link
                href="/admin/events/new"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#aa1c34] hover:bg-[#7d1224] text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Create New Event Mission
              </Link>
            </div>

            {/* EVENTS TABLE */}
            {loadingData ? (
              <div className="py-16 text-center text-slate-500 text-xs font-semibold bg-white rounded-xl border border-slate-200">
                Loading events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">No events found</p>
                <p className="text-xs text-slate-500 mt-1">Create a new event mission to manage multi-day content.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        <th className="py-3 px-4">Cover</th>
                        <th className="py-3 px-4">Event Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Impact Tag</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {filteredEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-12 h-9 rounded-md object-cover border border-slate-200 bg-slate-100"
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute('src', '/images/school_renovation.jpg');
                              }}
                            />
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">
                            {event.title}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block text-[10px] font-extrabold bg-[#0a4f6c]/10 text-[#0a4f6c] px-2.5 py-0.5 rounded-md border border-[#0a4f6c]/20">
                              {event.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {event.date}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">
                            {event.location}
                          </td>
                          <td className="py-3 px-4 text-[#aa1c34] font-semibold text-[11px] truncate max-w-xs">
                            {event.impactSummary || '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/events/${event.id}/edit`}
                                className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-slate-200"
                              >
                                <Pencil className="w-3.5 h-3.5 text-[#0a4f6c]" />
                                Edit
                              </Link>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'event', id: event.id, name: event.title })}
                                className="p-1.5 rounded-md bg-red-50 hover:bg-red-100 text-[#aa1c34] font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-red-200"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-[#0a4f6c]">
                {editingMember ? 'Edit Member Details' : 'Add New Member'}
              </h3>
              <button onClick={() => setMemberModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase text-[11px]">Member Name *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    placeholder="e.g. Youssef El Amrani"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase text-[11px]">Role / Position *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    placeholder="e.g. President & Field Lead"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase text-[11px]">Board Level Tier</label>
                  <select
                    value={memberForm.tier}
                    onChange={(e) => setMemberForm({ ...memberForm, tier: Number(e.target.value) as 1 | 2 | 3 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#0a4f6c]"
                  >
                    <option value={1}>Level 1: Executive Board</option>
                    <option value={2}>Level 2: Project Directors</option>
                    <option value={3}>Level 3: Field Team & Volunteers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase text-[11px]">Location</label>
                  <input
                    type="text"
                    value={memberForm.location}
                    onChange={(e) => setMemberForm({ ...memberForm, location: e.target.value })}
                    placeholder="Biougra, Morocco"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
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
                <label className="block text-slate-700 font-bold mb-1 uppercase text-[11px]">Biography / Overview</label>
                <textarea
                  rows={3}
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                  placeholder="Describe member background and responsibilities..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0a4f6c] hover:bg-[#083c53] text-white font-bold shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-[#aa1c34]">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Confirm Deletion</h4>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to delete <span className="text-[#aa1c34] font-bold">"{deleteConfirm.name}"</span>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'member') handleDeleteMember(deleteConfirm.id);
                  else handleDeleteEvent(deleteConfirm.id);
                }}
                className="px-4 py-2 rounded-lg bg-[#aa1c34] hover:bg-[#7d1224] text-white text-xs font-bold flex-1 shadow-md"
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
