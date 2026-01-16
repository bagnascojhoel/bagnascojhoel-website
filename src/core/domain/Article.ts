import { WorkItemType } from './entities/Project';

export interface Article {
  id: string;
  type: WorkItemType; // 'Article'
  title: string;
  description: string;
  tags: string[];
  link: string;
  publishedAt?: string;
}
