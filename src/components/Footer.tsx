import React from "react";
import { Coffee } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-10" id="footer">
      <div className="px-0">
        <hr className="border-border mb-8" />
        <div className="flex items-center justify-center gap-2 text-primary font-mono text-sm font-semibold">
          <span>made with</span>
          <Coffee size={16} className="text-primary" />
          <span>by me</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
