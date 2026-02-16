import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { useAuth } from '../auth';
import type { LimbajProgramare } from '../types';

const schema = z.object({
  nume: z.string().min(3, 'Numele trebuie să aibă cel puțin 3 caractere.'),
  nickname: z.string().min(3, 'Pseudonimul trebuie să aibă cel puțin 3 caractere.'),
  email: z.string().email('Introduceți un email valid.'),
  parola: z.string().min(8, 'Parola trebuie să aibă minim 8 caractere.'),
  tara: z.string().optional(),
  limbajPreferat: z.enum(['cpp', 'java', 'python', 'javascript']).optional(),
});

type RegisterValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { t } = useTranslation();
  const { inregistrare } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nume: '',
      nickname: '',
      email: '',
      parola: '',
      tara: '',
      limbajPreferat: 'python',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await inregistrare({
        nume: values.nume,
        nickname: values.nickname,
        email: values.email,
        parola: values.parola,
        tara: values.tara,
        limbajPreferat: values.limbajPreferat as LimbajProgramare | undefined,
      });
      toast.success('Cont creat cu succes. Bine ai venit în arenă!');
      navigate('/panou', { replace: true });
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Înregistrarea a eșuat.';
      toast.error(mesaj);
    }
  });

  return (
    <section className='auth-wrap'>
      <form className='card auth-card fade-in' onSubmit={onSubmit}>
        <h1>{t('auth.titluInregistrare')}</h1>

        <label>
          {t('auth.nume')}
          <input type='text' {...register('nume')} placeholder='Ex: Andrei Popescu' />
          {errors.nume ? <small className='error'>{errors.nume.message}</small> : null}
        </label>

        <label>
          {t('auth.nickname')}
          <input type='text' {...register('nickname')} placeholder='Ex: codator_rapid' />
          {errors.nickname ? <small className='error'>{errors.nickname.message}</small> : null}
        </label>

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

        <div className='grid cols-2'>
          <label>
            {t('auth.tara')} (opțional)
            <input type='text' {...register('tara')} placeholder='România' />
          </label>

          <label>
            {t('auth.limbaj')} (opțional)
            <select {...register('limbajPreferat')}>
              <option value='cpp'>C++</option>
              <option value='java'>Java</option>
              <option value='python'>Python</option>
              <option value='javascript'>JavaScript</option>
            </select>
          </label>
        </div>

        <button className='btn btn-primary' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Se creează contul...' : t('auth.butonInregistrare')}
        </button>

        <div className='auth-links'>
          <Link to='/autentificare'>Ai deja cont? Autentifică-te</Link>
        </div>
      </form>
    </section>
  );
}
