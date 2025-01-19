import React from 'react'

const ChatBackground = ({children}) => {
    return (
        <div className="screen relative">
          {/* Base Background */}
          <div className="base-background"></div>
          
          {/* Grainy Background */}
          <div className="background relative overflow-hidden"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      );
}

export default ChatBackground