import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import { useStore } from '../store/useStore';

// ==========================================
// 1. Profile & Settings Hooks
// ==========================================
export function useProfile() {
  const setUser = useStore((state) => state.setUser);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const data = await apiRequest('/api/users/profile');
        if (data) {
          setUser(data);
          setIsAuthenticated(true);
        }
        return data;
      } catch (err) {
        setIsAuthenticated(false);
        throw err;
      }
    },
    retry: 1,
  });
}

export function useSettings() {
  const queryClient = useQueryClient();
  const setThemeStore = useStore((state) => state.setTheme);

  const query = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiRequest('/api/settings'),
  });

  const mutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest('/api/settings', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (data?.theme) {
        setThemeStore(data.theme);
      }
    },
  });

  return { ...query, updateSettings: mutation.mutateAsync };
}

// ==========================================
// 2. Social Connection Hooks
// ==========================================
export function useSocialAccounts() {
  const setAccounts = useStore((state) => state.setAccounts);
  return useQuery({
    queryKey: ['social-accounts'],
    queryFn: async () => {
      const data = await apiRequest('/api/social/accounts');
      if (data) setAccounts(data);
      return data || [];
    },
  });
}

export function useConnectSocial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { platform: string; handle: string; displayName?: string }) =>
      apiRequest('/api/social/connect', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
      queryClient.invalidateQueries({ queryKey: ['historical-analytics'] });
    },
  });
}

export function useDisconnectSocial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/social/accounts/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
      queryClient.invalidateQueries({ queryKey: ['historical-analytics'] });
    },
  });
}

// ==========================================
// 3. Analytics Hooks
// ==========================================
export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => apiRequest('/api/analytics/summary'),
  });
}

export function useHistoricalAnalytics(range: string, platform?: string) {
  const queryKey = ['historical-analytics', range, platform || 'ALL'];
  return useQuery({
    queryKey,
    queryFn: () => {
      let url = `/api/analytics/historical?range=${range}`;
      if (platform && platform !== 'ALL') {
        url += `&platform=${platform}`;
      }
      return apiRequest(url);
    },
  });
}

export function useTopPosts(platform?: string, limit = 5) {
  return useQuery({
    queryKey: ['top-posts', platform || 'ALL', limit],
    queryFn: () => {
      let url = `/api/analytics/top-posts?limit=${limit}`;
      if (platform && platform !== 'ALL') {
        url += `&platform=${platform}`;
      }
      return apiRequest(url);
    },
  });
}

export function useDemographics() {
  return useQuery({
    queryKey: ['demographics'],
    queryFn: () => apiRequest('/api/analytics/demographics'),
  });
}

// ==========================================
// 4. Content Calendar Hooks
// ==========================================
export function useCalendarPosts(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['calendar-posts', startDate, endDate],
    queryFn: () => {
      let url = '/api/calendar/posts';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      return apiRequest(url);
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { accountId: string; title?: string; content: string; status: string; scheduledFor?: string; mediaUrl?: string }) =>
      apiRequest('/api/calendar/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(`/api/calendar/posts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-posts'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/calendar/posts/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-posts'] });
    },
  });
}

// ==========================================
// 5. Competitor Hooks
// ==========================================
export function useCompetitors() {
  return useQuery({
    queryKey: ['competitors'],
    queryFn: () => apiRequest('/api/competitors'),
  });
}

export function useCompetitorComparison(platform: string) {
  return useQuery({
    queryKey: ['competitor-compare', platform],
    queryFn: () => apiRequest(`/api/competitors/compare?platform=${platform}`),
  });
}

export function useAddCompetitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { platform: string; handle: string; displayName?: string }) =>
      apiRequest('/api/competitors', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      queryClient.invalidateQueries({ queryKey: ['competitor-compare'] });
    },
  });
}

export function useRemoveCompetitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/competitors/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitors'] });
      queryClient.invalidateQueries({ queryKey: ['competitor-compare'] });
    },
  });
}

// ==========================================
// 6. AI Assistant Hooks
// ==========================================
export function useConversations() {
  return useQuery({
    queryKey: ['ai-conversations'],
    queryFn: () => apiRequest('/api/ai/conversations'),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title?: string) =>
      apiRequest('/api/ai/conversations', {
        method: 'POST',
        body: JSON.stringify({ title }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    },
  });
}

export function useMessages(conversationId?: string) {
  return useQuery({
    queryKey: ['ai-messages', conversationId],
    queryFn: () => {
      if (!conversationId) return [];
      return apiRequest(`/api/ai/conversations/${conversationId}/messages`);
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      apiRequest(`/api/ai/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    },
  });
}

// ==========================================
// 7. Notifications Hooks
// ==========================================
export function useNotifications() {
  const setNotifications = useStore((state) => state.setNotifications);
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await apiRequest('/api/notifications');
      if (data) setNotifications(data);
      return data || [];
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/notifications/${id}/read`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiRequest('/api/notifications/read-all', {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ==========================================
// 8. Reports Export Hooks
// ==========================================
export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => apiRequest('/api/reports'),
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; rangeStart: string; rangeEnd: string; format: string }) =>
      apiRequest('/api/reports', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/reports/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
