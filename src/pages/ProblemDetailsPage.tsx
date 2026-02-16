import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useAuth } from '../auth';
import { mockApi } from '../axios';
import { Breadcrumbs, EmptyState, Loader } from '../components';
import type { LimbajProgramare, Problem, Submission } from '../types';
import { formatDate } from '../utils';

const templateCod: Record<LimbajProgramare, string> = {
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  return 0;\n}',
  java: 'public class Main {\n  public static void main(String[] args) {\n  }\n}',
  python: 'def rezolva():\n    pass\n\nif __name__ == "__main__":\n    rezolva()',
  javascript: 'function rezolva() {\n}\n\nrezolva();',
};

export function ProblemDetailsPage() {
  const { problemId = '' } = useParams();
  const { user } = useAuth();

  const [problema, setProblema] = useState<Problem | null>(null);
  const [limbaj, setLimbaj] = useState<LimbajProgramare>('python');
  const [cod, setCod] = useState(templateCod.python);
  const [istoric, setIstoric] = useState<Submission[]>([]);
  const [seIncarca, setSeIncarca] = useState(true);
  const [seTrimite, setSeTrimite] = useState(false);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const load = async () => {
      try {
        const dataProblema = await mockApi.getProblemaDupaId(problemId);
        const dataTrimiteri = await mockApi.getTrimiteri(user.id, problemId);

        if (mounted) {
          setProblema(dataProblema);
          setIstoric(dataTrimiteri);
        }
      } catch {
        if (mounted) {
          setProblema(null);
        }
      } finally {
        if (mounted) {
          setSeIncarca(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [problemId, user]);

  const handleLimbaj = (next: LimbajProgramare) => {
    setLimbaj(next);
    setCod(templateCod[next]);
  };

  const handleTrimite = async () => {
    if (!user || !problema || seTrimite) return;

    try {
      setSeTrimite(true);
      const rezultat = await mockApi.trimiteSolutie({
        userId: user.id,
        contestId: problema.contestId,
        problemId: problema.id,
        limbaj,
        cod,
      });
      setIstoric((curent) => [rezultat, ...curent]);

      const mesajRezultat =
        rezultat.rezultat === 'acceptat'
          ? 'Acceptat'
          : rezultat.rezultat === 'gresit'
            ? 'Greșit'
            : 'Timp depășit';

      toast.success(`Rezultat trimitere: ${mesajRezultat}`);
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Trimiterea a eșuat.';
      toast.error(mesaj);
    } finally {
      setSeTrimite(false);
    }
  };

  if (seIncarca) {
    return <Loader text='Încărcăm problema...' />;
  }

  if (!problema) {
    return <EmptyState titlu='Problema nu există' descriere='Verifică linkul sau încearcă altă problemă.' />;
  }

  return (
    <div className='stack-lg'>
      <Breadcrumbs
        items={[
          { label: 'Concursuri', to: '/concursuri' },
          { label: 'Probleme' },
          { label: problema.titlu },
        ]}
      />

      <section className='card stack-md fade-in'>
        <h1>{problema.titlu}</h1>
        <p>{problema.enunt}</p>

        <div className='grid cols-2'>
          <article className='inner-card'>
            <h4>Exemplu input</h4>
            <pre>{problema.inputExemplu}</pre>
          </article>
          <article className='inner-card'>
            <h4>Exemplu output</h4>
            <pre>{problema.outputExemplu}</pre>
          </article>
        </div>

        <article className='inner-card'>
          <h4>Restricții</h4>
          <ul className='simple-list'>
            {problema.restrictii.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <div className='row wrap'>
          <label className='field-inline'>
            Limbaj
            <select value={limbaj} onChange={(event) => handleLimbaj(event.target.value as LimbajProgramare)}>
              <option value='cpp'>C++</option>
              <option value='java'>Java</option>
              <option value='python'>Python</option>
              <option value='javascript'>JavaScript</option>
            </select>
          </label>

          <button className='btn btn-primary' type='button' onClick={handleTrimite} disabled={seTrimite}>
            {seTrimite ? 'Se trimite...' : 'Trimite soluția'}
          </button>
        </div>

        <div className='editor-wrap'>
          <Editor
            height='360px'
            language={limbaj === 'cpp' ? 'cpp' : limbaj}
            value={cod}
            onChange={(value) => setCod(value ?? '')}
            theme='vs-dark'
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
            }}
          />
        </div>
      </section>

      <section className='card stack-sm'>
        <h3>Istoric trimiteri</h3>
        {istoric.length === 0 ? (
          <p className='muted'>Nu există trimiteri pentru această problemă.</p>
        ) : (
          <div className='table-wrap'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Limbaj</th>
                  <th>Rezultat</th>
                  <th>Scor</th>
                </tr>
              </thead>
              <tbody>
                {istoric.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.trimisLa)}</td>
                    <td>{item.limbaj}</td>
                    <td>
                      {item.rezultat === 'acceptat'
                        ? 'Acceptat'
                        : item.rezultat === 'gresit'
                          ? 'Greșit'
                          : 'Timp depășit'}
                    </td>
                    <td>{item.scor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
