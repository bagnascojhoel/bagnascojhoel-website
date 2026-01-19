import { GithubCodeRepositoryBuilder } from '@/core/domain/GithubCodeRepository';
import { GithubCodeRepository } from '@/core/domain/GithubCodeRepository';

interface GithubRepoData {
  id?: number;
  name?: string;
  fullName?: string;
  full_name?: string;
  owner?: { login?: string } | string;
  description?: string | null;
  htmlUrl?: string;
  html_url?: string;
  topics?: string[];
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  language?: string | null;
  lang?: string | null;
  stargazersCount?: number;
  stargazers_count?: number;
  homepage?: string | null;
  home_page?: string | null;
  archived?: boolean;
}

export class GithubCodeRepositoryJson {
  constructor(private readonly data: unknown) {}

  toDomain(): GithubCodeRepository {
    const d = (this.data as GithubRepoData) || {};
    const ownerLogin = d.owner && typeof d.owner === 'object' ? d.owner.login : typeof d.owner === 'string' ? d.owner : undefined;

    return GithubCodeRepositoryBuilder.create()
      .withId(d.id ?? 0)
      .withName(d.name ?? '')
      .withFullName(d.fullName ?? d.full_name ?? '')
      .withOwnerLogin(ownerLogin ?? 'unknown')
      .withDescription(d.description ?? null)
      .withHtmlUrl(d.htmlUrl ?? d.html_url ?? `https://github.com/${d.full_name ?? d.fullName}`)
      .withTopics(d.topics ?? [])
      .withCreatedAt(d.createdAt ?? d.created_at ?? new Date().toISOString())
      .withUpdatedAt(d.updatedAt ?? d.updated_at ?? new Date().toISOString())
      .withLanguage(d.language ?? d.lang ?? null)
      .withStargazersCount(d.stargazersCount ?? d.stargazers_count ?? 0)
      .withHomepage(d.homepage ?? d.home_page ?? null)
      .withArchived(d.archived ?? false)
      .build();
  }
}
