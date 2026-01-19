import { Complexity } from './Complexity';

export interface ExtraPortfolioDescription {
  title: string;
  customDescription?: string;
  customTopics?: string[];
  websiteUrl?: string;
  complexity?: Complexity;
  startsOpen?: boolean;
  showEvenArchived?: boolean;
}
