import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { useAuth } from '../auth';

const schema = z.object({
  email: z.string().email('Introduceți un email valid.'),
});

type ResetValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const { resetareParola } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const mesaj = await resetareParola(values.email);
      toast.success(mesaj);
    } catch (error) {
      const mesaj = error instanceof Error ? error.message : 'Nu am putut procesa cererea.';
      toast.error(mesaj);
    }
  });

  return (
    <section className='auth-wrap'>
      <form className='card auth-card fade-in' onSubmit={onSubmit}>
        <h1>Resetare parolă</h1>
        <p className='muted'>Introdu emailul contului, iar sistemul va simula trimiterea link-ului de resetare.</p>

        <label>
          Email
          <input type='email' {...register('email')} placeholder='nume@exemplu.ro' />
          {errors.email ? <small className='error'>{errors.email.message}</small> : null}
        </label>

        <button className='btn btn-primary' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Se procesează...' : 'Trimite instrucțiuni'}
        </button>

        <div className='auth-links'>
          <Link to='/autentificare'>Înapoi la autentificare</Link>
        </div>
      </form>
    </section>
  );
}
