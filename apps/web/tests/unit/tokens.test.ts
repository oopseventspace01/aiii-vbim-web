import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// 確認 tokens.css 與 SPEC.md 第 4 節的色票一致，避免被誤改
const css = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf-8');

const specColors: Record<string, string> = {
  '--bg': '#ffffff',
  '--bg-2': '#f3f7fc',
  '--navy': '#0c1a33',
  '--text-2': '#34425e',
  '--muted': '#5a6a85',
  '--line': '#dce6f2',
  '--line-2': '#c9d8f0',
  '--blue': '#2160e8',
  '--blue-dark': '#1647b8',
  '--blue-soft': '#e8f0fe',
  '--blue-on-navy': '#8fb6ff',
  '--success': '#2f9e6e',
  '--success-bg': '#e6f6ef',
  '--max': '1280px',
};

describe('design tokens', () => {
  for (const [name, value] of Object.entries(specColors)) {
    it(`${name} = ${value}`, () => {
      expect(css).toContain(`${name}: ${value};`);
    });
  }
});
