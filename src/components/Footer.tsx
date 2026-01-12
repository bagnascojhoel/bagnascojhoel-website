import React from 'react';
import { Coffee } from 'lucide-react';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full py-10" id="footer">
      <div className="px-0">
        <hr className="border-border mb-8" />
        <div className="flex items-center justify-center gap-2 text-primary font-mono text-sm font-semibold">
          <span>{t('madeBy')}</span>
          <Coffee size={16} className="text-primary" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
