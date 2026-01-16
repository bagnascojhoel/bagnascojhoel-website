// DEPRECATED: Server-side use-cases now provide Public Work data. This API route is kept for compatibility but will be removed.
import { NextResponse } from 'next/server';
import certificationsData from '@/data/certifications.json';

/**
 * Mock function to fetch projects from GitHub API
 * TODO: Implement real GitHub API integration
 */
async function fetchGitHubProjects(): Promise<any[]> {
  // Mock data - will be replaced with real GitHub API calls
  return [
    {
      id: 'gh-1',
      type: 'Project',
      title: 'Kwik: Ecommerce Platform Using Latest of my Knowledge',
      description:
        'Ecommerce application built with Java 17, Spring Boot, and Postgres. Management UI uses React, TypeScript, and Tailwind, deployed to AWS via GitHub Actions.',
      tags: ['Spring Boot', 'React', 'TypeScript', 'AWS'],
      link: 'https://github.com/bagnascojhoel/kwik-ecommerce',
    },
    {
      id: 'gh-2',
      type: 'Project',
      title: 'This Website: Built from Design to Deployment with Context Engineering (Vibe Coding)',
      description:
        'Monorepo including front-end, BFF, and blog. Built with Spring, Svelte, Java, and automated deployments via GitHub Actions.',
      tags: ['Java', 'Svelte', 'Monorepo'],
      link: 'https://github.com/bagnascojhoel/portfolio-website-monorepo',
    },
    {
      id: 'gh-3',
      type: 'Project',
      title: 'Kwik Chat API: Chat Interface with LLMs on Python',
      description:
        'Python API for LLM-based chat interactions, using Flask and clean architecture, deployed on Fly.io.',
      tags: ['Python', 'Flask', 'Clean Architecture'],
      link: 'https://github.com/bagnascojhoel/kwik-chat-api',
    },
  ];
}

/**
 * Mock function to fetch articles from Notion API
 * TODO: Implement real Notion API integration
 */
async function fetchNotionArticles(): Promise<any[]> {
  // Mock data - will be replaced with real Notion API calls
  return [
    {
      id: 'notion-1',
      type: 'Article',
      title: 'Building Scalable Microservices with Spring Boot',
      description:
        'A comprehensive guide on designing and implementing microservices architecture using Spring Boot, covering service discovery, API gateways, and distributed tracing.',
      tags: ['Spring Boot', 'Microservices', 'Architecture'],
      link: 'https://notion.so/article-1',
    },
    {
      id: 'notion-2',
      type: 'Article',
      title: 'Modern Frontend Development with React and TypeScript',
      description:
        'Deep dive into building type-safe React applications with TypeScript, covering hooks, context, and performance optimization techniques.',
      tags: ['React', 'TypeScript', 'Frontend'],
      link: 'https://notion.so/article-2',
    },
  ];
}

/**
 * GET /api/public-work
 * Returns a combined list of certifications, projects (from GitHub), and articles (from Notion)
 */
export async function GET() {
  try {
    // Fetch all data sources in parallel
    const [certifications, projects, articles] = await Promise.all([
      Promise.resolve(certificationsData as WorkItemType[]),
      fetchGitHubProjects(),
      fetchNotionArticles(),
    ]);

    // Combine all items
    const allItems = [...(certifications as any[]), ...(projects as any[]), ...(articles as any[])];

    return NextResponse.json(allItems, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('Error fetching public work items:', error);
    return NextResponse.json({ error: 'Failed to fetch public work items' }, { status: 500 });
  }
}
