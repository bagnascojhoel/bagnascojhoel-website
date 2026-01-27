export interface Certification {
  id: string;
  title: string;
  description: string;
  tags: string[];
  certificationUrl: string;
  relatedArticleUrl?: string;
  issuedAt?: string;
}
