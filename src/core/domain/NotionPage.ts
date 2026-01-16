export interface NotionPage {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  publishedAt?: string | null;
  status: 'draft' | 'published';
}
