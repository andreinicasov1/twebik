import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <section className="text-center mb-16">
        <div className="inline-block cyber-badge mb-6">&gt; Ssh.. începe aventura</div>
        <h1 className="text-4xl md:text-6xl font-bold text-cyber-text mb-4">
          Antrenează-ți abilitățile de <span className="text-neon-300">Cybersecurity</span>
        </h1>
        <p className="text-cyber-muted text-lg max-w-2xl mx-auto mb-8">
          CyberTrain este o platformă de exerciții practice pentru securitatea informației:
          Securitate Web, Criptografie, Securitate Rețea, clanuri și clasament global.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/login" className="cyber-btn">Autentificare</Link>
          <Link to="/register" className="cyber-btn-solid">Înregistrare</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mb-16">
        {[
          { t: 'Exerciții practice', d: 'Provocări pe 3 categorii — rezolvi, câștigi XP, urci în clasament.' },
          { t: 'Clanuri', d: 'Creează sau alătură-te unui clan și rezolvă exerciții dedicate.' },
          { t: 'Realizări', d: 'Deblochează realizări și arată-ți competențele pe profil.' },
        ].map((f) => (
          <div key={f.t} className="cyber-card p-5">
            <h3 className="text-neon-300 font-semibold mb-2">{f.t}</h3>
            <p className="text-cyber-muted text-sm">{f.d}</p>
          </div>
        ))}
      </section>

      <section className="cyber-card p-6 text-center">
        <h2 className="text-2xl font-bold text-neon-300 mb-2">Pregătit să începi?</h2>
        <p className="text-cyber-muted mb-4">Creează un cont gratuit — fără confirmare pe email.</p>
        <Link to="/register" className="cyber-btn-solid">Creează cont</Link>
      </section>
    </div>
  );
}
