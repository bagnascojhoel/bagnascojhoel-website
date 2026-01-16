import React from 'react';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <section className="pb-10" id="hero">
      <div className="flex flex-col gap-4">
        <span className="font-mono text-primary text-sm">@bagnascojhoel</span>

        <h1 className="text-4xl md:text-5xl font-bold font-mono">
          {t('greeting')} <span className="text-gradient">{t('name')}</span>
        </h1>

        <div className="flex flex-col gap-4 text-base md:text-lg leading-relaxed text-foreground max-w-2xl">
          <p>
            {t.rich('experience', {
              bold: chunks => (
                <span className="font-bold underline decoration-primary/30 underline-offset-4 decoration-2">
                  {chunks}
                </span>
              ),
            })}
          </p>

          <p>
            {t.rich('stack1', {
              tech: chunks => <span className="text-primary font-bold">{chunks}</span>,
            })}
          </p>

          <p>
            {t.rich('stack2', {
              tech: chunks => <span className="text-primary font-bold">{chunks}</span>,
            })}
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 mt-6" aria-label="Social links">
          <a
            href="https://blog.bagnascojhoel.com.br/"
            className="flex items-center gap-2 text-foreground transition-all hover:text-primary group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-2 rounded-full border border-border group-hover:border-primary transition-all">
              <ArrowUpRight size={18} />
            </div>
            <span className="font-mono text-sm underline decoration-border group-hover:decoration-primary underline-offset-4">
              {t('blog')}
            </span>
          </a>

          <a
            href="https://www.linkedin.com/in/bagnascojhoel"
            className="flex items-center gap-2 text-foreground transition-all hover:text-primary group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-2 rounded-full border border-border group-hover:border-primary transition-all">
              <Linkedin size={18} />
            </div>
            <span className="font-mono text-sm underline decoration-border group-hover:decoration-primary underline-offset-4">
              linkedin
            </span>
          </a>

          <a
            href="https://github.com/bagnascojhoel"
            className="flex items-center gap-2 text-foreground transition-all hover:text-primary group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-2 rounded-full border border-border group-hover:border-primary transition-all">
              <Github size={18} />
            </div>
            <span className="font-mono text-sm underline decoration-border group-hover:decoration-primary underline-offset-4">
              github
            </span>
          </a>

          <a
            href="mailto:bagnascojhoel@gmail.com"
            className="flex items-center gap-2 text-foreground transition-all hover:text-primary group"
          >
            <div className="p-2 rounded-full border border-border group-hover:border-primary transition-all">
              <Mail size={18} />
            </div>
            <span className="font-mono text-sm underline decoration-border group-hover:decoration-primary underline-offset-4">
              bagnascojhoel@gmail.com
            </span>
          </a>
        </nav>
      </div>
    </section>
  );
};

export default Hero;
