'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  EyeOff,
  Receipt,
  FileSpreadsheet,
  Download,
  Coins,
  TrendingUp,
  HeartHandshake,
  Check
} from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import ImageUploadInput from '@/components/ImageUploadInput';

interface Member {
  id: number;
  name: string;
  role: string;
  roleEn?: string;
  roleFr?: string;
  photoUrl: string;
  bio: string;
  bioEn?: string;
  bioFr?: string;
  location: string;
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

interface Transaction {
  id: number;
  memberId?: number | null;
  memberName: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'events' | 'transactions'>('members');

  // Auth form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data state
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filter state
  const [memberSearch, setMemberSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');

  // Member Modal State
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    photoUrl: '/images/member_1.jpg',
    bio: '',
    location: 'Biougra, Morocco'
  });

  // Transaction Modal State
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [memberSelectSearch, setMemberSelectSearch] = useState('');
  const [transactionForm, setTransactionForm] = useState({
    memberId: null as number | null,
    memberName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'member' | 'event' | 'transaction'; id: number; name: string } | null>(null);
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
      const [membersRes, eventsRes, transactionsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/events'),
        fetch('/api/transactions')
      ]);

      const membersData = await membersRes.json();
      const eventsData = await eventsRes.json();
      const transactionsData = await transactionsRes.json();

      if (membersData.success) setMembers(membersData.members);
      if (eventsData.success) setEvents(eventsData.events);
      if (transactionsData.success) setTransactions(transactionsData.transactions);
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
      location: 'Biougra, Morocco'
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
      location: member.location || 'Biougra, Morocco'
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

  // --- Event Handlers ---
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

