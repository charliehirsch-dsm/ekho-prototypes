import { createContext, useContext, useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Viewport override context (for device preview toggling in prototypes)
// ---------------------------------------------------------------------------
export const ViewportWidthContext = createContext<number | null>(null);

function evaluateWidthQuery(query: string, width: number): boolean {
  const maxMatch = query.match(/max-width:\s*(\d+)px/);
  if (maxMatch) return width <= parseInt(maxMatch[1], 10);

  const minMatch = query.match(/min-width:\s*(\d+)px/);
  if (minMatch) return width >= parseInt(minMatch[1], 10);

  return false;
}

// ---------------------------------------------------------------------------
// useMediaQuery hook
// ---------------------------------------------------------------------------
export function useMediaQuery(query: string): boolean {
  const overrideWidth = useContext(ViewportWidthContext);

  const [matches, setMatches] = useState(() => {
    if (overrideWidth !== null) return evaluateWidthQuery(query, overrideWidth);
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (overrideWidth !== null) {
      setMatches(evaluateWidthQuery(query, overrideWidth));
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    setMatches(mediaQuery.matches);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query, overrideWidth]);

  return matches;
}
