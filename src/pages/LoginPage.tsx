import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { useAuth } from '../auth';

const schema = z.object({
  email: z.string().email('Introduceți un email valid.'),
  parola: z.string().min(8, 'Parola trebuie să aibă minim 8 caractere.'),
});

type LoginValues = z.infer<typeof schema>;

export function LoginPage() {
  const { t } = useTranslation();
  const { autentificare } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', parola: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await autentificare(values.email, values.parola);
      toast.success('Autentificare realizată cu succes.');
      const redirect = (location.state as { from?: string } | null)?.from;
      navigate(redirect ?? '/panou', { replace: true });
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Autentificarea a eșuat.';
      toast.error(mesaj);
    }
  });

  return (
    <section className='auth-wrap'>
      <form className='card auth-card fade-in' onSubmit={onSubmit}>
        <h1>{t('auth.titluAutentificare')}</h1>
        <p className='muted'>Cont exemplu administrator: admin@codepulse.ro / Admin123!</p>
        <p className='muted'>Cont exemplu utilizator: andrei@codepulse.ro / Parola123!</p>

        <label>
          {t('auth.email')}
          <input type='email' {...register('email')} placeholder='nume@exemplu.ro' />
          {errors.email ? <small className='error'>{errors.email.message}</small> : null}
        </label>

        <label>
          {t('auth.parola')}
          <input type='password' {...register('parola')} placeholder='Minim 8 caractere' />
          {errors.parola ? <small className='error'>{errors.parola.message}</small> : null}
        </label>

        <button className='btn btn-primary' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Se autentifică...' : t('auth.butonAutentificare')}
        </button>

        <div className='auth-links'>
          <Link to='/resetare-parola'>{t('auth.resetare')}</Link>
          <Link to='/inregistrare'>Nu ai cont? Înregistrează-te</Link>
        </div>
      </form>
    </section>
  );
}
