import { Complexity } from './Complexity';

export interface ExtraPortfolioDescription {
  title: string;
  customDescription?: string;
  customTopics?: string[];
  websiteUrl?: string;
  complexity?: Complexity;
  showEvenArchived?: boolean;
  isHidden?: boolean;
}
