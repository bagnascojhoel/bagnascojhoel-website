import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import WorkItem from '@/app/_components/WorkItem';
import en from '../../data/messages/en.json';
import pt from '../../data/messages/pt-br.json';

describe('WorkItem', () => {
  it('renders localized work item type in English', () => {
    const item = {
      workItemType: 'article',
      title: 'Test',
      description: '',
      tags: [],
      link: '#',
    } as any;

    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <WorkItem item={item} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Article')).toBeInTheDocument();
  });

  it('renders localized work item type in Portuguese (pt-BR)', () => {
    const item = {
      workItemType: 'project',
      title: 'Projeto Test',
      description: '',
      tags: [],
      link: '#',
    } as any;

    render(
      <NextIntlClientProvider locale="pt-BR" messages={pt}>
        <WorkItem item={item} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Projeto')).toBeInTheDocument();
  });

  it('renders certification localized type', () => {
    const item = {
      workItemType: 'certification',
      title: 'Cert Test',
      description: '',
      tags: [],
      link: '#',
    } as any;

    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <WorkItem item={item} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Certification')).toBeInTheDocument();
  });

  it('renders work item as collapsed by default when startsOpen is false', () => {
    const item = {
      workItemType: 'project',
      title: 'Test Project',
      description: 'Test description',
      tags: ['tag1'],
      link: '#',
      startsOpen: false,
    } as any;

    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <WorkItem item={item} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  it('renders work item as expanded by default when startsOpen is true', () => {
    const item = {
      workItemType: 'project',
      title: 'Test Project',
      description: 'Test description',
      tags: ['tag1'],
      link: '#',
      startsOpen: true,
    } as any;

    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <WorkItem item={item} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders work item as collapsed by default when startsOpen is not provided', () => {
    const item = {
      workItemType: 'project',
      title: 'Test Project',
      description: 'Test description',
      tags: ['tag1'],
      link: '#',
    } as any;

    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <WorkItem item={item} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });
});
