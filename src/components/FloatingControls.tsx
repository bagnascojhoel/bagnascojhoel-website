"use client";

import React from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";

const FloatingControls = () => {
  return (
    <div className="fixed bottom-6 right-6 md:bottom-auto md:right-auto md:top-8 md:left-8 flex flex-col items-end md:flex-row md:items-center gap-4 z-[100]">
      <ThemeToggle />
      <LanguageSelector />
    </div>
  );
};

export default FloatingControls;
