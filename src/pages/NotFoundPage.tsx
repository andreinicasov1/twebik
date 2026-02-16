import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className='empty-state not-found'>
      <h1>404</h1>
      <h2>Pagina nu a fost găsită</h2>
      <p>Link-ul accesat nu există sau a fost mutat.</p>
      <Link to='/' className='btn btn-primary'>
        Înapoi la acasă
      </Link>
    </section>
  );
}
