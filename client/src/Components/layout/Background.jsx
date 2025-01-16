import React from 'react';

const Background = ({ children, isLoading }) => {
  return (
    <div className="screen relative">
      {/* Base Background */}
      <div className="base-background"></div>
      
      {/* Grainy Background */}
      <div className="background relative overflow-hidden"></div>
      
      {/* Waves */}
      <div className={`absolute bottom-0 w-full h-[25vh] wave-1 ${isLoading ? "loading" : ""}`} />
      <div className={`absolute bottom-0 w-full h-[20vh] wave-2 ${isLoading ? "loading" : ""}`} />
      <div className={`absolute bottom-0 w-full h-[15vh] wave-3 ${isLoading ? "loading" : ""}`} />
      <div className={`absolute bottom-0 w-full h-[7vh] wave-4 ${isLoading ? "loading" : ""}`} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;