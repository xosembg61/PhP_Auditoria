import { describe, it, expect } from 'vitest';
import { checkVersion } from './version-checker';
describe('comparador upstream', () => {
  it.each([
    ['8.3.35', 'old'],
    ['8.3.36', 'patched'],
    ['8.4.26', 'old'],
    ['8.4.27', 'patched'],
    ['8.5.12', 'patched'],
    ['8.2.35', 'patched'],
    ['8.3.9', 'old'],
    ['8.3.100', 'patched'],
    ['8.1.33', 'unsupported'],
    ['7.4.33', 'unsupported'],
    ['9.0.0', 'unknown'],
    ['8.6.0', 'unknown'],
  ])('%s devuelve %s', (v, kind) => expect(checkVersion(v, 'auto').kind).toBe(kind));
  it.each([
    '8.3.x',
    '8.3',
    'texto',
    '-1.3.1',
    '8.3.36-ubuntu1',
    '8.03.36',
    '8.3.1.2',
    '1e2.3.4',
    '9007199254740992.0.0',
  ])('rechaza %s', (v) => expect(checkVersion(v, 'auto').kind).toBe('invalid'));
  it('recorta espacios sin comparar lexicográficamente', () =>
    expect(checkVersion(' 8.3.36 ', '8.3').kind).toBe('patched'));
  it('valida coincidencia de rama', () => {
    expect(checkVersion('8.3.36', '8.4').kind).toBe('invalid');
    expect(checkVersion('8.2.35', 'legacy').kind).toBe('invalid');
  });
  it('incluye seguimiento, sin certificar seguridad', () =>
    expect(checkVersion('8.3.36', 'auto').detail).toContain('día 23'));
});
