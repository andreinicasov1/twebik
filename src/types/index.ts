export type RolUtilizator = 'user' | 'admin';

export type StareConcurs = 'activ' | 'in_curand' | 'terminat';
export type Dificultate = 'usor' | 'mediu' | 'greu';
export type TipConcurs = 'individual' | 'echipe';

export type LimbajProgramare = 'cpp' | 'java' | 'python' | 'javascript';

export interface User {
  id: string;
  nume: string;
  nickname: string;
  email: string;
  tara?: string;
  limbajPreferat?: LimbajProgramare;
  rol: RolUtilizator;
  rating: number;
  puncteTotale: number;
  clasamentGlobal: number;
  insigne: string[];
  esteBanat: boolean;
  concursuriCastigate: number;
}

export interface Contest {
  id: string;
  titlu: string;
  descriere: string;
  stare: StareConcurs;
  dificultate: Dificultate;
  tip: TipConcurs;
  startLa: string;
  finalLa: string;
  reguli: string[];
  premii: string[];
  participanti: number;
  problemeIds: string[];
}

export interface Problem {
  id: string;
  contestId: string;
  titlu: string;
  enunt: string;
  inputExemplu: string;
  outputExemplu: string;
  restrictii: string[];
  punctaj: number;
  dificultate: Dificultate;
  taguri: string[];
}

export type RezultatTrimitere = 'acceptat' | 'gresit' | 'timp_depasit';

export interface Submission {
  id: string;
  userId: string;
  contestId: string;
  problemId: string;
  limbaj: LimbajProgramare;
  cod: string;
  rezultat: RezultatTrimitere;
  scor: number;
  trimisLa: string;
}

export interface LeaderboardRow {
  userId: string;
  nickname: string;
  rating: number;
  puncte: number;
  rank: number;
  deltaRating: number;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  esteAutentificat: boolean;
  seIncarca: boolean;
}

export interface Notificare {
  id: string;
  mesaj: string;
  tip: 'succes' | 'info' | 'alerta';
  creatLa: string;
}

export interface Raportare {
  id: string;
  tip: 'utilizator' | 'solutie';
  raportatDe: string;
  tinta: string;
  motiv: string;
  status: 'nou' | 'in_analiza' | 'rezolvat';
  creatLa: string;
}

export interface FiltreConcurs {
  stare: StareConcurs | 'toate';
  dificultate: Dificultate | 'toate';
  tip: TipConcurs | 'toate';
  cautare: string;
}
