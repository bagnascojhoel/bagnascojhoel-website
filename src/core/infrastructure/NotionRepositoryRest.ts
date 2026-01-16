import { injectable } from 'inversify';
import { NotionRepository as NotionPort } from '@/core/domain/NotionRepository';
import { NotionPage } from '@/core/domain/NotionPage';

@injectable()
export class NotionRepositoryRest implements NotionPort {
  private readonly databaseId = process.env.NOTION_DATABASE_ID;
  private readonly apiKey = process.env.NOTION_API_KEY;

  async fetchPages(): Promise<NotionPage[]> {
    // Mocked response - replace with real Notion API integration
    return [
      {
        id: 'abc-123',
        title: 'Building Scalable Microservices with Spring Boot',
        description:
          'A comprehensive guide on designing and implementing microservices architecture',
        url: 'https://notion.so/article-1',
        tags: ['Spring Boot', 'Microservices', 'Architecture'],
        publishedAt: '2024-10-15T00:00:00Z',
        status: 'published',
      },
      {
        id: 'def-456',
        title: 'Modern Frontend Development with React and TypeScript',
        description: 'Deep dive into building type-safe React applications',
        url: 'https://notion.so/article-2',
        tags: ['React', 'TypeScript', 'Frontend'],
        publishedAt: '2024-11-20T00:00:00Z',
        status: 'published',
      },
    ];
  }
}
