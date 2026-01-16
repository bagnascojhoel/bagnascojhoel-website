export interface GitHubCodeRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  language: string | null;
  stargazersCount: number;
}
