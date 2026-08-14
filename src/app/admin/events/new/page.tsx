'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  MapPin, 
  Tag, 
  Users, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import ImageUploadInput from '@/components/ImageUploadInput';

interface Member {
  id: number;
  name: string;
  role: string;
  photoUrl: string;
}

interface EventDayForm {
  dayNumber: number;
  title: string;
  date: string;
  description: string;
  images: string[];
}

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Available members list for contributing team selection
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);

  // Event Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('School Refurbishment');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Biougra Region');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [impactSummary, setImpactSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/school_renovation.jpg');
  
  // Selected contributing team member IDs
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);

  // Timeline Days (Day 1, Day 2, Day 3...)
  const [timelineDays, setTimelineDays] = useState<EventDayForm[]>([
    {
      dayNumber: 1,
      title: 'Day 1: Preparations & Initial Setup',
      date: new Date().toISOString().split('T')[0],
      description: 'Initial site setup and team arrival.',
      images: ['/images/school_renovation.jpg']
    }
  ]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.success) {
        setAvailableMembers(data.members);
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  // Toggle Member selection for Contributing Team
  const toggleMemberSelection = (id: number) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  // Timeline Day Actions
  const addTimelineDay = () => {
    const nextNum = timelineDays.length + 1;
    setTimelineDays([
      ...timelineDays,
      {
        dayNumber: nextNum,
        title: `Day ${nextNum}: Mission Activities`,
        date: date,
        description: '',
        images: ['/images/school_renovation.jpg']
      }
    ]);
  };

  const removeTimelineDay = (index: number) => {
    if (timelineDays.length <= 1) {
      showToast('At least 1 day is required in the timeline', 'error');
      return;
    }
    const updated = timelineDays.filter((_, i) => i !== index).map((d, i) => ({
      ...d,
      dayNumber: i + 1
    }));
    setTimelineDays(updated);
  };

  const updateDayField = (index: number, field: keyof EventDayForm, value: any) => {
    const updated = [...timelineDays];
    updated[index] = { ...updated[index], [field]: value };
    setTimelineDays(updated);
  };

  const addImageToDay = (dayIndex: number, newImageUrl: string) => {
    if (!newImageUrl) return;
    const updated = [...timelineDays];
    updated[dayIndex].images = [...updated[dayIndex].images, newImageUrl];
    setTimelineDays(updated);
  };

  const removeImageFromDay = (dayIndex: number, imgIndex: number) => {
    const updated = [...timelineDays];
    updated[dayIndex].images = updated[dayIndex].images.filter((_, i) => i !== imgIndex);
    setTimelineDays(updated);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category || !date || !location.trim()) {
      showToast('Title, Tag (Category), Date, and Location are required', 'error');
      return;
    }

    setLoading(true);

    try {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const payload = {
        title,
        slug: generatedSlug,
        category,
        date,
        location,
        imageUrl,
        excerpt,
        content: content || excerpt,
        impactSummary,
        contributingMemberIds: selectedMemberIds,
        timelineDays
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        showToast('Event created successfully!');
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 1200);
      } else {
        showToast(data.error || 'Failed to create event', 'error');
      }
    } catch (err) {
      showToast('Network error while saving event', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold transition-all ${
          toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-red-600 text-white border-red-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="wide-container space-y-6 max-w-5xl mx-auto">
        
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a4f6c] hover:text-[#aa1c34] transition-colors mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-[#0a4f6c]">
              Create New Event Mission
            </h1>
            <p className="text-xs text-slate-500 font-medium">Fill in event details, contributing members, and multi-day timeline.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#aa1c34] hover:bg-[#7d1224] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Publish Event
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SECTION 1: BASIC EVENT INFO */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-[#0a4f6c]" />
              <h2 className="text-base font-bold text-[#0a4f6c]">1. Basic Event Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. School Refurbishment & Supplies Mission at Douar Aït Yassin"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tag / Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0a4f6c]"
                >
                  <option value="School Refurbishment">School Refurbishment</option>
                  <option value="Food Package Distribution">Food Package Distribution</option>
                  <option value="Spring of Life Well Drilling">Spring of Life Well Drilling</option>
                  <option value="Community Support">Community Support</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#0a4f6c]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Douar Aït Yassin, Biougra Region"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Impact Tagline Summary
                </label>
                <input
                  type="text"
                  value={impactSummary}
                  onChange={(e) => setImpactSummary(e.target.value)}
                  placeholder="e.g. 120 Students Equipped • 4 Classrooms Restored"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Little Description (Excerpt) *
              </label>
              <textarea
                rows={2}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of what was accomplished during this event..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Article Description
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Detailed story background..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a4f6c] focus:bg-white"
              />
            </div>

            {/* Main Cover Image Uploader */}
            <ImageUploadInput
              label="Main Cover Banner Image (UploadThing / File / URL)"
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
            />
          </div>

          {/* SECTION 2: CONTRIBUTING TEAM MEMBERS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0a4f6c]" />
                <h2 className="text-base font-bold text-[#0a4f6c]">2. Contributing Team Members</h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {selectedMemberIds.length} members selected
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Select association members who participated in this mission event:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableMembers.map((member) => {
                const isSelected = selectedMemberIds.includes(member.id);
                return (
                  <div
                    key={member.id}
                    onClick={() => toggleMemberSelection(member.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-100 border-[#0a4f6c] ring-1 ring-[#0a4f6c]'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#0a4f6c] rounded"
                    />
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-white"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', '/images/member_1.jpg');
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: MULTI-DAY TIMELINE & CAROUSELS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#aa1c34]" />
                <h2 className="text-base font-bold text-[#0a4f6c]">3. Step-by-Step Field Timeline & Carousel Images</h2>
              </div>

              <button
                type="button"
                onClick={addTimelineDay}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a4f6c] hover:bg-[#083c53] text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Another Day
              </button>
            </div>

            <div className="space-y-6 divide-y divide-slate-200">
              {timelineDays.map((day, dIdx) => (
                <div key={dIdx} className={`${dIdx > 0 ? 'pt-6' : ''} space-y-4`}>
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-xs font-extrabold text-[#aa1c34] uppercase tracking-wider">
                      Day {day.dayNumber} Configuration
                    </span>

                    {timelineDays.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimelineDay(dIdx)}
                        className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-md border border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove Day {day.dayNumber}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Day Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={day.title}
                        onChange={(e) => updateDayField(dIdx, 'title', e.target.value)}
                        placeholder={`Day ${day.dayNumber}: Site Prep & Sanding`}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0a4f6c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Day Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={day.date}
                        onChange={(e) => updateDayField(dIdx, 'date', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0a4f6c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Day Description / Content
                    </label>
                    <textarea
                      rows={2}
                      value={day.description}
                      onChange={(e) => updateDayField(dIdx, 'description', e.target.value)}
                      placeholder="Detail the activities carried out on this day..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0a4f6c]"
                    />
                  </div>

                  {/* DAY CAROUSEL IMAGES */}
                  <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Day {day.dayNumber} Carousel Photos ({day.images.length})
                    </label>

                    {/* Image Thumbnails */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {day.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative group rounded-xl overflow-hidden border border-slate-300 aspect-[4/3] bg-white">
                          <img
                            src={imgUrl}
                            alt={`Day ${day.dayNumber} photo ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', '/images/school_renovation.jpg');
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImageFromDay(dIdx, imgIdx)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-md opacity-90 hover:opacity-100 shadow transition-opacity"
                            title="Remove picture"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Image Helper to this Day */}
                    <ImageUploadInput
                      label={`Add Carousel Photo to Day ${day.dayNumber}`}
                      value=""
                      onChange={(url) => addImageToDay(dIdx, url)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT ACTION BAR */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#aa1c34] hover:bg-[#7d1224] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Publish Event Mission
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
