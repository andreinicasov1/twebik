import { GLOBAL_CONFIG } from '../global-config';
import {
  clasamentGlobalInitial,
  clasamentePeConcursInitial,
  concursuriInitiale,
  notificariPeUtilizatorInitiale,
  problemeInitiale,
  raportariInitiale,
  trimiteriInitiale,
  utilizatoriInitiali,
} from '../_mock/data';
import type {
  Contest,
  Dificultate,
  FiltreConcurs,
  LeaderboardRow,
  LimbajProgramare,
  Notificare,
  Problem,
  Raportare,
  RolUtilizator,
  StareConcurs,
  Submission,
  User,
} from '../types';

interface InputAutentificare {
  email: string;
  parola: string;
}

interface InputInregistrare {
  nume: string;
  nickname: string;
  email: string;
  parola: string;
  tara?: string;
  limbajPreferat?: LimbajProgramare;
}

interface InputTrimitere {
  userId: string;
  contestId: string;
  problemId: string;
  limbaj: LimbajProgramare;
  cod: string;
}

interface InputUpsertConcurs {
  id?: string;
  titlu: string;
  descriere: string;
  stare: StareConcurs;
  dificultate: Dificultate;
  tip: 'individual' | 'echipe';
  startLa: string;
  finalLa: string;
}

interface InputUpsertProblema {
  id?: string;
  contestId: string;
  titlu: string;
  enunt: string;
  punctaj: number;
  dificultate: Dificultate;
  taguri: string[];
}

const clone = <T,>(valoare: T): T => JSON.parse(JSON.stringify(valoare)) as T;

const utilizatori = clone(utilizatoriInitiali);
let concursuri = clone(concursuriInitiale);
let probleme = clone(problemeInitiale);
const trimiteri = clone(trimiteriInitiale);
let clasamentGlobal = clone(clasamentGlobalInitial);
const clasamentePeConcurs = clone(clasamentePeConcursInitial);
const notificariPeUtilizator = clone(notificariPeUtilizatorInitiale);
const raportari = clone(raportariInitiale);

const credentiale: Record<string, string> = {
  'admin@codepulse.ro': 'Admin123!',
  'andrei@codepulse.ro': 'Parola123!',
  'mihai@codepulse.ro': 'Parola123!',
  'elena@codepulse.ro': 'Parola123!',
  'radu@codepulse.ro': 'Parola123!',
};

const participariConcurs: Record<string, string[]> = {
  u1: ['c1', 'c4'],
  u2: ['c1', 'c4'],
  u3: ['c3', 'c4'],
  u4: ['c1', 'c2'],
  'u-admin': ['c1', 'c2', 'c3'],
};

function intarziere<T>(data: T, ms = GLOBAL_CONFIG.latentaMockMs): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(clone(data)), ms);
  });
}

function eroare(mesaj: string): never {
  throw new Error(mesaj);
}

function tokenPentru(userId: string): string {
  return `demo-token-${userId}`;
}

function userDinToken(token: string): User {
  const userId = token.replace('demo-token-', '');
  const utilizator = utilizatori.find((item) => item.id === userId);

  if (!utilizator) {
    eroare('Sesiune invalidă. Te rugăm să te autentifici din nou.');
  }

  return utilizator;
}

function actualizeazaClasamentGlobal(): void {
  clasamentGlobal = utilizatori
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .map((user, index) => ({
      userId: user.id,
      nickname: user.nickname,
      rating: user.rating,
      puncte: user.puncteTotale,
      rank: index + 1,
      deltaRating: 0,
    }));
}

function rezultatDinCod(cod: string): Submission['rezultat'] {
  const normalizat = cod.toLowerCase();

  if (normalizat.includes('timeout') || normalizat.includes('while(true)')) {
    return 'timp_depasit';
  }

  if (normalizat.includes('fixme') || normalizat.includes('todo') || cod.length < 30) {
    return 'gresit';
  }

  const aleator = Math.random();
  if (aleator < 0.7) return 'acceptat';
  if (aleator < 0.9) return 'gresit';
  return 'timp_depasit';
}

function scorDinRezultat(rezultat: Submission['rezultat'], punctajProblema: number): number {
  if (rezultat === 'acceptat') return punctajProblema;
  if (rezultat === 'gresit') return Math.round(punctajProblema * 0.1);
  return Math.round(punctajProblema * 0.05);
}

function statisticiAdmin() {
  const azi = new Date().toISOString().slice(0, 10);
  const trimiteriAzi = trimiteri.filter((item) => item.trimisLa.startsWith(azi)).length;

  return {
    numarUtilizatori: utilizatori.length,
    concursuriActive: concursuri.filter((item) => item.stare === 'activ').length,
    trimiteriAzi,
    raportariDeschise: raportari.filter((item) => item.status !== 'rezolvat').length,
  };
}

