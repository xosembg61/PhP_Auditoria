import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class StorageService {
  readonly warning = signal('');
  private readonly prefix = 'php2shell:v1:';
  read<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (raw === null) return fallback;
      const parsed: unknown = JSON.parse(raw);
      if (validate(parsed)) return parsed;
      this.warning.set(
        'El progreso guardado tenía un formato no reconocido. Se ha iniciado un estado limpio.',
      );
    } catch {
      this.warning.set(
        'El progreso funciona en esta pestaña, pero no se pudo recuperar del almacenamiento.',
      );
    }
    return fallback;
  }
  write(key: string, value: unknown) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch {
      this.warning.set(
        'No hay almacenamiento local disponible. Exporta el progreso antes de cerrar.',
      );
    }
  }
  clear() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k?.startsWith(this.prefix)) localStorage.removeItem(k);
      }
    } catch {
      this.warning.set('No se pudo borrar el almacenamiento.');
    }
  }
}
