import { createContext, useContext } from 'react';

// Context to suppress inline Notes in Spec View where the commentary
// sidebar replaces inline annotations.
export const HideNotesContext = createContext(false);
export function useHideNotes() { return useContext(HideNotesContext); }
