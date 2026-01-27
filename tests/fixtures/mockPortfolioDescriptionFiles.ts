/* eslint-disable @typescript-eslint/no-explicit-any */
export const mockPortfolioDescriptionFiles: { repositoryId: string; content: string }[] = [
  {
    repositoryId: 'repo-1',
    content: JSON.stringify({
      repositoryId: 'repo-1',
      title: 'Custom Project Title',
      description: 'A custom long description for the project.',
      tags: ['custom', 'portfolio'],
      websiteUrl: 'https://example.com',
      complexity: 'extreme',
      showEvenArchived: true,
    }),
  },
  {
    repositoryId: 'repo-malformed',
    content: '{ invalidJson: true,,, }',
  },
  {
    repositoryId: 'repo-missing-fields',
    content: JSON.stringify({ someField: 'value' }),
  },
];
