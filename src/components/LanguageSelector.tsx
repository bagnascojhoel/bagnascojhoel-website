"use client";

import React from "react";

const LanguageSelector = () => {
  return (
    <select
      className="h-10 px-3 pr-8 border border-border rounded-lg bg-card text-foreground font-mono text-sm cursor-pointer transition-all hover:border-primary shadow-sm appearance-none select-chevron"
      aria-label="Select language"
      defaultValue="en"
      onChange={(e) => console.log("Language changed to:", e.target.value)}
    >
      <option value="en">🇺🇸 EN</option>
      <option value="pt">🇧🇷 PT</option>
    </select>
  );
};

export default LanguageSelector;
