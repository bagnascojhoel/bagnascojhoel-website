import { WorkItemType } from './Project';

export interface Certification {
  id: string;
  type: WorkItemType; // 'Certification'
  title: string;
  description: string;
  tags: string[];
  link: string;
  issuedAt?: string;
}
