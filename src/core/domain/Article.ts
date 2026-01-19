import { WorkItemType } from '@/core/domain/WorkItemType';

export interface Article {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  publishedAt?: string;
}
