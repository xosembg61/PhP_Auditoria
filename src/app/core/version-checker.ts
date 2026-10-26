import { PATCHES } from '../content/incident';
export interface VersionResult {
  kind: 'patched' | 'old' | 'unsupported' | 'unknown' | 'invalid';
  title: string;
  detail: string;
  patch?: string;
}
export function checkVersion(input: string, branch: string): VersionResult {
  const raw = input.trim();
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(raw))
    return {
      kind: 'invalid',
      title: 'No se puede evaluar',
      detail:
        'Introduce tres números separados por puntos, por ejemplo 8.3.35. Para paquetes de proveedor consulta la revisión exacta.',
    };
  const v = raw.split('.').map(Number);
  if (!v.every(Number.isSafeInteger))
    return {
      kind: 'invalid',
      title: 'No se puede evaluar',
      detail: 'Número fuera del intervalo admitido.',
    };
  const family = v[0] + '.' + v[1],
    legacy = v[0] < 8 || (v[0] === 8 && v[1] <= 1);
  if (
    (branch === 'legacy' && !legacy) ||
    (branch !== 'auto' && branch !== 'legacy' && branch !== family)
  )
    return {
      kind: 'invalid',
      title: 'La rama y la versión no coinciden',
      detail: 'Selecciona la rama de la versión introducida.',
    };
  if (legacy)
    return {
      kind: 'unsupported',
      title: 'Rama fuera del soporte oficial',
      detail:
        'Revisa el backport del proveedor o migra. Los parches fuente mínimos para 7.4, 8.0 y 8.1 no recuperan el soporte oficial.',
    };
  const patch = PATCHES[family];
  if (!patch)
    return {
      kind: 'unknown',
      title: 'Rama no incluida en la referencia',
      detail:
        'La tabla verificada el 26 de octubre de 2026 cubre 8.2–8.5. Consulta una fuente actual.',
    };
  if (v[2] < Number(patch.split('.')[2]))
    return {
      kind: 'old',
      title: 'Anterior al parche oficial',
      detail:
        'La versión upstream precede a ' +
        patch +
        '. Comprueba un backport documentado o actualiza.',
      patch,
    };
  return {
    kind: 'patched',
    title: 'Corrección oficial inicial incluida',
    detail:
      'El número upstream alcanza el parche del 21 de octubre. Confirma el runtime web y revisa el aviso del día 23. Esto no certifica tu sistema.',
    patch,
  };
}
