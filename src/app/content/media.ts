export interface LearningVideo {
  id: string;
  title: string;
  author: string;
  date: string;
  language: string;
  kind: 'youtube' | 'mp4';
  videoId?: string;
  mediaUrl?: string;
  url: string;
  source: string;
  purpose: string;
  takeaway: string;
  poster: string;
}
export const LEARNING_VIDEOS: LearningVideo[] = [
  {
    id: 'php-intro',
    title: 'PHP in 100 Seconds',
    author: 'Fireship',
    date: '22/10/2021',
    language: 'Inglés · introducción general',
    kind: 'youtube',
    videoId: 'a7_WFUlFS94',
    url: 'https://www.youtube.com/watch?v=a7_WFUlFS94',
    source: 'https://www.youtube.com/watch?v=a7_WFUlFS94',
    purpose: 'Entender qué hace PHP en una web antes de estudiar el incidente.',
    takeaway:
      'Es una introducción anterior al incidente. Las versiones y medidas de seguridad se consultan en los avisos actuales de PHP.',
    poster: 'php',
  },
  {
    id: 'laravel-intro',
    title: 'Laravel in 100 Seconds',
    author: 'Fireship',
    date: '23/09/2022',
    language: 'Inglés · introducción general',
    kind: 'youtube',
    videoId: 'rIfdg_Ot-LI',
    url: 'https://www.youtube.com/watch?v=rIfdg_Ot-LI',
    source: 'https://www.youtube.com/watch?v=rIfdg_Ot-LI',
    purpose: 'Ubicar el framework en el backend y comprender su dependencia de PHP.',
    takeaway: 'El vídeo presenta Laravel; no acredita el estado del runtime de Twinteach.',
    poster: 'laravel',
  },
  {
    id: 'discovery',
    title: 'Breaking Down PHP2Shell with Sagi Tzadik & Thai Duong',
    author: 'Wiz · Crying Out Cloud · investigadores de Wiz y Calif',
    date: '21/10/2026',
    language: 'Inglés · conversación con investigadores',
    kind: 'youtube',
    videoId: 'lfEtbrz4-zY',
    url: 'https://www.youtube.com/watch?v=lfEtbrz4-zY',
    source:
      'https://www.wiz.io/crying-out-cloud/breaking-down-php2shell-with-sagi-tzadik-and-thai-duong',
    purpose: 'Conocer el descubrimiento y la coordinación de la divulgación de primera mano.',
    takeaway:
      'Separa identificar un fallo, demostrar su impacto y coordinar una corrección. La conversación no sustituye los avisos técnicos vigentes.',
    poster: 'research',
  },
  {
    id: 'investigation',
    title: 'PHP2Shell Threat Briefing',
    author: 'Jake Knott · watchTowr',
    date: 'Consulta: 26/10/2026',
    language: 'Inglés · sesión informativa de 15 minutos',
    kind: 'mp4',
    mediaUrl:
      'https://23785948.fs1.hubspotusercontent-na1.net/hubfs/23785948/watchTowr%20PHP2Shell%20Threat%20Briefing%20webinar.mp4',
    url: 'https://watchtowr.com/webinars/php2shell-threat-briefing/',
    source: 'https://watchtowr.com/webinars/php2shell-threat-briefing/',
    purpose: 'Comprender qué se observa en una red de señuelos y qué límites tiene esa evidencia.',
    takeaway:
      'La telemetría del proveedor no demuestra por sí sola compromiso de tu sistema. Correlaciona tus fuentes y su cobertura.',
    poster: 'investigation',
  },
];
export const MEDIA_CREDITS = [
  {
    title: 'Technician with laptop working on server rack at NERSC',
    author: 'Derrick Coetzee · Wikimedia Commons',
    license: 'CC0 1.0',
    url: 'https://commons.wikimedia.org/wiki/File:Technician_with_laptop_working_on_server_rack_at_NERSC.jpg',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    local: 'assets/images/tecnico-nersc.jpg',
    remote:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Technician_with_laptop_working_on_server_rack_at_NERSC.jpg/1280px-Technician_with_laptop_working_on_server_rack_at_NERSC.jpg',
    note: 'Foto de contexto de 2011; no es Twinteach ni el incidente.',
  },
  {
    title: 'Front of server racks at NERSC',
    author: 'Derrick Coetzee · Wikimedia Commons',
    license: 'CC0 1.0',
    url: 'https://commons.wikimedia.org/wiki/File:Front_of_server_racks_at_NERSC.jpg',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    local: 'assets/images/servidores-nersc.jpg',
    remote:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Front_of_server_racks_at_NERSC.jpg/1280px-Front_of_server_racks_at_NERSC.jpg',
    note: 'Foto de contexto de 2011; no identifica un servidor afectado.',
  },
];
