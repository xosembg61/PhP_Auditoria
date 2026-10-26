import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LESSONS, EVIDENCE_DRILLS } from '../content/learning';
import { refById } from '../content/references';
import { ProgressService, downloadFile } from '../core/progress';
import {
  PLAN_QUESTIONS,
  PlanInput,
  PlanAction,
  validPlanInput,
  buildActionPlan,
  actionPlanMarkdown,
  supportRequestMarkdown,
} from '../core/action-plan';
import {
  PageHeaderComponent,
  IconComponent,
  SourceRefsComponent,
  InfoExpanderComponent,
} from '../shared/ui';
@Component({
  imports: [
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    IconComponent,
    SourceRefsComponent,
    InfoExpanderComponent,
  ],
  templateUrl: './academy.html',
})
export class AcademyPage {
  readonly p = inject(ProgressService);
  readonly lessons = LESSONS;
  readonly drills = EVIDENCE_DRILLS;
  readonly questions = PLAN_QUESTIONS;
  readonly tabs = [
    { id: 'lessons', label: 'Lecciones guiadas', icon: 'book' },
    { id: 'plan', label: 'Resolver mi caso', icon: 'shield' },
    { id: 'evidence', label: 'Practicar evidencias', icon: 'search' },
    { id: 'resources', label: 'Informes y lecturas', icon: 'file' },
  ];
  readonly activeTab = signal('lessons');
  readonly lessonIndex = signal(0);
  readonly depth = signal(
    this.p.storage.read<'simple' | 'technical'>(
      'academy-depth',
      'simple',
      (v): v is 'simple' | 'technical' => v === 'simple' || v === 'technical',
    ),
  );
  readonly lesson = computed(() => LESSONS[this.lessonIndex()]);
  readonly lessonAnswers = signal<Record<string, string>>({});
  readonly drillAnswers = signal<Record<string, string>>({});
  readonly plan = signal<PlanAction[]>([]);
  answers: PlanInput = { role: 'learner', environment: '', patch: '', activity: '', coverage: '' };
  readonly resourceCards = [
    {
      id: 'foundation',
      label: 'Entender el descubrimiento',
      level: 'Contexto',
      how: 'Lee el recorrido de investigación. Distingue los indicios de 2024, las demostraciones posteriores y la divulgación.',
    },
    {
      id: 'php',
      label: 'Comprobar qué publicó PHP',
      level: 'Imprescindible',
      how: 'Consulta tanto el aviso del día 21 como el seguimiento del día 23. No cierres la revisión solo con un titular.',
    },
    {
      id: 'ubuntu-oom',
      label: 'Ver un backport documentado',
      level: 'Ejemplo de proveedor',
      how: 'Localiza la release y el paquete exactos. Esta referencia solo aplica al origen y revisión indicados.',
    },
    {
      id: 'ubuntu-state',
      label: 'Contrastar también el segundo CVE',
      level: 'Ejemplo de proveedor',
      how: 'No supongas que una corrección acreditada para un CVE cubre automáticamente el otro.',
    },
    {
      id: 'cli-options',
      label: 'Interpretar las consultas de consola',
      level: 'Consulta práctica',
      how: 'Revisa qué informa cada opción. Mantén separados los resultados CLI y el runtime web.',
    },
    {
      id: 'laravel-logs',
      label: 'Encontrar las fuentes de la aplicación',
      level: 'Consulta práctica',
      how: 'Identifica los canales realmente configurados; no des por hecho que todo termina en un único archivo.',
    },
    {
      id: 'aws',
      label: 'Razonar sobre actividad observada',
      level: 'Investigación',
      how: 'Separa telemetría de señuelos, intentos observados y evidencia de compromiso en el sistema que revisas.',
    },
    {
      id: 'owasp-logs',
      label: 'Documentar registros con cuidado',
      level: 'Metodología',
      how: 'Revisa datos a excluir, correlación, integridad y acceso a registros. Comparte referencias saneadas.',
    },
  ];
  constructor() {
    const params = inject(ActivatedRoute).snapshot.queryParamMap;
    const index = Number(params.get('lesson'));
    if (params.has('lesson') && Number.isInteger(index) && index >= 0 && index < LESSONS.length)
      this.lessonIndex.set(index);
    const tab = params.get('tab');
    if (this.tabs.some((t) => t.id === tab)) this.activeTab.set(tab!);
  }
  source = refById;
  setDepth(value: 'simple' | 'technical') {
    this.depth.set(value);
    this.p.storage.write('academy-depth', value);
  }
  chooseLesson(index: number) {
    if (index >= 0 && index < LESSONS.length) this.lessonIndex.set(index);
  }
  answerLesson(id: string) {
    this.lessonAnswers.update((a) => ({ ...a, [this.lesson().id]: id }));
  }
  selectedOption() {
    return this.lesson().question.options.find(
      (o) => o.id === this.lessonAnswers()[this.lesson().id],
    );
  }
  answerDrill(id: string, value: string) {
    this.drillAnswers.update((a) => ({ ...a, [id]: value }));
  }
  validPlan() {
    return validPlanInput(this.answers);
  }
  invalidatePlan() {
    this.plan.set([]);
  }
  generatePlan() {
    this.plan.set(buildActionPlan({ ...this.answers }));
  }
  downloadPlan() {
    const report = actionPlanMarkdown(this.answers);
    if (report)
      downloadFile('PHP2Shell_Plan_Orientativo.md', report, 'text/markdown;charset=utf-8');
  }
  downloadRequest() {
    downloadFile(
      'PHP2Shell_Solicitud_Al_Responsable.md',
      supportRequestMarkdown(),
      'text/markdown;charset=utf-8',
    );
  }
}
