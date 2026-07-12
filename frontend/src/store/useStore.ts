import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  subscription?: { plan: string; status: string };
  settings?: { theme: string; emailNotifications: boolean };
}

export interface SocialAccount {
  id: string;
  platform: 'YOUTUBE' | 'INSTAGRAM' | 'TIKTOK' | 'LINKEDIN' | 'TWITTER';
  handle: string;
  displayName: string;
  avatarUrl: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface AppState {
  // Authentication & Profile
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;

  // Connected Social Accounts
  accounts: SocialAccount[];
  setAccounts: (accounts: SocialAccount[]) => void;
  activePlatform: string; // 'ALL', 'YOUTUBE', etc.
  setActivePlatform: (platform: string) => void;

  // Global Settings & Range filters
  dateRange: 'day' | 'week' | 'month' | 'year';
  setDateRange: (range: 'day' | 'week' | 'month' | 'year') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Alerts Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  accounts: [],
  setAccounts: (accounts) => set({ accounts }),
  activePlatform: 'ALL',
  setActivePlatform: (activePlatform) => set({ activePlatform }),

  dateRange: 'month',
  setDateRange: (dateRange) => set({ dateRange }),
  theme: 'dark',
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(nextTheme);
      }
      return { theme: nextTheme };
    }),

  notifications: [],
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
  unreadCount: 0,
  setUnreadCount: (unreadCount) => set({ unreadCount }),
}));
