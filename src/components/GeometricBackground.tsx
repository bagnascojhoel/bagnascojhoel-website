"use client";

import React from "react";

const GeometricBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Large Squares */}
      <div className="absolute w-[150px] h-[150px] border-[3px] border-primary rounded-xl opacity-[0.12] top-[10%] right-[5%] animate-float" />
      <div className="absolute w-[150px] h-[150px] border-[3px] border-primary rounded-xl opacity-[0.12] bottom-[25%] left-[-2%] animate-float [animation-delay:-7s]" />
      
      {/* Medium Squares */}
      <div className="absolute w-[100px] h-[100px] border-[2px] border-accent rounded-lg opacity-[0.15] top-[25%] left-[5%] animate-float [animation-delay:-3s]" />
      <div className="absolute w-[100px] h-[100px] border-[2px] border-accent rounded-lg opacity-[0.15] top-[70%] right-[30%] animate-float [animation-delay:-10s]" />
      <div className="absolute w-[100px] h-[100px] border-[2px] border-accent rounded-lg opacity-[0.15] bottom-[30%] left-[5%] animate-float [animation-delay:-5s]" />
      
      {/* Small Squares */}
      <div className="absolute w-[50px] h-[50px] bg-primary rounded-md opacity-[0.1] top-[12%] right-[8%] animate-float [animation-delay:-2s]" />
      <div className="absolute w-[50px] h-[50px] bg-primary rounded-md opacity-[0.1] top-[80%] left-[35%] animate-float [animation-delay:-8s]" />
      <div className="absolute w-[50px] h-[50px] bg-primary rounded-md opacity-[0.1] top-[55%] right-[45%] animate-float [animation-delay:-11s]" />
    </div>
  );
};

export default GeometricBackground;
