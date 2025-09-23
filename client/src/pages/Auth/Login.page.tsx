import { type FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../lib/auth.provider';
import styles from './Login.module.scss';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(email, password);
      const next = params.get('next');
      navigate(next ? decodeURIComponent(next) : '/');
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Вход</h1>
      <form onSubmit={onSubmit}>
        <div className={styles.field}>
          <label>Email</label>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div className={styles.field}>
          <label>Пароль</label>
          <input
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <a className={styles.link} href={'/register-request'}>
            Подать заявку на регистрацию
          </a>
          <button className={styles.button} type="submit" disabled={pending}>
            {pending ? '...' : 'Войти'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
