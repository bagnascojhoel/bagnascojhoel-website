'use client';

import React, { useState } from 'react';
import { Layers, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicWorkItem } from '@/core/domain/PublicWorkItem';
import { useTranslations } from 'next-intl';

interface WorkItemProps {
  item: PublicWorkItem;
}

const WorkItem = ({ item }: WorkItemProps) => {
  const initialExpanded = 'startsOpen' in item ? (item.startsOpen ?? false) : false;
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const t = useTranslations('Work');

  const toggleExpand = (e: React.MouseEvent) => {
    if (isExpanded && (e.target as HTMLElement).closest('a')) {
      return;
    }

    if (!isExpanded && (e.target as HTMLElement).closest('a')) {
      e.preventDefault();
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <motion.article
      layout
      onClick={toggleExpand}
      className={`p-4 border border-border rounded-xl bg-card transition-colors cursor-pointer hover:border-primary ${
        isExpanded ? 'shadow-warm' : ''
      }`}
    >
      <motion.span
        layout
        className="block text-xs font-mono font-medium uppercase tracking-wider text-primary mb-1"
      >
        {t(`type.${item.workItemType}`)}
      </motion.span>

      <motion.h3
        layout
        className="text-base font-semibold font-mono leading-tight mb-3 text-foreground"
      >
        {item.title}
      </motion.h3>

      <AnimatePresence initial={false}>
        {!isExpanded && (
          <motion.div
            key="collapsed-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers size={14} />
              <span className="text-xs font-mono">{item.tags.length} topics</span>
            </div>
            <div className="p-1 rounded text-muted-foreground transition-colors group-hover:text-primary group-hover:bg-primary/10">
              <ArrowUpRight size={16} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="expanded-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-end">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-mono text-primary hover:underline"
              >
                {t('viewProject')} <ArrowUpRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default WorkItem;
