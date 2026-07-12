// High-fidelity client-side mock data generators for when the backend is offline
const MOCK_ACCOUNTS: any[] = [
  { id: 'acc_yt', platform: 'YOUTUBE', handle: '@YoussefManssouriTech', displayName: 'Youssef Manssouri Tech', avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150' },
  { id: 'acc_ig', platform: 'INSTAGRAM', handle: '@youssef_manssouri', displayName: 'Youssef Manssouri', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'acc_tt', platform: 'TIKTOK', handle: '@youssef.manssouri', displayName: 'Youssef Manssouri AI', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'acc_li', platform: 'LINKEDIN', handle: 'youssef-manssouri', displayName: 'Youssef Manssouri', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { id: 'acc_tw', platform: 'TWITTER', handle: '@youssefm_ai', displayName: 'Youssef Manssouri', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
];

const MOCK_NOTIFICATIONS: any[] = [
  { id: 'n1', title: 'Best Time to Post', message: 'Your optimal posting time starts in 30 minutes for YouTube.', type: 'info', read: false, createdAt: new Date().toISOString() },
  { id: 'n2', title: 'Viral Alert!', message: 'Your latest TikTok post on Rust has 3x higher engagement than average!', type: 'success', read: false, createdAt: new Date().toISOString() },
  { id: 'n3', title: 'Engagement Change', message: 'Your Instagram weekly engagement dropped by 5% compared to the prior week.', type: 'warning', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() }
];

const MOCK_CONVERSATIONS: any[] = [
  { id: 'c1', title: 'Engagement Strategy', updatedAt: new Date().toISOString() }
];

const MOCK_MESSAGES: Record<string, any[]> = {
  c1: [
    { id: 'm1', role: 'user', content: 'Why did my LinkedIn post perform so much better than my last YouTube video?' },
    { id: 'm2', role: 'assistant', content: 'Hi Youssef! Looking at your metrics, your LinkedIn post ("AI Agent Architecture in 2026") had a 6.2% engagement rate, which was fueled by 189 comments. The topic resonated strongly with professional developers. By contrast, your YouTube video is 20 minutes long and requires higher friction to watch. I recommend repurposing the core findings of your LinkedIn post into a short 60-second video for TikTok and YouTube Shorts to maximize visual reach.' }
  ]
};

const MOCK_POSTS: any[] = [
  { id: 'p1', accountId: 'acc_li', platform: 'LINKEDIN', title: 'AI Agent Architecture in 2026', content: 'Here is a breakdown of how agentic workflows are replacing typical chatbots.', status: 'PUBLISHED', publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), handle: '@youssef-manssouri', views: 8400, engagementRate: 6.2, likes: 520, comments: 189, shares: 42 },
  { id: 'p2', accountId: 'acc_yt', platform: 'YOUTUBE', title: 'Building InsightFlow SaaS', content: 'In this video, I reveal how to build and launch a production-quality dashboard.', status: 'PUBLISHED', publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), handle: '@YoussefManssouriTech', views: 24000, engagementRate: 4.1, likes: 1200, comments: 245, shares: 98 },
  { id: 'p3', accountId: 'acc_tt', platform: 'TIKTOK', title: 'Why you should learn Rust', content: 'Short answer: Speed and Safety.', status: 'PUBLISHED', publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), handle: '@youssef.manssouri', views: 98000, engagementRate: 8.2, likes: 8000, comments: 642, shares: 980 },
  { id: 'p4', accountId: 'acc_li', platform: 'LINKEDIN', title: 'The Future of AI pair programming', content: 'Drafting thoughts on how collaborative AI coding platforms will look.', status: 'SCHEDULED', scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), handle: '@youssef-manssouri' }
];

const MOCK_COMPETITORS: any[] = [
  { id: 'comp1', platform: 'YOUTUBE', handle: '@tech_reviews_hub', displayName: 'Tech Reviews Hub', followers: 154000, engagementRate: 3.8, weeklyGrowthRate: 1.2 },
  { id: 'comp2', platform: 'INSTAGRAM', handle: '@design_inspiration', displayName: 'Design Inspiration', followers: 92000, engagementRate: 4.5, weeklyGrowthRate: 0.8 },
  { id: 'comp3', platform: 'TIKTOK', handle: '@ai_explainer', displayName: 'AI Explainer Shorts', followers: 320000, engagementRate: 7.9, weeklyGrowthRate: 2.1 }
];

