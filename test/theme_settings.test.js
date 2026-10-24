import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { createDefaultAppData } from '../src/data/defaultAppData.js';
import * as repo from '../src/repositories/appRepository.js';
import { translations } from '../src/data/translations.js';

function createMockStorage(initial = {}) {
  const store = { ...initial };
  return {
    store,
    getItem(key) {
      return this.store[key] ?? null;
    },
    setItem(key, val) {
      this.store[key] = String(val);
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
  };
}

describe('Theme and Settings System Verification', () => {
  it('1. Default theme in app data is light', () => {
    const data = createDefaultAppData();
    assert.strictEqual(data.settings.theme, 'light', 'Default theme is light');
    assert.strictEqual(data.settings.textSize, 'normal', 'Default textSize is normal');
    assert.strictEqual(data.settings.highContrast, false, 'Default highContrast is false');
    assert.strictEqual(data.settings.discreetMode, false, 'Default discreetMode is false');
  });

  it('2. Theme settings persist across storage reload (light, dark, system)', () => {
    globalThis.localStorage = createMockStorage();

    const data = repo.loadAppData();
    assert.strictEqual(data.settings.theme, 'light');

    // Switch to dark theme
    data.settings.theme = 'dark';
    repo.saveAppData(data);
    const reloadedDark = repo.loadAppData();
    assert.strictEqual(reloadedDark.settings.theme, 'dark', 'Persisted dark theme');

    // Switch to system theme
    data.settings.theme = 'system';
    repo.saveAppData(data);
    const reloadedSystem = repo.loadAppData();
    assert.strictEqual(reloadedSystem.settings.theme, 'system', 'Persisted system theme');

    // Switch back to light theme
    data.settings.theme = 'light';
    repo.saveAppData(data);
    const reloadedLight = repo.loadAppData();
    assert.strictEqual(reloadedLight.settings.theme, 'light', 'Persisted light theme');
  });

  it('3. Bilingual translations match for all theme and appearance keys', () => {
    const requiredKeys = ['appearance', 'themeLight', 'themeDark', 'themeSystem', 'themeDesc'];

    for (const key of requiredKeys) {
      assert.ok(
        translations.en.accessibility[key],
        `English translation exists for accessibility.${key}`
      );
      assert.ok(
        translations.hi.accessibility[key],
        `Hindi translation exists for accessibility.${key}`
      );
      assert.ok(
        translations.en.accessibility[key].length > 0,
        `English text for ${key} is non-empty`
      );
      assert.ok(
        translations.hi.accessibility[key].length > 0,
        `Hindi text for ${key} is non-empty`
      );
    }
  });

  it('4. SettingsView provides accessible 3-way segmented control for themes', () => {
    const settingsCode = fs.readFileSync(
      path.resolve('src/components/views/SettingsView.jsx'),
      'utf8'
    );

    assert.ok(settingsCode.includes('handleThemeChange("light")'), 'Has light theme toggle');
    assert.ok(settingsCode.includes('handleThemeChange("dark")'), 'Has dark theme toggle');
    assert.ok(settingsCode.includes('handleThemeChange("system")'), 'Has system theme toggle');
    assert.ok(settingsCode.includes('aria-pressed={theme === "light"}'), 'Light theme aria-pressed');
    assert.ok(settingsCode.includes('aria-pressed={theme === "dark"}'), 'Dark theme aria-pressed');
    assert.ok(settingsCode.includes('aria-pressed={theme === "system"}'), 'System theme aria-pressed');
  });

  it('5. Layout component resolves theme and applies data-theme & dark classes', () => {
    const layoutCode = fs.readFileSync(
      path.resolve('src/components/layout/Layout.jsx'),
      'utf8'
    );

    assert.ok(layoutCode.includes('prefers-color-scheme: dark'), 'Handles system media query');
    assert.ok(layoutCode.includes('data-theme={resolvedTheme}'), 'Applies data-theme attribute');
    assert.ok(layoutCode.includes('classList.toggle("dark"'), 'Toggles dark class on documentElement');
    assert.ok(layoutCode.includes('data-contrast'), 'Retains high contrast attribute');
    assert.ok(layoutCode.includes('data-text-size'), 'Retains text size attribute');
  });

  it('6. index.css contains dark theme tokens, dark high-contrast, and utility overrides', () => {
    const cssCode = fs.readFileSync(
      path.resolve('src/index.css'),
      'utf8'
    );

    assert.ok(cssCode.includes('[data-theme="dark"]'), 'Defines [data-theme="dark"]');
    assert.ok(cssCode.includes('--bg: #1B1522'), 'Defines deep plum-charcoal dark background');
    assert.ok(cssCode.includes('--card: #281F30'), 'Defines deep plum dark card surface');
    assert.ok(cssCode.includes('--ink: #F7EDF5'), 'Defines luminous pearl dark text');
    assert.ok(cssCode.includes('[data-theme="dark"][data-contrast="high"]'), 'Defines dark high contrast');
    assert.ok(cssCode.includes('[data-theme="dark"] .bg-white'), 'Overrides .bg-white in dark theme');
    assert.ok(cssCode.includes('[data-theme="dark"] .text-\\[\\#292536\\]'), 'Overrides charcoal text in dark theme');
  });

  it('7. Complete bilingual parity across all translation dictionary sections', () => {
    const enSections = Object.keys(translations.en);
    const hiSections = Object.keys(translations.hi);

    assert.deepStrictEqual(
      enSections.sort(),
      hiSections.sort(),
      'Both English and Hindi contain the exact same translation sections'
    );

    for (const section of enSections) {
      const enKeys = Object.keys(translations.en[section]);
      const hiKeys = Object.keys(translations.hi[section]);

      for (const key of enKeys) {
        assert.ok(
          hiKeys.includes(key),
          `Hindi section "${section}" is missing key "${key}"`
        );
        assert.ok(
          typeof translations.hi[section][key] === 'string' &&
            translations.hi[section][key].length > 0,
          `Hindi translation for ${section}.${key} is non-empty`
        );
      }
    }
  });

  it('8. Accessible text sizing and high contrast CSS rules are defined', () => {
    const cssCode = fs.readFileSync(
      path.resolve('src/index.css'),
      'utf8'
    );

    assert.ok(cssCode.includes('[data-text-size="normal"]'), 'Normal text size definition');
    assert.ok(cssCode.includes('--font-scale: 16px'), 'Normal scale 16px');
    assert.ok(cssCode.includes('[data-text-size="large"]'), 'Large text size definition');
    assert.ok(cssCode.includes('--font-scale: 18px'), 'Large scale 18px');
    assert.ok(cssCode.includes('[data-contrast="high"]'), 'High contrast definition');
  });

  it('9. Privacy architecture: local-only data repositories, no remote analytics', () => {
    const repoCode = fs.readFileSync(
      path.resolve('src/repositories/appRepository.js'),
      'utf8'
    );

    assert.ok(repoCode.includes('STORAGE_KEY = "saheli.appData.v1"'), 'Uses local storage key');
    assert.ok(!repoCode.includes('fetch('), 'No remote fetch in app repository');
    assert.ok(!repoCode.includes('axios'), 'No axios remote transmission');
  });
});
