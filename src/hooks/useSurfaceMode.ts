import { useState, useEffect, useCallback } from 'react';
import { usePricing } from '../store/PricingContext';

export type SurfaceMode = 'simple' | 'advanced';

export interface SurfaceModeState {
  mode: SurfaceMode;
  isAdvanced: boolean;
  isSimple: boolean;
  toggleMode: () => void;
  setMode: (newMode: SurfaceMode) => void;
}

/**
 * Custom hook to manage Per-Surface, Per-User mode (Simple vs Advanced).
 *
 * Rules:
 * 1. Per-surface (not global): Each surface ID maintains its own independent state.
 * 2. Default OFF (Simple): New users always start in 'simple' mode.
 * 3. Lossless: Mode toggling never destroys underlying data.
 * 4. Remembers last state per user + surface in localStorage.
 */
export function useSurfaceMode(surfaceId: string, defaultMode: SurfaceMode = 'simple'): SurfaceModeState {
  const { userRole, userName } = usePricing();

  // Create a unique persistence key scoped to the user (role + name) and surface
  const userKey = userRole || userName || 'default_pricing_user';
  const storageKey = `pricing_studio_mode_${userKey}_${surfaceId}`;

  const [mode, setModeState] = useState<SurfaceMode>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'simple' || saved === 'advanced') {
        return saved;
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    return defaultMode;
  });

  // Re-sync if user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'simple' || saved === 'advanced') {
        setModeState(saved);
      } else {
        setModeState(defaultMode);
      }
    } catch {
      setModeState(defaultMode);
    }
  }, [storageKey, defaultMode]);

  const setMode = useCallback(
    (newMode: SurfaceMode) => {
      setModeState(newMode);
      try {
        localStorage.setItem(storageKey, newMode);
      } catch (err) {
        console.warn('Failed to save surface mode to localStorage:', err);
      }
    },
    [storageKey]
  );

  const toggleMode = useCallback(() => {
    setMode(mode === 'simple' ? 'advanced' : 'simple');
  }, [mode, setMode]);

  return {
    mode,
    isAdvanced: mode === 'advanced',
    isSimple: mode === 'simple',
    toggleMode,
    setMode,
  };
}