const MOCK_REPORTS: any[] = [
  { id: 'rep1', title: 'Weekly Performance Audit', format: 'CSV', rangeStart: '2026-07-01', rangeEnd: '2026-07-12', createdAt: new Date().toISOString() }
];

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('pulseiq_token') || 'mock_developer_token';
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error('Server error');
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && (contentType.includes('csv') || contentType.includes('pdf') || contentType.includes('octet-stream'))) {
      return response.blob();
    }

    return await response.json();
  } catch (error) {
    console.warn(`[InsightFlow Proxy Check] Backend is offline. Resolving ${endpoint} using Client Mock Engine.`);
    return handleMockRequest(endpoint, options);
  }
}

// Client-Side Mock Router
function handleMockRequest(endpoint: string, options: RequestInit) {
  const method = options.method || 'GET';
  const url = new URL(endpoint, 'http://localhost:3000');
  const path = url.pathname;

  // 1. Profile & Settings
  if (path === '/api/users/profile') {
    return {
      id: 'usr_default',
      name: 'Youssef Manssouri',
      email: 'youssef.manssouri@example.com',
      subscription: { plan: 'PRO', status: 'active' },
      settings: { theme: 'dark', emailNotifications: true }
    };
  }
  if (path === '/api/settings') {
    return { id: 'set_default', theme: 'dark', emailNotifications: true, weeklyDigest: true, securityAlerts: true };
  }

  // 2. Social Accounts
  if (path === '/api/social/accounts') {
    return MOCK_ACCOUNTS;
  }
  if (path === '/api/social/connect') {
    const body = JSON.parse(options.body as string);
    const newAcc = {
      id: `acc_new_${Math.random()}`,
      platform: body.platform,
      handle: body.handle,
      displayName: body.displayName || body.handle,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };
    MOCK_ACCOUNTS.push(newAcc);
    return newAcc;
  }

  // 3. Analytics
  if (path === '/api/analytics/summary') {
    return {
      totalFollowers: 616200,
      followersChange: 8.4,
      totalViews: 1450000,
      viewsChange: 12.1,
      avgEngagementRate: 5.5,
      engagementChange: 0.45,
      totalReach: 1200000,
      reachChange: 9.8,
      platformDistribution: MOCK_ACCOUNTS.map(a => ({ platform: a.platform, handle: a.handle, followers: 80000 }))
    };
  }
  if (path === '/api/analytics/historical') {
    const range = url.searchParams.get('range') || 'month';
    const limit = range === 'week' ? 7 : range === 'year' ? 12 : 30;
    const history = [];
    const now = new Date();
    for (let i = limit; i >= 0; i--) {
      const d = new Date();
      if (range === 'year') {
        d.setMonth(now.getMonth() - i);
      } else {
        d.setDate(now.getDate() - i);
      }
      history.push({
        date: d.toISOString().split('T')[0],
        followers: 120000 + i * 200 + Math.floor(Math.random() * 500),
        views: 45000 + Math.floor(Math.random() * 20000),
        likes: 2500 + Math.floor(Math.random() * 1000),
        shares: 300 + Math.floor(Math.random() * 150),
        comments: 200 + Math.floor(Math.random() * 100),
        reach: 40000 + Math.floor(Math.random() * 15000),
        engagementRate: Number((4.5 + Math.random() * 2).toFixed(2))
      });
    }
    return history;
  }
  if (path === '/api/analytics/top-posts') {
    return MOCK_POSTS.filter(p => p.status === 'PUBLISHED');
  }
  if (path === '/api/analytics/demographics') {
    return {
      countries: [
        { name: 'United States', value: 42 },
        { name: 'Germany', value: 15 },
        { name: 'Morocco', value: 14 },
        { name: 'United Kingdom', value: 12 },
        { name: 'France', value: 10 }
      ],
      devices: [
        { name: 'Mobile', value: 68 },
        { name: 'Desktop', value: 25 },
        { name: 'Tablet', value: 7 }
      ],
      trafficSources: [
        { name: 'Organic Search', value: 45 },
        { name: 'Social Shares', value: 30 },
        { name: 'Direct', value: 15 }
      ]
    };
  }

  // 4. Content Calendar
  if (path === '/api/calendar/posts') {
    if (method === 'POST') {
      const body = JSON.parse(options.body as string);
      const newPost = {
        id: `p_${Math.random()}`,
        accountId: body.accountId,
        platform: MOCK_ACCOUNTS.find(a => a.id === body.accountId)?.platform || 'YOUTUBE',
        title: body.title,
        content: body.content,
        status: body.status,
        scheduledFor: body.scheduledFor,
        publishedAt: body.status === 'PUBLISHED' ? new Date().toISOString() : null
      };
      MOCK_POSTS.push(newPost);
      return newPost;
    }
    return MOCK_POSTS;
  }
  if (path.startsWith('/api/calendar/posts/')) {
    const id = path.split('/').pop();
    if (method === 'PATCH') {
      const body = JSON.parse(options.body as string);
      const postIdx = MOCK_POSTS.findIndex(p => p.id === id);
      if (postIdx > -1) {
        MOCK_POSTS[postIdx] = { ...MOCK_POSTS[postIdx], ...body };
        return MOCK_POSTS[postIdx];
      }
    }
    if (method === 'DELETE') {
      const postIdx = MOCK_POSTS.findIndex(p => p.id === id);
      if (postIdx > -1) MOCK_POSTS.splice(postIdx, 1);
      return { success: true };
    }
  }

  // 5. Competitors
  if (path === '/api/competitors') {
    return MOCK_COMPETITORS;
  }
  if (path === '/api/competitors/compare') {
    const platform = url.searchParams.get('platform') || 'YOUTUBE';
    const list = MOCK_COMPETITORS.filter(c => c.platform === platform).map(c => ({
      id: c.id, name: c.displayName, handle: c.handle, isUser: false, followers: c.followers, engagementRate: c.engagementRate, postsCount: 15
    }));
    list.unshift({
      id: 'usr_bench', name: 'Youssef Manssouri', handle: '@youssef', isUser: true, followers: 124000, engagementRate: 5.5, postsCount: 12
    });
    return {
      benchmarks: list,
      aiSummary: `You are performing strongly compared to design benchmarks on ${platform}, holding a 5.5% engagement rate compared to the average 4.1%. Focus on tutorial content to gain views.`
    };
  }

  // 6. AI Assistant
  if (path === '/api/ai/conversations') {
    if (method === 'POST') {
      const newConv = { id: `c_${Math.random()}`, title: 'New Conversation', updatedAt: new Date().toISOString() };
      MOCK_CONVERSATIONS.push(newConv);
      return newConv;
    }
    return MOCK_CONVERSATIONS;
  }
  if (path.includes('/api/ai/conversations/') && path.endsWith('/messages')) {
    const convId = path.split('/')[4];
    if (method === 'POST') {
      const body = JSON.parse(options.body as string);
      const userMsg = { id: `m_${Math.random()}`, role: 'user', content: body.content };
      if (!MOCK_MESSAGES[convId]) MOCK_MESSAGES[convId] = [];
      MOCK_MESSAGES[convId].push(userMsg);

      // Simple rules fallback for AI answers
      const promptLower = body.content.toLowerCase();
      let reply = "I analyzed your channels! Focus on tutorial content to grow.";
      if (promptLower.includes('hook') || promptLower.includes('suggest')) {
        reply = "### Hooks for your Next.js project 💡\n\n1. 'Next.js 15 routing changes everything. Here is how...' (Twitter)\n2. 'I built an AI assistant in 10 lines of code. Watch this...' (TikTok)\n\nUse #webdev #nextjs to increase reach.";
      } else if (promptLower.includes('why') || promptLower.includes('reach')) {
        reply = "### Reach Diagnostics 📊\n\nYour YouTube impressions dropped because views retention went below 40%. Build a high-affinity hook in the first 10 seconds of your tutorials to capture viewers.";
      }
      
      const botMsg = { id: `m_${Math.random()}`, role: 'assistant', content: reply };
      MOCK_MESSAGES[convId].push(botMsg);
      return botMsg;
    }
    return MOCK_MESSAGES[convId] || [];
  }

  // 7. Notifications
  if (path === '/api/notifications') {
    return MOCK_NOTIFICATIONS;
  }
  if (path === '/api/notifications/read-all') {
    MOCK_NOTIFICATIONS.forEach(n => n.read = true);
    return { success: true };
  }

  // 8. Reports
  if (path === '/api/reports') {
    if (method === 'POST') {
      const body = JSON.parse(options.body as string);
      const newRep = { id: `rep_${Math.random()}`, title: body.title, format: body.format, rangeStart: body.rangeStart, rangeEnd: body.rangeEnd, createdAt: new Date().toISOString() };
      MOCK_REPORTS.push(newRep);
      return newRep;
    }
    return MOCK_REPORTS;
  }

  // Fallback blob for reports download mock
  if (path.includes('/download')) {
    return new Blob(['Platform,Handle,Date,Followers,Views\nYouTube,@youssef,2026-07-12,124000,45000\n'], { type: 'text/csv' });
  }

  return null;
}
