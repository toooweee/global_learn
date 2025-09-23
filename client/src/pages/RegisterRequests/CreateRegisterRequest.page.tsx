import { type FormEvent, useState } from 'react';
import { trpc } from '../../lib/trpc.provider';
import styles from './CreateRegisterRequest.module.scss';

const CreateRegisterRequestPage = () => {
  const createMutation = trpc.registerRequestsRouter.createRegisterRequest.useMutation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await createMutation.mutateAsync({ email, phone });
      setSuccess(true);
      setEmail('');
      setPhone('');
    } catch (err: any) {
      setError(err?.message ?? 'Failed');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Заявка на регистрацию</h1>
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
          <label>Телефон</label>
          <input
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Отправлено</p>}
        <button className={styles.button} type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? '...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
};

export default CreateRegisterRequestPage;
