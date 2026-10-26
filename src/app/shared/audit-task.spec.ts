import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AuditTaskComponent } from './audit-task';
import { TASKS } from '../content/audit';
import { ProgressService } from '../core/progress';
describe('edición de tareas', () => {
  it('conserva un borrador al guardar otra tarea', async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    const f = TestBed.createComponent(AuditTaskComponent);
    f.componentRef.setInput('task', TASKS[0]);
    await f.whenStable();
    f.detectChanges();
    const textarea = f.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'Borrador sin guardar';
    textarea.dispatchEvent(new Event('input'));
    f.detectChanges();
    TestBed.inject(ProgressService).updateTask('A2', 'in-review', 'otra tarea', '');
    await f.whenStable();
    f.detectChanges();
    expect(textarea.value).toBe('Borrador sin guardar');
  });
});
