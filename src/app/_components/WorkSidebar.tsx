import React from 'react';
import CertificationWorkItem from './CertificationWorkItem';
import ProjectWorkItem from './ProjectWorkItem';
import ArticleWorkItem from './ArticleWorkItem';
import { getTranslations } from 'next-intl/server';
import { PublicWorkItem } from '@/core/domain/PublicWorkItem';
import { Certification } from '@/core/domain/Certification';
import { Project } from '@/core/domain/Project';
import { Article } from '@/core/domain/Article';
interface WorkSidebarProps {
  items?: PublicWorkItem[];
}
const renderWorkItem = (item: PublicWorkItem) => {
  switch (item.workItemType) {
    case 'certification':
      return <CertificationWorkItem key={item.id} item={item as Certification} />;
    case 'project':
      return <ProjectWorkItem key={item.id} item={item as Project} />;
    case 'article':
      return <ArticleWorkItem key={item.id} item={item as Article} />;
    default:
      return null;
  }
};
const WorkSidebar = async ({ items = [] }: WorkSidebarProps) => {
  const t = await getTranslations('Work');
  const workItems: PublicWorkItem[] = items;

  return (
    <section
      className="w-full h-auto md:h-full md:bg-card md:border-x border-border z-40 transition-all custom-scrollbar md:overflow-y-auto py-10 md:py-0"
      id="work"
    >
      <div className="md:p-8 md:pt-20 md:pb-10">
        <div className="flex flex-col gap-4 mb-8">
          <h2 className="text-3xl font-bold font-mono text-foreground">{t('title')}</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">{t('subtitle')}</p>
        </div>

        <div className="flex flex-col gap-3">{workItems.map(renderWorkItem)}</div>
      </div>
    </section>
  );
};

export default WorkSidebar;
