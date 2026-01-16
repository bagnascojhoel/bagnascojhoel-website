import React from 'react';
import { useTranslations } from 'next-intl';

const experiences = [
  {
    id: 'adp-senior',
    period: 'December 2024 - ',
    titleKey: 'items.adp-senior.title',
    company: 'ADP Brazil Labs',
    descriptionKey: 'items.adp-senior.description',
  },
  {
    id: 'petlove',
    period: 'April 2024 - December 2024',
    titleKey: 'items.petlove.title',
    company: 'Petlove',
    descriptionKey: 'items.petlove.description',
  },
  {
    id: 'adp-backend',
    period: 'June 2022 - April 2024',
    titleKey: 'items.adp-backend.title',
    company: 'ADP Brazil Labs',
    descriptionKey: 'items.adp-backend.description',
  },
  {
    id: 'cwi',
    period: 'July 2021 - June 2022',
    titleKey: 'items.cwi.title',
    company: 'CWI Software',
    descriptionKey: 'items.cwi.description',
  },
];

const Experience = () => {
  const t = useTranslations('Experience');

  return (
    <section id="experience" className="py-20">
      <div>
        <h2 className="text-3xl font-bold font-mono text-foreground mb-2">{t('title')}</h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-xl">{t('subtitle')}</p>

        <div className="flex flex-col gap-12 sm:gap-16">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-10 group">
              {/* Timeline marker and dashed line */}
              <div className="absolute left-0 top-0 h-full w-3 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary z-10 mt-2 shrink-0" />
                {index !== experiences.length - 1 && (
                  <div className="absolute top-5 bottom-[-4rem] sm:bottom-[-5rem] w-0 border-l-[3px] border-dashed border-border" />
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-mono text-muted-foreground">
                  {exp.id === 'adp-senior' ? `${exp.period}${t('present')}` : exp.period}
                </p>
                <h3 className="text-xl font-bold font-mono text-foreground">{t(exp.titleKey)}</h3>
                <p className="text-primary font-medium">{exp.company}</p>
                <p className="text-muted-foreground leading-relaxed mt-2 max-w-2xl">
                  {t(exp.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
