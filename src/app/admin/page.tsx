<<<<<<< HEAD
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';
export const dynamic = 'force-dynamic';
export default async function AdminPage() {
  const session = await getSession();
  if (session?.role === 'member') redirect('/account');
  return <AdminDashboard />;
=======
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
  Check,
  Newspaper,
  Play,
  Instagram,
  Video,
  Sparkles,
  ArrowUpRight,
  Clock,
  Image as ImageIcon
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

interface EventDay {
  dayNumber: number;
  title: string;
  date: string;
  description: string;
  images: string[];
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
  timelineDays?: EventDay[];
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

interface NewsletterItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  category?: string;
  date: string;
  createdAt?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'events' | 'newsletters' | 'transactions'>('members');

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
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filter state
  const [memberSearch, setMemberSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [newsletterSearch, setNewsletterSearch] = useState('');

  // Member Modal State
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    roleEn: '',
    roleFr: '',
    photoUrl: '/images/member_1.jpg',
    bio: '',
    bioEn: '',
    bioFr: '',
    location: 'Biougra, Morocco'
  });

  // Event Modal State (With Timeline Days and Contributing Members)
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'School Refurbishment',
    date: new Date().toISOString().split('T')[0],
    location: 'Biougra Region',
    imageUrl: '/images/school_renovation.jpg',
    excerpt: '',
    content: '',
    impactSummary: '',
    contributingMemberIds: [] as number[],
    timelineDays: [] as EventDay[]
  });

  // Newsletter Modal State
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<NewsletterItem | null>(null);
  const [newsletterForm, setNewsletterForm] = useState({
    title: '',
    description: '',
    imageUrl: '/images/school_renovation.jpg',
    linkUrl: '',
    category: 'YouTube Video',
    date: new Date().toISOString().split('T')[0]
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

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'member' | 'event' | 'transaction' | 'newsletter'; id: number; name: string } | null>(null);
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
      const [membersRes, eventsRes, transactionsRes, newslettersRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/events'),
        fetch('/api/transactions'),
        fetch('/api/newsletters')
      ]);

      const membersData = await membersRes.json();
      const eventsData = await eventsRes.json();
      const transactionsData = await transactionsRes.json();
      const newslettersData = await newslettersRes.json();

      if (membersData.success) setMembers(membersData.members);
      if (eventsData.success) setEvents(eventsData.events);
      if (transactionsData.success) setTransactions(transactionsData.transactions);
      if (newslettersData.success) setNewsletters(newslettersData.newsletters);
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
      roleEn: '',
      roleFr: '',
      photoUrl: '/images/member_1.jpg',
      bio: '',
      bioEn: '',
      bioFr: '',
      location: 'Biougra, Morocco'
    });
    setMemberModalOpen(true);
  };

  const openEditMemberModal = (member: Member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role: member.role,
      roleEn: member.roleEn || member.role,
      roleFr: member.roleFr || member.role,
      photoUrl: member.photoUrl,
      bio: member.bio || '',
      bioEn: member.bioEn || member.bio || '',
      bioFr: member.bioFr || member.bio || '',
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
          showToast('Member "' + memberForm.name + '" updated!');
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
          showToast('Member "' + memberForm.name + '" added successfully!');
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
      const res = await fetch('/api/members?id=' + id, { method: 'DELETE' });
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

  // --- Event Handlers (with Timeline Days and Members) ---
  const openAddEventModal = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      category: 'School Refurbishment',
      date: new Date().toISOString().split('T')[0],
      location: 'Biougra Region',
      imageUrl: '/images/school_renovation.jpg',
      excerpt: '',
      content: '',
      impactSummary: '',
      contributingMemberIds: members.slice(0, 4).map(m => m.id),
      timelineDays: [
        {
          dayNumber: 1,
          title: 'Field Setup & Initial Preparation',
          date: new Date().toISOString().split('T')[0],
          description: 'Team arrival, setup of operations, and community alignment.',
          images: ['/images/school_renovation.jpg']
        }
      ]
    });
    setEventModalOpen(true);
  };

  const openEditEventModal = (event: EventItem) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      category: event.category,
      date: event.date,
      location: event.location,
      imageUrl: event.imageUrl,
      excerpt: event.excerpt,
      content: event.content,
      impactSummary: event.impactSummary || '',
      contributingMemberIds: event.contributingMemberIds || [],
      timelineDays: event.timelineDays && event.timelineDays.length > 0 ? event.timelineDays : []
    });
    setEventModalOpen(true);
  };

  const addTimelineDay = () => {
    const nextDayNum = eventForm.timelineDays.length + 1;
    setEventForm({
      ...eventForm,
      timelineDays: [
        ...eventForm.timelineDays,
        {
          dayNumber: nextDayNum,
          title: 'Day ' + nextDayNum + ' Activity',
          date: eventForm.date,
          description: '',
          images: [eventForm.imageUrl || '/images/school_renovation.jpg']
        }
      ]
    });
  };

  const updateTimelineDay = (index: number, field: keyof EventDay, value: any) => {
    const updated = [...eventForm.timelineDays];
    updated[index] = { ...updated[index], [field]: value };
    setEventForm({ ...eventForm, timelineDays: updated });
  };

  const removeTimelineDay = (index: number) => {
    const updated = eventForm.timelineDays.filter((_, idx) => idx !== index)
      .map((day, idx) => ({ ...day, dayNumber: idx + 1 }));
    setEventForm({ ...eventForm, timelineDays: updated });
  };

  const toggleContributingMember = (memberId: number) => {
    const current = eventForm.contributingMemberIds;
    if (current.includes(memberId)) {
      setEventForm({ ...eventForm, contributingMemberIds: current.filter(id => id !== memberId) });
    } else {
      setEventForm({ ...eventForm, contributingMemberIds: [...current, memberId] });
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const res = await fetch('/api/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEvent.id, ...eventForm })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Event "' + eventForm.title + '" updated!');
          fetchDashboardData();
          setEventModalOpen(false);
        } else {
          showToast(data.error || 'Failed to update event', 'error');
        }
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventForm)
        });
        const data = await res.json();
        if (data.success) {
          showToast('Event "' + eventForm.title + '" created successfully!');
          fetchDashboardData();
          setEventModalOpen(false);
        } else {
          showToast(data.error || 'Failed to add event', 'error');
        }
      }
    } catch (err) {
      showToast('Network error while saving event', 'error');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      const res = await fetch('/api/events?id=' + id, { method: 'DELETE' });
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

  // --- Newsletter Handlers ---
  const openAddNewsletterModal = () => {
    setEditingNewsletter(null);
    setNewsletterForm({
      title: '',
      description: '',
      imageUrl: '/images/school_renovation.jpg',
      linkUrl: '',
      category: 'YouTube Video',
      date: new Date().toISOString().split('T')[0]
    });
    setNewsletterModalOpen(true);
  };

  const openEditNewsletterModal = (item: NewsletterItem) => {
    setEditingNewsletter(item);
    setNewsletterForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl,
      category: item.category || 'YouTube Video',
      date: item.date
    });
    setNewsletterModalOpen(true);
  };

  const handleSaveNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterForm.title || !newsletterForm.linkUrl) {
      showToast('Please fill in both Title and Link URL', 'error');
      return;
    }

    try {
      if (editingNewsletter) {
        const res = await fetch('/api/newsletters', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingNewsletter.id, ...newsletterForm })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Newsletter "' + newsletterForm.title + '" updated!');
          fetchDashboardData();
          setNewsletterModalOpen(false);
        } else {
          showToast(data.error || 'Failed to update newsletter', 'error');
        }
      } else {
        const res = await fetch('/api/newsletters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsletterForm)
        });
        const data = await res.json();
        if (data.success) {
          showToast('Newsletter "' + newsletterForm.title + '" published!');
          fetchDashboardData();
          setNewsletterModalOpen(false);
        } else {
          showToast(data.error || 'Failed to publish newsletter', 'error');
        }
      }
    } catch (err) {
      showToast('Network error while saving newsletter', 'error');
    }
  };

  const handleDeleteNewsletter = async (id: number) => {
    try {
      const res = await fetch('/api/newsletters?id=' + id, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Newsletter deleted successfully');
        fetchDashboardData();
      } else {
        showToast('Failed to delete newsletter', 'error');
      }
    } catch (err) {
      showToast('Network error during newsletter deletion', 'error');
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
          showToast('Transaction for ' + transactionForm.memberName + ' updated!');
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
          showToast('Charity donation of ' + numAmount + ' MAD recorded!');
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
      const res = await fetch('/api/transactions?id=' + id, { method: 'DELETE' });
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
      'Transaction ID': 'DOF-TX-' + String(t.id).padStart(4, '0'),
      'Donator (DOF Member)': t.memberName,
      'Amount (MAD)': t.amount,
      'Date': t.date,
      'Notes / Purpose': t.notes || 'General Charity Contribution',
      'Recorded At': t.createdAt ? new Date(t.createdAt).toLocaleString('fr-FR') : '—'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DOF Transactions');

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
    XLSX.writeFile(workbook, 'DOF_Charity_Transactions_' + today + '.xlsx');
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

  const filteredNewsletters = useMemo(() => {
    const q = newsletterSearch.toLowerCase();
    return newsletters.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.description.toLowerCase().includes(q) ||
      (n.category && n.category.toLowerCase().includes(q)) ||
      n.linkUrl.toLowerCase().includes(q)
    );
  }, [newsletters, newsletterSearch]);

  const filteredTransactions = useMemo(() => {
    const q = transactionSearch.toLowerCase();
    return transactions.filter(t => 
      t.memberName.toLowerCase().includes(q) || 
      (t.notes && t.notes.toLowerCase().includes(q)) ||
      t.date.includes(q)
    );
  }, [transactions, transactionSearch]);

  const filteredSelectMembers = useMemo(() => {
    const q = memberSelectSearch.toLowerCase();
    if (!q) return members;
    return members.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q));
  }, [members, memberSelectSearch]);

  const totalAmountCollected = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  }, [transactions]);

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
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
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
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
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

      {toast && (
        <div className={'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-bold transition-all animate-bounce ' + (
          toast.type === 'success'
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
            : 'bg-[#aa1c34] text-white border-red-500 shadow-red-500/20'
        )}>
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
              Manage association members, multi-day event reports, video newsletters, and charity transactions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('members')}
              className={'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                activeTab === 'members'
                  ? 'bg-[#0a4f6c] dark:bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0a4f6c] border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              )}
            >
              <Users className="w-4 h-4" />
              Members ({members.length})
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                activeTab === 'events'
                  ? 'bg-[#aa1c34] dark:bg-red-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#aa1c34] border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              )}
            >
              <Calendar className="w-4 h-4" />
              Events ({events.length})
            </button>

            <button
              onClick={() => setActiveTab('newsletters')}
              className={'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                activeTab === 'newsletters'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              )}
            >
              <Newspaper className="w-4 h-4" />
              Newsletter ({newsletters.length})
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                activeTab === 'transactions'
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              )}
            >
              <Receipt className="w-4 h-4" />
              Transactions ({transactions.length})
            </button>
          </div>
        </div>

        {/* --- MEMBERS TABLE VIEW --- */}
        {activeTab === 'members' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search members by name, role, location..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c]"
                />
              </div>

              <button
                onClick={openAddMemberModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New Member
              </button>
            </div>

            {loadingData ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                Loading members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-400" />
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
                                className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-slate-200 dark:border-slate-600"
                              >
                                <Pencil className="w-3.5 h-3.5 text-[#0a4f6c] dark:text-sky-300" />
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'member', id: member.id, name: member.name })}
                                className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-[#aa1c34] dark:text-red-300 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-red-200 dark:border-red-800"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events by title, category, location..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#aa1c34]"
                />
              </div>

              <button
                onClick={openAddEventModal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-[#aa1c34] dark:bg-red-700 hover:bg-[#7d1224] text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Create New Event Mission
              </button>
            </div>

            {loadingData ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                Loading events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No events found</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create a new event mission to manage multi-day content.</p>
                <button
                  onClick={openAddEventModal}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#aa1c34] text-white text-xs font-bold shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Event
                </button>
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
                        <th className="py-2.5 px-3.5">Days</th>
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
                            <Link href={'/events/' + event.slug} target="_blank" className="hover:text-[#aa1c34] flex items-center gap-1 group">
                              <span>{event.title}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                            </Link>
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className="inline-block text-[10px] font-extrabold bg-[#0a4f6c]/10 dark:bg-sky-950/60 text-[#0a4f6c] dark:text-sky-300 px-2.5 py-0.5 rounded-md border border-[#0a4f6c]/20">
                              {event.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-bold text-[10px] text-slate-700 dark:text-slate-300">
                              <Clock className="w-3 h-3 text-[#0a4f6c] dark:text-sky-400" />
                              {event.timelineDays ? event.timelineDays.length : 0} days
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
                              <button
                                onClick={() => openEditEventModal(event)}
                                className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-slate-200 dark:border-slate-600"
                              >
                                <Pencil className="w-3.5 h-3.5 text-[#0a4f6c] dark:text-sky-300" />
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'event', id: event.id, name: event.title })}
                                className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-[#aa1c34] dark:text-red-300 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-red-200 dark:border-red-800"
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

        {/* --- NEWSLETTERS TAB VIEW --- */}
        {activeTab === 'newsletters' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search newsletters by title, category, link..."
                  value={newsletterSearch}
                  onChange={(e) => setNewsletterSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/newsletter"
                  target="_blank"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public Page</span>
                </Link>

                <button
                  onClick={openAddNewsletterModal}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Newsletter Story
                </button>
              </div>
            </div>

            {loadingData ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                Loading newsletters...
              </div>
            ) : filteredNewsletters.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                <Newspaper className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No newsletter stories yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Publish YouTube videos, Instagram posts, or media articles to appear on the public Newsletter page.</p>
                <button
                  onClick={openAddNewsletterModal}
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Newsletter
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        <th className="py-2.5 px-3.5">Image</th>
                        <th className="py-2.5 px-3.5">Title & Excerpt</th>
                        <th className="py-2.5 px-3.5">Category</th>
                        <th className="py-2.5 px-3.5">Date</th>
                        <th className="py-2.5 px-3.5">External Target Link</th>
                        <th className="py-2.5 px-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                      {filteredNewsletters.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-2.5 px-3.5">
                            <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).setAttribute('src', '/images/school_renovation.jpg');
                                }}
                              />
                              {idx === 0 && (
                                <div className="absolute top-0.5 right-0.5 bg-amber-400 text-black text-[9px] font-extrabold px-1 rounded">
                                  TOP
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3.5 max-w-sm">
                            <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{item.title}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{item.description}</div>
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className="inline-block text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                              {item.category || 'Media'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {item.date}
                          </td>
                          <td className="py-2.5 px-3.5 max-w-xs">
                            <a
                              href={item.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#0a4f6c] dark:text-sky-300 hover:text-[#aa1c34] font-medium flex items-center gap-1 truncate"
                            >
                              <span className="truncate">{item.linkUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditNewsletterModal(item)}
                                className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-slate-200 dark:border-slate-600"
                              >
                                <Pencil className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteConfirm({ type: 'newsletter', id: item.id, name: item.title })}
                                className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-[#aa1c34] dark:text-red-300 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-red-200 dark:border-red-800"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by donator member, notes, date..."
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={exportTransactionsToExcel}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                  title="Export all transactions to an Excel (.xlsx) spreadsheet"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export to Excel</span>
                </button>

                <button
                  onClick={openAddTransactionModal}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Transaction</span>
                </button>
              </div>
            </div>

            {loadingData ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                Loading charity transactions...
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
                <HeartHandshake className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No transactions recorded yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Record member donations to track association funds and export to Excel.</p>
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
                                  className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-slate-200 dark:border-slate-600"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-[#0a4f6c] dark:text-sky-300" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ type: 'transaction', id: tx.id, name: 'Transaction of ' + tx.amount + ' MAD by ' + tx.memberName })}
                                  className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-[#aa1c34] dark:text-red-300 font-semibold text-xs flex items-center gap-1 px-2.5 transition-colors border border-red-200 dark:border-red-800"
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
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Role (FR / Primary) *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value, roleFr: e.target.value })}
                    placeholder="e.g. Président"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Role (English translation)</label>
                <input
                  type="text"
                  value={memberForm.roleEn}
                  onChange={(e) => setMemberForm({ ...memberForm, roleEn: e.target.value })}
                  placeholder="e.g. President"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Location</label>
                <input
                  type="text"
                  value={memberForm.location}
                  onChange={(e) => setMemberForm({ ...memberForm, location: e.target.value })}
                  placeholder="Biougra, Morocco"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
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
                  onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value, bioFr: e.target.value })}
                  placeholder="Describe member background or quote..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] dark:focus:border-sky-400"
                />
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0a4f6c] dark:bg-blue-600 hover:bg-[#083c53] text-white font-bold"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT EVENT MODAL (WITH DAYS CHRONOLOGY & TEAM) --- */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#aa1c34] dark:text-red-400" />
                <h3 className="font-extrabold text-[#0a4f6c] dark:text-sky-400 text-sm">
                  {editingEvent ? 'Edit Event Mission & Timeline' : 'Create New Event Mission'}
                </h3>
              </div>
              <button onClick={() => setEventModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-5 space-y-4 text-xs max-h-[82vh] overflow-y-auto">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Primary School Renovation in Douar Ait Baha"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#aa1c34]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Category *</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#aa1c34]"
                  >
                    <option value="School Refurbishment">School Refurbishment</option>
                    <option value="Food Package Distribution">Food Package Distribution</option>
                    <option value="Spring of Life Well Drilling">Spring of Life Well Drilling</option>
                    <option value="Community Initiative">Community Initiative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#aa1c34]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="e.g. Douar Ait Baha, Biougra"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#aa1c34]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Impact Summary</label>
                  <input
                    type="text"
                    value={eventForm.impactSummary}
                    onChange={(e) => setEventForm({ ...eventForm, impactSummary: e.target.value })}
                    placeholder="e.g. 120 Students Served"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#aa1c34]"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Event Cover / Banner Image"
                value={eventForm.imageUrl}
                onChange={(url) => setEventForm({ ...eventForm, imageUrl: url })}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Short Summary / Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={eventForm.excerpt}
                  onChange={(e) => setEventForm({ ...eventForm, excerpt: e.target.value })}
                  placeholder="Overview preview summary of the mission..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#aa1c34]"
                />
              </div>

              {/* CONTRIBUTING TEAM MEMBERS SELECTOR */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#0a4f6c] dark:text-sky-400" />
                    Contributing Team Members ({eventForm.contributingMemberIds.length} Selected)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
                  {members.map((m) => {
                    const isSelected = eventForm.contributingMemberIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleContributingMember(m.id)}
                        className={'flex items-center gap-2 p-1.5 rounded-lg text-left border transition-all text-[11px] ' + (
                          isSelected
                            ? 'bg-[#0a4f6c]/10 dark:bg-sky-950/60 border-[#0a4f6c] dark:border-sky-400 font-bold text-[#0a4f6c] dark:text-sky-300'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        )}
                      >
                        <img
                          src={m.photoUrl || '/images/member_1.jpg'}
                          alt={m.name}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute('src', '/images/member_1.jpg');
                          }}
                        />
                        <span className="truncate">{m.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TIMELINE DAYS (DAY 1, DAY 2, DAY 3...) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#aa1c34] dark:text-red-400 text-xs uppercase">
                    <Clock className="w-4 h-4" />
                    <span>Mission Field Timeline ({eventForm.timelineDays.length} Days)</span>
                  </div>
                  <button
                    type="button"
                    onClick={addTimelineDay}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0a4f6c] hover:bg-[#083c53] text-white text-[11px] font-bold shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Next Day
                  </button>
                </div>

                {eventForm.timelineDays.length === 0 ? (
                  <p className="p-3 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-900 rounded-lg">
                    No timeline days yet. Click &quot;Add Next Day&quot; to build step-by-step chronology.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {eventForm.timelineDays.map((day, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2.5 relative">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-[#0a4f6c] dark:bg-blue-600 text-white font-extrabold text-[10px]">
                            Day {day.dayNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTimelineDay(idx)}
                            className="text-red-500 hover:text-red-700 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove Day
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500">Day Title</label>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => updateTimelineDay(idx, 'title', e.target.value)}
                              placeholder="e.g. Wall Sanding & Ceiling Repairs"
                              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1 text-slate-800 dark:text-slate-100 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500">Day Date</label>
                            <input
                              type="date"
                              value={day.date}
                              onChange={(e) => updateTimelineDay(idx, 'date', e.target.value)}
                              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1 text-slate-800 dark:text-slate-100 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500">Day Description</label>
                          <textarea
                            rows={2}
                            value={day.description}
                            onChange={(e) => updateTimelineDay(idx, 'description', e.target.value)}
                            placeholder="Detailed activities, milestones and team efforts on this day..."
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1 text-slate-800 dark:text-slate-100 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500">Day Photo URL</label>
                          <input
                            type="text"
                            value={day.images && day.images[0] ? day.images[0] : ''}
                            onChange={(e) => updateTimelineDay(idx, 'images', [e.target.value])}
                            placeholder="/images/school_renovation.jpg or https://..."
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1 text-slate-800 dark:text-slate-100 text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">Full Narrative Content</label>
                <textarea
                  rows={3}
                  value={eventForm.content}
                  onChange={(e) => setEventForm({ ...eventForm, content: e.target.value })}
                  placeholder="Detailed wrap-up report and acknowledgements..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#aa1c34]"
                />
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#aa1c34] hover:bg-[#7d1224] text-white font-bold"
                >
                  {editingEvent ? 'Update Event & Timeline' : 'Save Event Mission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT NEWSLETTER MODAL --- */}
      {newsletterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <Newspaper className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#0a4f6c] dark:text-sky-400 text-sm">
                  {editingNewsletter ? 'Edit Newsletter Story' : 'Publish New Newsletter Story'}
                </h3>
              </div>
              <button onClick={() => setNewsletterModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewsletter} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                  Story Title *
                </label>
                <input
                  type="text"
                  required
                  value={newsletterForm.title}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, title: e.target.value })}
                  placeholder="e.g. Video Report: Delivering 200 Food Parcels in Mountain Villages"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                  External Link URL (YouTube, Instagram, or any link) *
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={newsletterForm.linkUrl}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, linkUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://instagram.com/p/..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  When visitors click this story, they will be directly taken to this link.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                    Category / Media Type
                  </label>
                  <select
                    value={newsletterForm.category}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="YouTube Video">YouTube Video</option>
                    <option value="Instagram Post">Instagram Post</option>
                    <option value="Facebook Video">Facebook Video</option>
                    <option value="Press Article">Press Article</option>
                    <option value="Official Update">Official Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                    Publish Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newsletterForm.date}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Story Thumbnail / Cover Image"
                value={newsletterForm.imageUrl}
                onChange={(url) => setNewsletterForm({ ...newsletterForm, imageUrl: url })}
              />

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newsletterForm.description}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, description: e.target.value })}
                  placeholder="Provide a concise description of what the video or post is about..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewsletterModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  {editingNewsletter ? 'Update Newsletter' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT TRANSACTION MODAL --- */}
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
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1 uppercase text-[11px]">
                  Donator (Must be a DOF Member) *
                </label>
                
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
                          className={'w-full flex items-center justify-between p-2 text-left hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors ' + (
                            isSelected ? 'bg-emerald-100/70 dark:bg-emerald-950/50 font-bold text-emerald-800 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'
                          )}
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
                  className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold"
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
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'member') {
                    handleDeleteMember(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'event') {
                    handleDeleteEvent(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'newsletter') {
                    handleDeleteNewsletter(deleteConfirm.id);
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
>>>>>>> 368d0179f0b6ba748a04b6f9e43715c842dbb7ea
}
