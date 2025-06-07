export interface GameSettings {
  camera: {
    zoom: number;
    x: number;
    y: number;
  };
}

export class GameStorage {
  private readonly STORAGE_KEY = 'fungal_dominion_settings';
  private defaultSettings: GameSettings = {
    camera: {
      zoom: 1,
      x: 0,
      y: 0,
    },
  };

  getSettings(): GameSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        return { ...this.defaultSettings, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }

    return this.defaultSettings;
  }

  saveSettings(settings: Partial<GameSettings>) {
    try {
      const current = this.getSettings();
      const updated = this.deepMerge(current, settings);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }

  updateCamera(camera: GameSettings['camera']) {
    this.saveSettings({ camera });
  }

  clearSettings() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear settings from localStorage:', error);
    }
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }
}

export const gameStorage = new GameStorage();