  // --- Transaction Handlers ---
  const openAddTransactionModal = () => {
    setEditingTransaction(null);
    setMemberSelectSearch('');
    setTransactionForm({
      memberId: members.length > 0 ? members[0].id : null,
      memberName: members.length > 0 ? members[0].name : '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setTransactionModalOpen(true);
  };

  const openEditTransactionModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setMemberSelectSearch('');
    setTransactionForm({
      memberId: tx.memberId || null,
      memberName: tx.memberName,
      amount: String(tx.amount),
      date: tx.date,
      notes: tx.notes || ''
    });
    setTransactionModalOpen(true);
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionForm.memberName) {
      showToast('Please select a donator member from DOF', 'error');
      return;
    }
    const numAmount = Number(transactionForm.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid donation amount', 'error');
      return;
    }

    try {
      if (editingTransaction) {
        const res = await fetch('/api/transactions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingTransaction.id,
            memberId: transactionForm.memberId,
            memberName: transactionForm.memberName,
            amount: numAmount,
            date: transactionForm.date,
            notes: transactionForm.notes
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Transaction for ${transactionForm.memberName} updated!`);
          fetchDashboardData();
          setTransactionModalOpen(false);
        } else {
          showToast(data.error || 'Failed to update transaction', 'error');
        }
      } else {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId: transactionForm.memberId,
            memberName: transactionForm.memberName,
            amount: numAmount,
            date: transactionForm.date,
            notes: transactionForm.notes
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Charity donation of ${numAmount} MAD recorded!`);
          fetchDashboardData();
          setTransactionModalOpen(false);
        } else {
          showToast(data.error || 'Failed to add transaction', 'error');
        }
      }
    } catch (err) {
      showToast('Network error while saving transaction', 'error');
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      const res = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Transaction deleted successfully');
        fetchDashboardData();
      } else {
        showToast('Failed to delete transaction', 'error');
      }
    } catch (err) {
      showToast('Network error during transaction deletion', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // --- Export to Excel Handler ---
  const exportTransactionsToExcel = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export', 'error');
      return;
    }

    const dataToExport = transactions.map((t, index) => ({
      'No.': index + 1,
      'Transaction ID': `DOF-TX-${String(t.id).padStart(4, '0')}`,
      'Donator (DOF Member)': t.memberName,
      'Amount (MAD)': t.amount,
      'Date': t.date,
      'Notes / Purpose': t.notes || 'General Charity Contribution',
      'Recorded At': t.createdAt ? new Date(t.createdAt).toLocaleString('fr-FR') : '—'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DOF Transactions');

    // Set column widths for readability
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 28 },
      { wch: 15 },
      { wch: 14 },
      { wch: 36 },
      { wch: 22 }
    ];

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `DOF_Charity_Transactions_${today}.xlsx`);
    showToast('Excel report downloaded successfully!');
  };

  // Filtered lists
  const filteredMembers = useMemo(() => {
    const q = memberSearch.toLowerCase();
    return members.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.role.toLowerCase().includes(q) || 
      (m.location && m.location.toLowerCase().includes(q))
    );
  }, [members, memberSearch]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.toLowerCase();
    return events.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.category.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    );
  }, [events, eventSearch]);

  const filteredTransactions = useMemo(() => {
    const q = transactionSearch.toLowerCase();
    return transactions.filter(t => 
      t.memberName.toLowerCase().includes(q) || 
      (t.notes && t.notes.toLowerCase().includes(q)) ||
      t.date.includes(q)
    );
  }, [transactions, transactionSearch]);

  // Filtered member dropdown in transaction modal
  const filteredSelectMembers = useMemo(() => {
    const q = memberSelectSearch.toLowerCase();
    if (!q) return members;
    return members.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q));
  }, [members, memberSelectSearch]);

  // Statistics calculation for transactions
  const totalAmountCollected = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const avgContribution = useMemo(() => {
    return transactions.length > 0 ? (totalAmountCollected / transactions.length) : 0;
  }, [transactions, totalAmountCollected]);

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

  // --- LOGIN SCREEN ---
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
                <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Administrator Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-2.5 px-4 bg-[#0a4f6c] hover:bg-[#083c53] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In to Control Panel'}
              </button>

              <div className="text-center pt-2">
                <Link href="/" className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#0a4f6c] dark:hover:text-sky-300">
                  ← Back to Public Website
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD CONTROL PANEL ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* Top Bar with Logout */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-30">
        <div className="wide-container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-[#0a4f6c] dark:text-sky-400 text-sm">Defenders of Future</span>
              <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                Admin Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0a4f6c] dark:hover:text-sky-300 transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-[#aa1c34] dark:text-red-300 text-xs font-bold transition-all border border-red-200 dark:border-red-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-bold transition-all animate-bounce ${
          toast.type === 'success'
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
            : 'bg-[#aa1c34] text-white border-red-500 shadow-red-500/20'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 wide-container py-4 space-y-4">
        
        {/* Dashboard Title & Tab Selection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a4f6c] dark:text-sky-400 tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Manage association members, event reports, timeline days, and charity transactions.
            </p>
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

            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'transactions'
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Receipt className="w-4 h-4" />
              TRANSACTIONS ({transactions.length})
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

        {/* --- TRANSACTIONS VIEW --- */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            
            {/* Statistics Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Charity Funds</p>
                  <p className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {totalAmountCollected.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0a4f6c] dark:text-sky-400 flex items-center justify-center font-bold">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Transactions</p>
                  <p className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
                    {transactions.length} donations
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Contribution</p>
                  <p className="text-lg sm:text-xl font-extrabold text-purple-600 dark:text-purple-400">
                    {avgContribution.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Bar: Search, Export Excel, Add Transaction */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by donator member, notes, date..."
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={exportTransactionsToExcel}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
                  title="Export all transactions to an Excel (.xlsx) spreadsheet"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export to Excel</span>
                </button>

                <button
                  onClick={openAddTransactionModal}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] dark:hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Transaction</span>
                </button>
              </div>
            </div>

            {/* TRANSACTIONS DATA TABLE */}
            {loadingData ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                Loading charity transactions...
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                <HeartHandshake className="w-10 h-10 mx-auto mb-2 text-slate-400 dark:text-slate-500" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No transactions recorded yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Record member donations to track association funds and export to Excel.</p>
                <button
                  onClick={openAddTransactionModal}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Transaction</span>
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        <th className="py-2.5 px-3.5">Ref ID</th>
                        <th className="py-2.5 px-3.5">Donator (DOF Member)</th>
                        <th className="py-2.5 px-3.5">Amount (MAD)</th>
                        <th className="py-2.5 px-3.5">Date</th>
                        <th className="py-2.5 px-3.5">Purpose / Notes</th>
                        <th className="py-2.5 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                      {filteredTransactions.map((tx) => {
                        const matchedMember = members.find(m => m.id === tx.memberId || m.name === tx.memberName);
                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="py-2.5 px-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                              #TX-{String(tx.id).padStart(4, '0')}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={matchedMember?.photoUrl || '/images/member_1.jpg'}
                                  alt={tx.memberName}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLElement).setAttribute('src', '/images/member_1.jpg');
                                  }}
                                />
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-slate-100">{tx.memberName}</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                    {matchedMember?.role || 'DOF Member'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3.5">
                              <span className="inline-block font-extrabold text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                                +{Number(tx.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                              {tx.date}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300 max-w-xs">
                              {tx.notes || <span className="text-slate-400 italic">Charity contribution</span>}
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditTransactionModal(tx)}
                                  className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-slate-200 dark:border-slate-600"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-[#0a4f6c] dark:text-sky-300" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ type: 'transaction', id: tx.id, name: `Transaction of ${tx.amount} MAD by ${tx.memberName}` })}
                                  className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-[#aa1c34] dark:text-red-300 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-red-200 dark:border-red-800"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <h3 className="font-extrabold text-[#0a4f6c] dark:text-sky-400 text-sm">
                {editingMember ? 'Edit Association Member' : 'Add New Member'}
              </h3>
              <button onClick={() => setMemberModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
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
                    placeholder="e.g. President"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                  />
                </div>
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

              <ImageUploadInput
                label="Member Photo (UploadThing / File / URL)"
                value={memberForm.photoUrl}
                onChange={(url) => setMemberForm({ ...memberForm, photoUrl: url })}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Biography / Quote</label>
                <textarea
                  rows={3}
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                  placeholder="Describe member background or quote..."
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
                  className="px-4 py-1.5 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] dark:hover:bg-blue-700 text-white font-bold"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT TRANSACTION MODAL WITH MEMBER SEARCH / DROPDOWN --- */}
      {transactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#0a4f6c] dark:text-sky-400 text-sm">
                  {editingTransaction ? 'Edit Charity Transaction' : 'Record New Charity Transaction'}
                </h3>
              </div>
              <button onClick={() => setTransactionModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-5 space-y-4 text-xs">
              
              {/* MEMBER SELECTION (SEARCH & DROPDOWN) */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                  Donator (Must be a DOF Member) *
                </label>
                
                {/* Search filter within members */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter DOF members..."
                    value={memberSelectSearch}
                    onChange={(e) => setMemberSelectSearch(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Member selection list */}
                <div className="max-h-36 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-700 bg-slate-50 dark:bg-slate-900">
                  {filteredSelectMembers.length === 0 ? (
                    <p className="p-3 text-center text-slate-400">No matching DOF members found.</p>
                  ) : (
                    filteredSelectMembers.map((m) => {
                      const isSelected = transactionForm.memberName === m.name;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setTransactionForm({ ...transactionForm, memberId: m.id, memberName: m.name })}
                          className={`w-full flex items-center justify-between p-2 text-left hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors ${
                            isSelected ? 'bg-emerald-100/70 dark:bg-emerald-950/50 font-bold text-emerald-800 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={m.photoUrl || '/images/member_1.jpg'}
                              alt={m.name}
                              className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute('src', '/images/member_1.jpg');
                              }}
                            />
                            <div>
                              <span className="block leading-tight">{m.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{m.role}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>

                {transactionForm.memberName && (
                  <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selected Donator: <span>{transactionForm.memberName}</span>
                  </p>
                )}
              </div>

              {/* AMOUNT & DATE */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                    Amount (MAD) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                      placeholder="e.g. 500"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                      MAD
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                    Transaction Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* PURPOSE / NOTES */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                  Purpose / Campaign Notes
                </label>
                <textarea
                  rows={2}
                  value={transactionForm.notes}
                  onChange={(e) => setTransactionForm({ ...transactionForm, notes: e.target.value })}
                  placeholder="e.g. Donation for primary school renovation in Douar Aït Baha..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow"
                >
                  {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-700 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-[#aa1c34] dark:text-red-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Confirm Deletion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-slate-800 dark:text-slate-200">&ldquo;{deleteConfirm.name}&rdquo;</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'member') {
                    handleDeleteMember(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'event') {
                    handleDeleteEvent(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'transaction') {
                    handleDeleteTransaction(deleteConfirm.id);
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-[#aa1c34] hover:bg-[#7d1224] text-white font-bold text-xs shadow"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
