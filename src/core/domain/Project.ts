export class Project {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly tags: string[],
    public readonly link: string,
    public readonly createdAt?: string, // ISO string for serialization
    public readonly updatedAt?: string,
    public readonly websiteUrl?: string,
    public readonly complexity?: string,
    public readonly startsOpen?: boolean
  ) {}
}

export class ProjectBuilder {
  private _id?: string;
  private _title?: string;
  private _description?: string;
  private _tags?: string[];
  private _link?: string;
  private _createdAt?: string;
  private _updatedAt?: string;
  private _websiteUrl?: string;
  private _complexity?: string;
  private _startsOpen?: boolean;

  withId(id: string): ProjectBuilder {
    this._id = id;
    return this;
  }

  withTitle(title: string): ProjectBuilder {
    this._title = title;
    return this;
  }

  withDescription(description: string): ProjectBuilder {
    this._description = description;
    return this;
  }

  withTags(tags: string[]): ProjectBuilder {
    this._tags = tags;
    return this;
  }

  withLink(link: string): ProjectBuilder {
    this._link = link;
    return this;
  }

  withCreatedAt(createdAt: string): ProjectBuilder {
    this._createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: string): ProjectBuilder {
    this._updatedAt = updatedAt;
    return this;
  }

  withWebsiteUrl(websiteUrl: string): ProjectBuilder {
    this._websiteUrl = websiteUrl;
    return this;
  }

  withComplexity(complexity: string): ProjectBuilder {
    this._complexity = complexity;
    return this;
  }

  withStartsOpen(startsOpen: boolean): ProjectBuilder {
    this._startsOpen = startsOpen;
    return this;
  }

  build(): Project {
    if (!this._id) throw new Error('Project id is required');
    if (!this._title) throw new Error('Project title is required');
    if (!this._description) throw new Error('Project description is required');
    if (!this._tags) throw new Error('Project tags are required');
    if (!this._link) throw new Error('Project link is required');

    return new Project(
      this._id,
      this._title,
      this._description,
      this._tags,
      this._link,
      this._createdAt,
      this._updatedAt,
      this._websiteUrl,
      this._complexity,
      this._startsOpen
    );
  }
}
