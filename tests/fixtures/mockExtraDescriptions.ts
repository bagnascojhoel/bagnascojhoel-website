/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExtraPortfolioDescription } from '../../src/core/domain/ExtraPortfolioDescription';

// We keep explicit typing optional to avoid compilation errors while domain types are being added.
export const mockExtraDescriptionFull: any = {
  repositoryId: '101',
  title: 'Custom Project Title',
  customDescription: 'A custom long description for the project.',
  customTopics: ['custom', 'portfolio'],
  websiteUrl: 'https://example.com',
  complexity: 'extreme',
  showEvenArchived: true,
};

export const mockExtraDescriptionMinimal: any = {
  repositoryId: '102',
  title: 'Minimal Title',
};

export const mockExtraDescriptionPartial: any = {
  repositoryId: '103',
  title: 'Partial Title',
  customDescription: 'Partial description only',
};

export const mockExtraDescriptions: any[] = [
  mockExtraDescriptionFull,
  mockExtraDescriptionMinimal,
  mockExtraDescriptionPartial,
];

export const mockExtraDescriptionsMap = new Map<string, any>([
  ['101', mockExtraDescriptionFull],
  ['102', mockExtraDescriptionMinimal],
  ['103', mockExtraDescriptionPartial],
]);
