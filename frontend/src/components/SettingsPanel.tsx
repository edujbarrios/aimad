import { useState, useEffect } from 'react';
import styles from './SettingsPanel.module.css';

export interface AppSettings {
  apiBaseUrl: string;
  ttsEnabled: boolean;
  ttsRate: number;    // 0.5 – 2.0
  ttsVolume: number;  // 0 – 1
  autoSpeak: boolean;
  pollingInterval: number; // seconds
  theme: 'cyan' | 'magenta' | 'gold';
}

export const DEFAULT_SETTINGS: AppSettings = {
  apiBaseUrl:      'http://localhost:8000',
  ttsEnabled:      true,
  ttsRate:         1.0,
  ttsVolume:       0.9,
  autoSpeak:       false,
  pollingInterval: 8,
  theme:           'cyan',
};

const STORAGE_KEY = 'aimad_settings';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as AppSettings;
  } catch {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(s: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  onChange?: (s: AppSettings) => void;
}

export default function SettingsPanel({ open, onClose, onChange }: SettingsPanelProps) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) setSettings(loadSettings());
  }, [open]);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    onChange?.(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    setSaved(false);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>SYSTEM CONFIGURATION</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {/* Connection */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>CONNECTION</h3>
            <label className={styles.field}>
              <span className={styles.label}>API Base URL</span>
              <input
                className={styles.input}
                type="url"
                value={settings.apiBaseUrl}
                onChange={(e) => update('apiBaseUrl', e.target.value)}
                placeholder="http://localhost:8000"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Health Poll Interval (s)</span>
              <input
                className={styles.input}
                type="number"
                min={2}
                max={60}
                value={settings.pollingInterval}
                onChange={(e) => update('pollingInterval', Number(e.target.value))}
              />
            </label>
          </section>

          {/* TTS */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>TEXT-TO-SPEECH</h3>
            <label className={`${styles.field} ${styles.toggle}`}>
              <span className={styles.label}>Enable TTS</span>
              <button
                className={`${styles.toggleBtn} ${settings.ttsEnabled ? styles.on : styles.off}`}
                onClick={() => update('ttsEnabled', !settings.ttsEnabled)}
              >
                {settings.ttsEnabled ? 'ON' : 'OFF'}
              </button>
            </label>
            <label className={`${styles.field} ${styles.toggle}`}>
              <span className={styles.label}>Auto-speak responses</span>
              <button
                className={`${styles.toggleBtn} ${settings.autoSpeak ? styles.on : styles.off}`}
                onClick={() => update('autoSpeak', !settings.autoSpeak)}
              >
                {settings.autoSpeak ? 'ON' : 'OFF'}
              </button>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>
                Speech Rate <small>({settings.ttsRate.toFixed(1)}×)</small>
              </span>
              <input
                className={styles.range}
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={settings.ttsRate}
                onChange={(e) => update('ttsRate', Number(e.target.value))}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>
                Volume <small>({Math.round(settings.ttsVolume * 100)}%)</small>
              </span>
              <input
                className={styles.range}
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings.ttsVolume}
                onChange={(e) => update('ttsVolume', Number(e.target.value))}
              />
            </label>
          </section>

          {/* Theme */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>THEME ACCENT</h3>
            <div className={styles.themeRow}>
              {(['cyan', 'magenta', 'gold'] as const).map((t) => (
                <button
                  key={t}
                  className={`${styles.themeBtn} ${styles[t]} ${settings.theme === t ? styles.selected : ''}`}
                  onClick={() => update('theme', t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={handleReset}>
            RESET DEFAULTS
          </button>
          <button
            className={`${styles.saveBtn} ${saved ? styles.savedOk : ''}`}
            onClick={handleSave}
          >
            {saved ? '✓ SAVED' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}
