import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'chatterbox-advanced-settings';

// Default values for advanced settings
const DEFAULT_SETTINGS = {
  exaggeration: 0.5,
  cfgWeight: 0.5,
  temperature: 0.8,
  repetitionPenalty: 1.2,
  minP: 0.05,
  topP: 1.0
};

interface AdvancedSettings {
  exaggeration: number;
  cfgWeight: number;
  temperature: number;
  repetitionPenalty: number;
  minP: number;
  topP: number;
}

export function useAdvancedSettings() {
  const [settings, setSettings] = useState<AdvancedSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all required fields exist and are valid numbers
        return {
          exaggeration: typeof parsed.exaggeration === 'number' ? parsed.exaggeration : DEFAULT_SETTINGS.exaggeration,
          cfgWeight: typeof parsed.cfgWeight === 'number' ? parsed.cfgWeight : DEFAULT_SETTINGS.cfgWeight,
          temperature: typeof parsed.temperature === 'number' ? parsed.temperature : DEFAULT_SETTINGS.temperature,
          repetitionPenalty: typeof parsed.repetitionPenalty === 'number' ? parsed.repetitionPenalty : DEFAULT_SETTINGS.repetitionPenalty,
          minP: typeof parsed.minP === 'number' ? parsed.minP : DEFAULT_SETTINGS.minP,
          topP: typeof parsed.topP === 'number' ? parsed.topP : DEFAULT_SETTINGS.topP
        };
      }
    } catch (error) {
      console.error('Error loading advanced settings:', error);
    }

    return DEFAULT_SETTINGS;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving advanced settings:', error);
    }
  }, [settings]);

  const updateExaggeration = useCallback((value: number) => {
    setSettings(prev => ({ ...prev, exaggeration: value }));
  }, []);

  const updateCfgWeight = useCallback((value: number) => {
    setSettings(prev => ({ ...prev, cfgWeight: value }));
  }, []);

  const updateTemperature = useCallback((value: number) => {
    setSettings(prev => ({ ...prev, temperature: value }));
  }, []);

  const updateRepetitionPenalty = useCallback((value: number) => {
    setSettings(prev => ({ ...prev, repetitionPenalty: value }));
  }, []);

  const updateMinP = useCallback((value: number) => {
    setSettings(prev => ({ ...prev, minP: value }));
  }, []);

  const updateTopP = useCallback((value: number) => {
    setSettings(prev => ({ ...prev, topP: value }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const isDefault = useCallback(() => {
    return (
      settings.exaggeration === DEFAULT_SETTINGS.exaggeration &&
      settings.cfgWeight === DEFAULT_SETTINGS.cfgWeight &&
      settings.temperature === DEFAULT_SETTINGS.temperature &&
      settings.repetitionPenalty === DEFAULT_SETTINGS.repetitionPenalty &&
      settings.minP === DEFAULT_SETTINGS.minP &&
      settings.topP === DEFAULT_SETTINGS.topP
    );
  }, [settings]);

  return {
    // Individual values
    exaggeration: settings.exaggeration,
    cfgWeight: settings.cfgWeight,
    temperature: settings.temperature,
    repetitionPenalty: settings.repetitionPenalty,
    minP: settings.minP,
    topP: settings.topP,

    // Update functions
    updateExaggeration,
    updateCfgWeight,
    updateTemperature,
    updateRepetitionPenalty,
    updateMinP,
    updateTopP,

    // Utility functions
    resetToDefaults,
    isDefault: isDefault(),

    // Full settings object for easy passing
    settings
  };
} 