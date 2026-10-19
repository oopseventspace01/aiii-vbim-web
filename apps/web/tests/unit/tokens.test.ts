import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// 確認 tokens.css 與 SPEC.md 第 4 節的色票一致，避免被誤改
const css = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf-8');

const specColors: Record<string, string> = {
  '--bg': '#06101a',
  '--bg-2': '#0a1724',
  '--panel': '#0d1d2b',
  '--panel-2': '#102334',
  '--text': '#f7fbff',
  '--text-2': '#c9d6e3',
  '--muted': '#9fb0c3',
  '--cyan': '#51d7ff',
  '--blue': '#438eff',
  '--green': '#68f0ad',
  '--amber': '#ffb454',
  '--max': '1240px',
};

describe('design tokens', () => {
  for (const [name, value] of Object.entries(specColors)) {
    it(`${name} = ${value}`, () => {
      expect(css).toContain(`${name}: ${value};`);
    });
  }
});
