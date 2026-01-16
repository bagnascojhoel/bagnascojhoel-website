'use client';

import React, { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { isMobileDevice } from '@/app/_lib/device';

const FloatingControls = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const mobileClasses = 'fixed bottom-6 right-6 flex flex-col items-end gap-4 z-[100]';
  const desktopClasses = 'fixed top-6 left-6 flex flex-row items-center gap-4 z-[100]';

  return (
    <div className={isMobile ? mobileClasses : desktopClasses}>
      <ThemeToggle />
      <LanguageSelector />
    </div>
  );
};

export default FloatingControls;
