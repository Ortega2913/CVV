import React from 'react';

const Vignette: React.FC<{intensity?: number}> = ({intensity = 0.65}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 90,
        background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
      }}
    />
  );
};

export default Vignette;
