export type WorkItemType = 'Project' | 'Article' | 'Certification';

export interface Project {
  id: string;
  type: WorkItemType; // keep `type` for UI compatibility
  title: string;
  description: string;
  tags: string[];
  link: string;
  createdAt?: string; // ISO string for serialization
  updatedAt?: string;
}
