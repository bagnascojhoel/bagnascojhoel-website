export interface Article {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  publishedAt?: string;
}
