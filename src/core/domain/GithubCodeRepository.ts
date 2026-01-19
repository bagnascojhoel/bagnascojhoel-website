export class GithubCodeRepository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  htmlUrl: string;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  language: string | null;
  stargazersCount: number;
  homepage?: string | null;
  archived?: boolean;

  constructor(
    id: number,
    name: string,
    fullName: string,
    ownerLogin?: string,
    description?: string | null,
    htmlUrl?: string,
    topics: string[] = [],
    createdAt?: string,
    updatedAt?: string,
    language?: string | null,
    stargazersCount: number = 0,
    homepage?: string | null,
    archived: boolean = false
  ) {
    this.id = id;
    this.name = name;
    this.fullName = fullName;
    this.owner = ownerLogin ?? 'unknown';
    this.description = description ?? null;
    this.htmlUrl = htmlUrl ?? `https://github.com/${fullName}`;
    this.topics = topics ?? [];
    this.createdAt = createdAt ?? new Date().toISOString();
    this.updatedAt = updatedAt ?? new Date().toISOString();
    this.language = language ?? null;
    this.stargazersCount = stargazersCount;
    this.homepage = homepage ?? null;
    this.archived = archived;
  }
}

export class GithubCodeRepositoryBuilder {
  private params: Partial<{
    id: number;
    name: string;
    fullName: string;
    owner: { login: string } | undefined;
    description: string | null;
    htmlUrl: string;
    topics: string[];
    createdAt: string;
    updatedAt: string;
    language: string | null;
    stargazersCount: number;
    homepage?: string | null;
    archived?: boolean;
  }> = {};

  static create(): GithubCodeRepositoryBuilder {
    return new GithubCodeRepositoryBuilder();
  }

  withId(id: number): GithubCodeRepositoryBuilder {
    this.params.id = id;
    return this;
  }

  withName(name: string): GithubCodeRepositoryBuilder {
    this.params.name = name;
    return this;
  }

  withFullName(fullName: string): GithubCodeRepositoryBuilder {
    this.params.fullName = fullName;
    return this;
  }

  withOwnerLogin(ownerLogin: string): GithubCodeRepositoryBuilder {
    this.params.owner = { login: ownerLogin };
    return this;
  }

  withDescription(description?: string | null): GithubCodeRepositoryBuilder {
    this.params.description = description ?? null;
    return this;
  }

  withHtmlUrl(url: string): GithubCodeRepositoryBuilder {
    this.params.htmlUrl = url;
    return this;
  }

  withTopics(topics: string[] = []): GithubCodeRepositoryBuilder {
    this.params.topics = topics;
    return this;
  }

  withCreatedAt(createdAt: string): GithubCodeRepositoryBuilder {
    this.params.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: string): GithubCodeRepositoryBuilder {
    this.params.updatedAt = updatedAt;
    return this;
  }

  withLanguage(language?: string | null): GithubCodeRepositoryBuilder {
    this.params.language = language ?? null;
    return this;
  }

  withStargazersCount(count: number): GithubCodeRepositoryBuilder {
    this.params.stargazersCount = count;
    return this;
  }

  withHomepage(url?: string | null): GithubCodeRepositoryBuilder {
    this.params.homepage = url ?? null;
    return this;
  }

  withArchived(archived: boolean): GithubCodeRepositoryBuilder {
    this.params.archived = archived;
    return this;
  }

  build(): GithubCodeRepository {
    if (!this.params.id) throw new Error('id is required');
    if (!this.params.name) throw new Error('name is required');
    if (!this.params.fullName) throw new Error('fullName is required');

    // provide sensible defaults for missing required-ish fields
    const built = new GithubCodeRepository(
      this.params.id as number,
      this.params.name as string,
      this.params.fullName as string,
      this.params.owner?.login,
      this.params.description ?? null,
      this.params.htmlUrl ?? `https://github.com/${this.params.fullName}`,
      this.params.topics ?? [],
      this.params.createdAt ?? new Date().toISOString(),
      this.params.updatedAt ?? new Date().toISOString(),
      this.params.language ?? null,
      this.params.stargazersCount ?? 0,
      this.params.homepage ?? null,
      this.params.archived ?? false
    );

    return built;
  }
}
