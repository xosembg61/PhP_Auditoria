import { describe, expect, it } from 'vitest';
import { SEARCH_INDEX, searchContent } from './search-index';
import { routes } from '../app.routes';

describe('búsqueda local', () => {
  it('encuentra términos con o sin acentos y combina palabras', () => {
    expect(searchContent('auditoria twinteach')[0].path).toBe('/auditoria');
    expect(searchContent('versión PHP')[0].path).toBe('/versiones');
    expect(searchContent('backport').some((entry) => entry.title === 'Backport')).toBe(true);
  });
  it('devuelve ayuda cuando no hay consulta y ningún resultado inventado', () => {
    expect(searchContent('   ')).toHaveLength(6);
    expect(searchContent('<script>desconocido</script>')).toEqual([]);
  });
  it('solo ofrece destinos internos válidos y una entrada para cada lección', () => {
    const paths = routes.map((route) => '/' + route.path);
    expect(SEARCH_INDEX.every((entry) => paths.includes(entry.path))).toBe(true);
    expect(SEARCH_INDEX.filter((entry) => entry.id.startsWith('lesson-'))).toHaveLength(6);
    expect(new Set(SEARCH_INDEX.map((entry) => entry.id)).size).toBe(SEARCH_INDEX.length);
  });
});
