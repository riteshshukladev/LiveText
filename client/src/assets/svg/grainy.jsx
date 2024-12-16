import React from "react";

const grainyBackground = () => {
  return (
    <svg viewBox="0 0 100 100">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.3"
          numOctaves="3"
          seed="5"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" fill="black"/>
    </svg>
  );
};

export default grainyBackground;
