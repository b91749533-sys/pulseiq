'use client';

import React, { useState } from 'react';
import {
  useCalendarPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useSocialAccounts,
} from '@/hooks/useApi';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function ContentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  // Form States
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [postStatus, setPostStatus] = useState('SCHEDULED');

  const { data: accounts } = useSocialAccounts();
  
  // Format dates for search
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startOfMonth = new Date(year, month, 1).toISOString();
  const endOfMonth = new Date(year, month + 1, 0).toISOString();

  const { data: posts, isLoading } = useCalendarPosts(startOfMonth, endOfMonth);
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: updatePost } = useUpdatePost();
  const { mutateAsync: deletePost } = useDeletePost();

  // Calendar calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to open create post modal
  const handleOpenCreateModal = (day: number) => {
    const defaultTime = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T12:00`;
    setScheduleTime(defaultTime);
    setSelectedPost(null);
    setPostTitle('');
    setPostContent('');
    setPostStatus('SCHEDULED');
    if (accounts && accounts.length > 0) {
      setSelectedAccount(accounts[0].id);
    }
    setIsModalOpen(true);
  };

  // Helper to open edit post modal
  const handleOpenEditModal = (post: any) => {
    setSelectedPost(post);
    setPostTitle(post.title || '');
    setPostContent(post.content || '');
    setPostStatus(post.status);
    setSelectedAccount(post.accountId);
    if (post.scheduledFor) {
      setScheduleTime(post.scheduledFor.substring(0, 16));
    } else {
      setScheduleTime('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !selectedAccount) return;

    const data = {
      accountId: selectedAccount,
      title: postTitle,
      content: postContent,
      status: postStatus,
      scheduledFor: postStatus === 'SCHEDULED' ? new Date(scheduleTime).toISOString() : undefined,
    };

    try {
      if (selectedPost) {
        await updatePost({ id: selectedPost.id, data });
      } else {
        await createPost(data);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    try {
      await deletePost(selectedPost.id);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Content Planner
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            Draft, audit, and schedule posts across all accounts.
          </p>
        </div>

        {/* Month selector navigation */}
        <div className="flex items-center gap-3">
          <div className="inline-flex border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark rounded-xl overflow-hidden shadow-sm">
            <button onClick={prevMonth} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <div className="px-4 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center border-x border-border-light dark:border-border-dark min-w-[130px]">
              {monthNames[month]} {year}
            </div>
            <button onClick={nextMonth} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
          <button
            onClick={() => handleOpenCreateModal(new Date().getDate())}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-glow-blue flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Draft</span>
          </button>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="premium-card p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider pb-4 border-b border-border-light dark:border-border-dark">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-2 mt-4">
          {/* Empty cells for padding */}
          {[...Array(firstDayIndex)].map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[110px] bg-zinc-50/20 dark:bg-[#0c0c0f]/20 rounded-xl border border-transparent" />
          ))}

          {/* Month days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            // Find posts on this day
            const dayPosts = posts?.filter((post: any) => {
              const dateToCheck = post.scheduledFor || post.publishedAt;
              if (!dateToCheck) return false;
              const dateObj = new Date(dateToCheck);
              return dateObj.getDate() === day && dateObj.getMonth() === month && dateObj.getFullYear() === year;
            }) || [];

            return (
              <div
                key={day}
                onClick={() => handleOpenCreateModal(day)}
                className={`min-h-[110px] p-2 bg-zinc-50/50 dark:bg-[#0c0c0f]/40 border rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all flex flex-col group cursor-pointer ${
                  isToday ? 'border-blue-500/80 bg-blue-500/5 shadow-glow-blue' : 'border-border-light dark:border-border-dark'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-bold ${isToday ? 'text-blue-500' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    {day}
                  </span>
                  <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-zinc-400 dark:text-zinc-600 transition-opacity" />
                </div>

                {/* Day posts list */}
                <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[75px]">
                  {dayPosts.map((post: any) => {
                    let statusColor = 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'; // DRAFT
                    if (post.status === 'SCHEDULED') statusColor = 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
                    if (post.status === 'PUBLISHED') statusColor = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';

                    return (
                      <div
                        key={post.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(post);
                        }}
                        className={`px-2 py-1 rounded-md text-[10px] font-semibold truncate hover:scale-102 transition-transform border ${statusColor}`}
                      >
                        {post.title || post.content}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-xl p-6 space-y-6">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 border-b border-border-light dark:border-border-dark pb-3">
              {selectedPost ? 'Edit Post Parameters' : 'Create Scheduled Post'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Title (Optional)</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  placeholder="e.g. Scaling background workers"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Caption / Content</label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={3}
                  required
                  className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  placeholder="What do you want to share..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Social Channel</label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    required
                    className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-350 focus:outline-none"
                  >
                    <option value="">Select account</option>
                    {accounts?.map((acc: any) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.platform} ({acc.handle})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Post Status</label>
                  <select
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value)}
                    className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-350 focus:outline-none"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              {postStatus === 'SCHEDULED' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Publication Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required
                    className="w-full bg-[#09090b] border border-border-light dark:border-border-dark rounded-xl px-3 py-2.5 text-xs text-zinc-350 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-border-light dark:border-border-dark">
                {selectedPost ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors border border-red-500/20"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 border border-border-light dark:border-border-dark rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-glow-blue transition-all"
                  >
                    {selectedPost ? 'Save Edits' : 'Schedule Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