function ensureContestLeaderboard(contestId: string): LeaderboardRow[] {
  if (!clasamentePeConcurs[contestId]) {
    clasamentePeConcurs[contestId] = [];
  }

  return clasamentePeConcurs[contestId];
}

export const mockApi = {
  async autentificare(input: InputAutentificare): Promise<{ token: string; user: User }> {
    const { email, parola } = input;
    const utilizator = utilizatori.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!utilizator) {
      eroare('Nu există cont pentru acest email.');
    }

    if (utilizator.esteBanat) {
      eroare('Contul este suspendat. Contactează suportul.');
    }

    const parolaValida = credentiale[utilizator.email];
    if (!parolaValida || parolaValida !== parola) {
      eroare('Email sau parolă incorectă.');
    }

    return intarziere({ token: tokenPentru(utilizator.id), user: utilizator });
  },

  async inregistrare(input: InputInregistrare): Promise<{ token: string; user: User }> {
    const { email, nickname, parola, nume, tara, limbajPreferat } = input;

    if (parola.length < 8) {
      eroare('Parola trebuie să aibă minim 8 caractere.');
    }

    if (utilizatori.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
      eroare('Există deja un cont cu acest email.');
    }

    if (utilizatori.some((item) => item.nickname.toLowerCase() === nickname.toLowerCase())) {
      eroare('Nickname-ul este deja folosit.');
    }

    const idNou = `u${Date.now()}`;
    const userNou: User = {
      id: idNou,
      nume,
      nickname,
      email,
      tara,
      limbajPreferat,
      rol: 'user',
      rating: 1200,
      puncteTotale: 0,
      clasamentGlobal: utilizatori.length + 1,
      insigne: ['Debutant'],
      esteBanat: false,
      concursuriCastigate: 0,
    };

    utilizatori.unshift(userNou);
    credentiale[email] = parola;
    participariConcurs[idNou] = [];
    notificariPeUtilizator[idNou] = [
      {
        id: `n-${Date.now()}`,
        mesaj: 'Bine ai venit în CodePulse Arena!',
        tip: 'succes',
        creatLa: new Date().toISOString(),
      },
    ];
    actualizeazaClasamentGlobal();

    return intarziere({ token: tokenPentru(userNou.id), user: userNou });
  },

  async resetareParola(email: string): Promise<{ succes: boolean; mesaj: string }> {
    const exista = utilizatori.some((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!exista) {
      eroare('Nu există niciun cont pentru adresa introdusă.');
    }

    return intarziere({
      succes: true,
      mesaj: 'Dacă emailul este valid, vei primi instrucțiuni de resetare în câteva minute.',
    });
  },

  async getUtilizatorCurent(token: string): Promise<User> {
    return intarziere(userDinToken(token));
  },

  async getNotificari(userId: string): Promise<Notificare[]> {
    return intarziere(notificariPeUtilizator[userId] ?? []);
  },

  async getDashboardUtilizator(userId: string): Promise<{
    rating: number;
    pozitie: number;
    concursuriRecente: Contest[];
    active: number;
    inCurand: number;
    rezultate: number;
  }> {
    const user = utilizatori.find((item) => item.id === userId);
    if (!user) eroare('Utilizatorul nu a fost găsit.');

    const participari = participariConcurs[userId] ?? [];
    const concursuriRecente = concursuri
      .filter((item) => participari.includes(item.id))
      .slice(0, 4);

    const rezultate = trimiteri.filter((item) => item.userId === userId).length;

    return intarziere({
      rating: user.rating,
      pozitie: clasamentGlobal.find((item) => item.userId === userId)?.rank ?? 0,
      concursuriRecente,
      active: concursuri.filter((item) => item.stare === 'activ').length,
      inCurand: concursuri.filter((item) => item.stare === 'in_curand').length,
      rezultate,
    });
  },

  async getConcursuri(filtre?: Partial<FiltreConcurs>): Promise<Contest[]> {
    const rezultat = concursuri.filter((item) => {
      const okStare = !filtre?.stare || filtre.stare === 'toate' || item.stare === filtre.stare;
      const okDificultate =
        !filtre?.dificultate || filtre.dificultate === 'toate' || item.dificultate === filtre.dificultate;
      const okTip = !filtre?.tip || filtre.tip === 'toate' || item.tip === filtre.tip;
      const okText =
        !filtre?.cautare ||
        item.titlu.toLowerCase().includes(filtre.cautare.toLowerCase()) ||
        item.descriere.toLowerCase().includes(filtre.cautare.toLowerCase());

      return okStare && okDificultate && okTip && okText;
    });

    return intarziere(rezultat);
  },

  async getConcursDupaId(contestId: string): Promise<Contest> {
    const concurs = concursuri.find((item) => item.id === contestId);
    if (!concurs) eroare('Concursul nu a fost găsit.');

    return intarziere(concurs);
  },

  async participaLaConcurs(userId: string, contestId: string): Promise<{ succes: boolean }> {
    const lista = participariConcurs[userId] ?? [];
    if (!lista.includes(contestId)) {
      lista.push(contestId);
      participariConcurs[userId] = lista;
    }

    return intarziere({ succes: true });
  },

  async getProblemeConcurs(contestId: string): Promise<Problem[]> {
    const rezultat = probleme.filter((item) => item.contestId === contestId);
    return intarziere(rezultat);
  },

  async getProblemaDupaId(problemId: string): Promise<Problem> {
    const problema = probleme.find((item) => item.id === problemId);
    if (!problema) eroare('Problema nu a fost găsită.');

    return intarziere(problema);
  },

  async trimiteSolutie(input: InputTrimitere): Promise<Submission> {
    const problema = probleme.find((item) => item.id === input.problemId);
    if (!problema) eroare('Problema selectată nu există.');

    const rezultat = rezultatDinCod(input.cod);
    const scor = scorDinRezultat(rezultat, problema.punctaj);

    const trimitereNoua: Submission = {
      id: `s-${Date.now()}`,
      userId: input.userId,
      contestId: input.contestId,
      problemId: input.problemId,
      limbaj: input.limbaj,
      cod: input.cod,
      rezultat,
      scor,
      trimisLa: new Date().toISOString(),
    };

    trimiteri.unshift(trimitereNoua);

    const user = utilizatori.find((item) => item.id === input.userId);
    if (user) {
      user.puncteTotale += scor;
      if (rezultat === 'acceptat') {
        user.rating += 4;
      } else if (rezultat === 'gresit') {
        user.rating -= 1;
      }
      actualizeazaClasamentGlobal();
    }

    const clasament = ensureContestLeaderboard(input.contestId);
    const existent = clasament.find((item) => item.userId === input.userId);

    if (existent) {
      existent.puncte += scor;
      existent.deltaRating += rezultat === 'acceptat' ? 2 : -1;
    } else {
      clasament.push({
        userId: input.userId,
        nickname: user?.nickname ?? 'necunoscut',
        rating: user?.rating ?? 1200,
        puncte: scor,
        rank: clasament.length + 1,
        deltaRating: rezultat === 'acceptat' ? 2 : -1,
      });
    }

    clasament.sort((a, b) => b.puncte - a.puncte).forEach((item, index) => {
      item.rank = index + 1;
    });

    return intarziere(trimitereNoua);
  },

  async getTrimiteri(userId: string, problemId?: string): Promise<Submission[]> {
    const rezultat = trimiteri.filter(
      (item) => item.userId === userId && (!problemId || item.problemId === problemId),
    );

    return intarziere(rezultat);
  },

  async getClasamentGlobal(): Promise<LeaderboardRow[]> {
    return intarziere(clasamentGlobal);
  },

  async getClasamentConcurs(contestId: string): Promise<LeaderboardRow[]> {
    return intarziere(ensureContestLeaderboard(contestId));
  },

  async getProfil(userId: string): Promise<{
    user: User;
    istoricConcursuri: Contest[];
    istoricTrimiteri: Submission[];
  }> {
    const user = utilizatori.find((item) => item.id === userId);
    if (!user) eroare('Profilul cerut nu există.');

    const idsConcursuri = participariConcurs[userId] ?? [];
    const istoricConcursuri = concursuri.filter((item) => idsConcursuri.includes(item.id));
    const istoricTrimiteri = trimiteri.filter((item) => item.userId === userId);

    return intarziere({ user, istoricConcursuri, istoricTrimiteri });
  },

  async adminGetStatistici(token: string) {
    const user = userDinToken(token);
    if (user.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    return intarziere(statisticiAdmin());
  },

  async adminGetUtilizatori(token: string): Promise<User[]> {
    const user = userDinToken(token);
    if (user.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    return intarziere(utilizatori);
  },

  async adminSetRol(token: string, userId: string, rol: RolUtilizator): Promise<User> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    const user = utilizatori.find((item) => item.id === userId);
    if (!user) eroare('Utilizator inexistent.');

    user.rol = rol;
    return intarziere(user);
  },

  async adminSetBan(token: string, userId: string, esteBanat: boolean): Promise<User> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    const user = utilizatori.find((item) => item.id === userId);
    if (!user) eroare('Utilizator inexistent.');

    user.esteBanat = esteBanat;
    return intarziere(user);
  },

  async adminResetareParola(token: string, userId: string): Promise<{ succes: boolean }> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    const user = utilizatori.find((item) => item.id === userId);
    if (!user) eroare('Utilizator inexistent.');

    credentiale[user.email] = 'Reset123!';
    return intarziere({ succes: true });
  },

  async adminAjusteazaRating(token: string, userId: string, ratingNou: number): Promise<User> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    const user = utilizatori.find((item) => item.id === userId);
    if (!user) eroare('Utilizator inexistent.');

    user.rating = ratingNou;
    actualizeazaClasamentGlobal();
    return intarziere(user);
  },

  async adminGetConcursuri(token: string): Promise<Contest[]> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    return intarziere(concursuri);
  },

  async adminUpsertConcurs(token: string, input: InputUpsertConcurs): Promise<Contest> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    if (input.id) {
      const existent = concursuri.find((item) => item.id === input.id);
      if (!existent) eroare('Concursul nu există pentru editare.');

      existent.titlu = input.titlu;
      existent.descriere = input.descriere;
      existent.stare = input.stare;
      existent.dificultate = input.dificultate;
      existent.tip = input.tip;
      existent.startLa = input.startLa;
      existent.finalLa = input.finalLa;

      return intarziere(existent);
    }

    const nou: Contest = {
      id: `c-${Date.now()}`,
      titlu: input.titlu,
      descriere: input.descriere,
      stare: input.stare,
      dificultate: input.dificultate,
      tip: input.tip,
      startLa: input.startLa,
      finalLa: input.finalLa,
      reguli: ['Reguli în curs de configurare de către admin.'],
      premii: ['Premii anunțate curând.'],
      participanti: 0,
      problemeIds: [],
    };

    concursuri.unshift(nou);
    return intarziere(nou);
  },

  async adminStergeConcurs(token: string, contestId: string): Promise<{ succes: boolean }> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    concursuri = concursuri.filter((item) => item.id !== contestId);
    probleme = probleme.filter((item) => item.contestId !== contestId);

    return intarziere({ succes: true });
  },

  async adminGetProbleme(token: string): Promise<Problem[]> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    return intarziere(probleme);
  },

  async adminUpsertProblema(token: string, input: InputUpsertProblema): Promise<Problem> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    if (input.id) {
      const existent = probleme.find((item) => item.id === input.id);
      if (!existent) eroare('Problema nu există pentru editare.');

      existent.titlu = input.titlu;
      existent.enunt = input.enunt;
      existent.punctaj = input.punctaj;
      existent.dificultate = input.dificultate;
      existent.taguri = input.taguri;
      existent.contestId = input.contestId;

      return intarziere(existent);
    }

    const nouaProblema: Problem = {
      id: `p-${Date.now()}`,
      contestId: input.contestId,
      titlu: input.titlu,
      enunt: input.enunt,
      inputExemplu: 'input demo',
      outputExemplu: 'output demo',
      restrictii: ['Configurat de admin'],
      punctaj: input.punctaj,
      dificultate: input.dificultate,
      taguri: input.taguri,
    };

    probleme.unshift(nouaProblema);
    const concurs = concursuri.find((item) => item.id === input.contestId);
    if (concurs) {
      concurs.problemeIds.push(nouaProblema.id);
    }

    return intarziere(nouaProblema);
  },

  async adminStergeProblema(token: string, problemId: string): Promise<{ succes: boolean }> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    const problema = probleme.find((item) => item.id === problemId);
    if (problema) {
      const concurs = concursuri.find((item) => item.id === problema.contestId);
      if (concurs) {
        concurs.problemeIds = concurs.problemeIds.filter((id) => id !== problemId);
      }
    }

    probleme = probleme.filter((item) => item.id !== problemId);
    return intarziere({ succes: true });
  },

  async adminGetRaportari(token: string): Promise<Raportare[]> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    return intarziere(raportari);
  },

  async adminSetStatusRaportare(
    token: string,
    reportId: string,
    status: Raportare['status'],
  ): Promise<Raportare> {
    const userAdmin = userDinToken(token);
    if (userAdmin.rol !== 'admin') eroare('Acces interzis la panoul admin.');

    const raportare = raportari.find((item) => item.id === reportId);
    if (!raportare) eroare('Raportarea nu există.');

    raportare.status = status;
    return intarziere(raportare);
  },
};
