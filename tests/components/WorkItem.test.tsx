import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import ArticleWorkItem from '@/app/_components/ArticleWorkItem';
import ProjectWorkItem from '@/app/_components/ProjectWorkItem';
import CertificationWorkItem from '@/app/_components/CertificationWorkItem';
import en from '../../data/messages/en.json';
import pt from '../../data/messages/pt-br.json';
describe('WorkItem Components', () => {
  describe('ArticleWorkItem', () => {
    it('renders localized work item type in English', () => {
      const item = {
        id: '1',
        title: 'Test',
        description: '',
        tags: [],
        link: '#',
      };
      render(
        <NextIntlClientProvider locale="en" messages={en}>
          <ArticleWorkItem item={item} />
        </NextIntlClientProvider>
      );
      expect(screen.getByText('Article')).toBeInTheDocument();
    });
  });
  describe('ProjectWorkItem', () => {
    it('renders localized work item type in Portuguese (pt-BR)', () => {
      const item = {
        id: '1',
        title: 'Projeto Test',
        description: '',
        tags: [],
        link: '#',
      };
      render(
        <NextIntlClientProvider locale="pt-BR" messages={pt}>
          <ProjectWorkItem item={item} />
        </NextIntlClientProvider>
      );
      expect(screen.getByText('Projeto')).toBeInTheDocument();
    });
    it('renders work item as collapsed by default', () => {
      const item = {
        id: '1',
        title: 'Test Project',
        description: 'Test description',
        tags: ['tag1'],
        link: '#',
      };
      render(
        <NextIntlClientProvider locale="en" messages={en}>
          <ProjectWorkItem item={item} />
        </NextIntlClientProvider>
      );
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    });
  });
  describe('CertificationWorkItem', () => {
    it('renders certification localized type', () => {
      const item = {
        id: '1',
        title: 'Cert Test',
        description: '',
        tags: [],
        certificationUrl: '#',
      };
      render(
        <NextIntlClientProvider locale="en" messages={en}>
          <CertificationWorkItem item={item} />
        </NextIntlClientProvider>
      );
      expect(screen.getByText('Certification')).toBeInTheDocument();
    });
  });
});
