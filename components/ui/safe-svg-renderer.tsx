import React from 'react';
interface SafeSvgRendererProps {
  svgString: string;
  className?: string;
}
export function SafeSvgRenderer({ svgString, className }: SafeSvgRendererProps) {
  const isSafeSvg = (svg: string): boolean => {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i, // onclick, onload, etc.
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /<link/i,
      /<meta/i,
      /<style.*javascript/i,
      /expression\s*\(/i,
      /url\s*\(\s*javascript/i,
    ];
    return !dangerousPatterns.some(pattern => pattern.test(svg));
  };
  if (!isSafeSvg(svgString)) {
    console.warn('Unsafe SVG content detected, rendering fallback');
    return (
      <div className={className}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 9.739s9-4.189 9-9.739V7l-10-5z"/>
        </svg>
      </div>
    );
  }
  return <div dangerouslySetInnerHTML={{ __html: svgString }} className={className} />;
}