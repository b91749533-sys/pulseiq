import { PrismaClient, PlanType, PlatformType, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with production-quality analytics data...');

  // 1. Create default user
  const user = await prisma.user.upsert({
    where: { email: 'youssef.manssouri@example.com' },
    update: {},
    create: {
      clerkId: 'user_default_clerk_id',
      email: 'youssef.manssouri@example.com',
      name: 'Youssef Manssouri',
      subscription: {
        create: {
          plan: PlanType.PRO,
          status: 'active',
          startDate: new Date(),
        },
      },
      settings: {
        create: {
          theme: 'dark',
          emailNotifications: true,
          weeklyDigest: true,
          securityAlerts: true,
        },
      },
    },
  });

  console.log(`Seeded user: ${user.name} (${user.id})`);

  // 2. Define platforms and handles
  const platformConfigs = [
    { type: PlatformType.YOUTUBE, handle: '@YoussefManssouriTech', displayName: 'Youssef Manssouri Tech', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150' },
    { type: PlatformType.INSTAGRAM, handle: '@youssef_manssouri', displayName: 'Youssef Manssouri', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { type: PlatformType.TIKTOK, handle: '@youssef.manssouri', displayName: 'Youssef Manssouri AI', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { type: PlatformType.LINKEDIN, handle: 'youssef-manssouri', displayName: 'Youssef Manssouri', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    { type: PlatformType.TWITTER, handle: '@youssefm_ai', displayName: 'Youssef Manssouri', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  ];

  const connectedAccounts = [];

  for (const config of platformConfigs) {
    const account = await prisma.socialAccount.upsert({
      where: {
        userId_platform_platformId: {
          userId: user.id,
          platform: config.type,
          platformId: `platform_id_${config.type.toLowerCase()}`,
        },
      },
      update: {},
      create: {
        userId: user.id,
        platform: config.type,
        platformId: `platform_id_${config.type.toLowerCase()}`,
        handle: config.handle,
        displayName: config.displayName,
        avatarUrl: config.avatar,
        accessToken: 'simulated_access_token',
        refreshToken: 'simulated_refresh_token',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days out
      },
    });
    connectedAccounts.push(account);
  }

  // 3. Seed historical daily metrics for the past 30 days
  const now = new Date();
  console.log('Seeding 30 days of historical daily metrics...');

  for (const account of connectedAccounts) {
    // Starting values based on platform
    let followers = 0;
    let reachFactor = 0;
    let engagementRate = 0;

    switch (account.platform) {
      case PlatformType.YOUTUBE:
        followers = 124000;
        reachFactor = 45000;
        engagementRate = 4.2;
        break;
      case PlatformType.INSTAGRAM:
        followers = 85200;
        reachFactor = 32000;
        engagementRate = 5.8;
        break;
      case PlatformType.TIKTOK:
        followers = 345000;
        reachFactor = 120000;
        engagementRate = 8.4;
        break;
      case PlatformType.LINKEDIN:
        followers = 18900;
        reachFactor = 15000;
        engagementRate = 6.2;
        break;
      case PlatformType.TWITTER:
        followers = 43100;
        reachFactor = 22000;
        engagementRate = 2.9;
        break;
    }

    for (let i = 30; i >= 0; i--) {
      const recordedAt = new Date();
      recordedAt.setDate(now.getDate() - i);

      // Add a simulated positive trend with small perturbations
      const dailyGrowth = Math.floor(Math.random() * 200) + (i === 0 ? 0 : 50); 
      followers += dailyGrowth;

      const views = Math.floor(reachFactor * (0.8 + Math.random() * 0.4));
      const reach = Math.floor(views * 0.85);
      const impressions = Math.floor(views * 1.3);
      
      const likes = Math.floor(views * (engagementRate / 100) * 0.7);
      const comments = Math.floor(likes * 0.15);
      const shares = Math.floor(likes * 0.1);

      await prisma.analyticsMetric.create({
        data: {
          accountId: account.id,
          recordedAt,
          followers,
          following: Math.floor(followers * 0.01),
          totalPosts: 50 + (30 - i),
          reach,
          impressions,
          engagementRate: Number((engagementRate + (Math.random() * 0.8 - 0.4)).toFixed(2)),
          views,
          likes,
          shares,
          comments,
        },
      });
    }
  }

  // 4. Seed Posts & PostMetrics
  console.log('Seeding recent content calendar posts and metrics...');
  const samplePosts = [
    {
      title: 'AI Agent Architecture in 2026',
      content: 'Here is a breakdown of how agentic workflows are replacing typical chatbots. We look at planning, memory retrieval, and MCP tools. Let me know your thoughts!',
      platform: PlatformType.LINKEDIN,
      daysAgo: 5,
      status: PostStatus.PUBLISHED,
    },
    {
      title: 'Building InsightFlow SaaS Full-Stack Walkthrough',
      content: 'In this video, I reveal how to build and launch a production-quality dashboard using Next.js 15, NestJS, and Prisma. Full repo in description!',
      platform: PlatformType.YOUTUBE,
      daysAgo: 2,
      status: PostStatus.PUBLISHED,
    },
    {
      title: 'Why you should learn Rust in 2026',
      content: 'Short answer: Speed and Safety. Long answer in this 60-second walkthrough.',
      platform: PlatformType.TIKTOK,
      daysAgo: 1,
      status: PostStatus.PUBLISHED,
    },
    {
      title: 'Linear Design Aesthetics breakdown',
      content: 'Why is standard SaaS UI so boring? Let us dissect how Linear, Arc, and Vercel build world-class interfaces.',
      platform: PlatformType.INSTAGRAM,
      daysAgo: 3,
      status: PostStatus.PUBLISHED,
    },
    {
      title: 'Scaling BullMQ background tasks',
      content: 'Here is how to set up Redis and NestJS workers for bulk API indexing without slowing down user actions.',
      platform: PlatformType.TWITTER,
      daysAgo: 4,
      status: PostStatus.PUBLISHED,
    },
    {
      title: 'The Future of AI pair programming',
      content: 'Drafting thoughts on how collaborative AI coding platforms will look in the coming months.',
      platform: PlatformType.LINKEDIN,
      daysAgo: -2, // Scheduled 2 days from now
      status: PostStatus.SCHEDULED,
    },
    {
      title: 'Instagram engagement hacks',
      content: 'An educational breakdown of how reels retention affects algorithmic push.',
      platform: PlatformType.INSTAGRAM,
      daysAgo: -1, // Scheduled 1 day from now
      status: PostStatus.SCHEDULED,
    },
  ];

  for (const postData of samplePosts) {
    const account = connectedAccounts.find(a => a.platform === postData.platform);
    if (!account) continue;

    const scheduledFor = new Date();
    scheduledFor.setDate(now.getDate() - postData.daysAgo);

    const post = await prisma.post.create({
      data: {
        accountId: account.id,
        platform: postData.platform,
        title: postData.title,
        content: postData.content,
        status: postData.status,
        scheduledFor: postData.daysAgo < 0 ? scheduledFor : null,
        publishedAt: postData.daysAgo >= 0 ? scheduledFor : null,
        externalId: postData.daysAgo >= 0 ? `external_post_id_${Math.random().toString(36).substr(2, 9)}` : null,
      },
    });

    // If published, add metrics
    if (postData.status === PostStatus.PUBLISHED) {
      let baseViews = 0;
      switch (post.platform) {
        case PlatformType.YOUTUBE: baseViews = 24000; break;
        case PlatformType.INSTAGRAM: baseViews = 15000; break;
        case PlatformType.TIKTOK: baseViews = 98000; break;
        case PlatformType.LINKEDIN: baseViews = 8400; break;
        case PlatformType.TWITTER: baseViews = 12000; break;
      }

      // Add a couple of metrics records representing growth
      for (let dayOffset = postData.daysAgo; dayOffset >= 0; dayOffset--) {
        const metricDate = new Date();
        metricDate.setDate(now.getDate() - dayOffset);

        const views = Math.floor(baseViews * (1 - dayOffset / (postData.daysAgo + 1)));
        const likes = Math.floor(views * 0.05);
        const comments = Math.floor(likes * 0.12);
        const shares = Math.floor(likes * 0.08);

        await prisma.postMetric.create({
          data: {
            postId: post.id,
            recordedAt: metricDate,
            views,
            likes,
            comments,
            shares,
            impressions: Math.floor(views * 1.4),
            engagementRate: Number((((likes + comments + shares) / (views || 1)) * 100).toFixed(2)),
          },
        });
      }
    }
  }

  // 5. Seed Competitors & CompetitorMetrics
  console.log('Seeding competitor data...');
  const competitorConfigs = [
    { platform: PlatformType.YOUTUBE, handle: '@tech_reviews_hub', displayName: 'Tech Reviews Hub', baseFollowers: 154000, er: 3.8 },
    { platform: PlatformType.INSTAGRAM, handle: '@design_inspiration', displayName: 'Design Inspiration', baseFollowers: 92000, er: 4.5 },
    { platform: PlatformType.TIKTOK, handle: '@ai_explainer', displayName: 'AI Explainer Shorts', baseFollowers: 320000, er: 7.9 },
    { platform: PlatformType.LINKEDIN, handle: 'dan-builder', displayName: 'Dan Code Builder', baseFollowers: 16000, er: 5.1 },
    { platform: PlatformType.TWITTER, handle: '@code_trends', displayName: 'Code Trends', baseFollowers: 49000, er: 2.1 },
  ];

  for (const compConfig of competitorConfigs) {
    const competitor = await prisma.competitor.create({
      data: {
        userId: user.id,
        platform: compConfig.platform,
        handle: compConfig.handle,
        displayName: compConfig.displayName,
        followers: compConfig.baseFollowers,
        engagementRate: compConfig.er,
        weeklyGrowthRate: 1.2,
      },
    });

    let followers = compConfig.baseFollowers - 1200;
    for (let i = 15; i >= 0; i--) {
      const recordedAt = new Date();
      recordedAt.setDate(now.getDate() - i);
      followers += Math.floor(Math.random() * 150) + 30;

      await prisma.competitorMetric.create({
        data: {
          competitorId: competitor.id,
          recordedAt,
          followers,
          engagementRate: Number((compConfig.er + (Math.random() * 0.4 - 0.2)).toFixed(2)),
          growthRate: 1.1 + Math.random() * 0.4,
          postsCount: 12 + Math.floor(Math.random() * 3),
        },
      });
    }
  }

  // 6. Seed notifications
  console.log('Seeding user notifications...');
  const notifications = [
    { title: 'Best Time to Post', message: 'Your optimal posting time starts in 30 minutes for YouTube.', type: 'info' },
    { title: 'Viral Alert!', message: 'Your latest TikTok post on Rust has 3x higher engagement than average!', type: 'success' },
    { title: 'Engagement Change', message: 'Your Instagram weekly engagement dropped by 5% compared to the prior week.', type: 'warning' },
    { title: 'Weekly Report Ready', message: 'Your analytics report for Jul 5 - Jul 12 is prepared and ready for download.', type: 'success' },
    { title: 'Competitor Update', message: '@ai_explainer gained 3,400 followers this week.', type: 'info' },
  ];

  for (const notif of notifications) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
      },
    });
  }

  // 7. Seed sample AI Conversation
  console.log('Seeding initial AI conversation...');
  const conv = await prisma.aIConversation.create({
    data: {
      userId: user.id,
      title: 'Engagement Strategy',
    },
  });

  await prisma.aIMessage.createMany({
    data: [
      {
        conversationId: conv.id,
        role: 'user',
        content: 'Why did my LinkedIn post perform so much better than my last YouTube video?',
      },
      {
        conversationId: conv.id,
        role: 'assistant',
        content: 'Hi Youssef! Looking at your metrics, your LinkedIn post ("AI Agent Architecture in 2026") had a 6.2% engagement rate, which was fueled by 189 comments. The topic resonated strongly with professional developers. By contrast, your YouTube video is 20 minutes long and requires higher friction to watch. I recommend repurposing the core findings of your LinkedIn post into a short 60-second video for TikTok and YouTube Shorts to maximize visual reach.',
      },
    ],
  });

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
