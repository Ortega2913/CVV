import React, { useEffect, useRef, useState } from "react";
import { interpolate } from "remotion";

// An SVG <path> that "draws itself" by animating stroke-dashoffset.
// progress: 0 -> nothing drawn, 1 -> fully drawn.
export const DrawnPath: React.FC<
  React.SVGProps<SVGPathElement> & { progress: number }
> = ({ progress, ...props }) => {
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(1000);

  useEffect(() => {
    if (ref.current) {
      try {
        setLen(ref.current.getTotalLength());
      } catch {
        // jsdom / SSR fallback
      }
    }
  }, [props.d]);

  const p = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <path
      ref={ref}
      {...props}
      strokeDasharray={len}
      strokeDashoffset={len * (1 - p)}
    />
  );
};
