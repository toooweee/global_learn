import { type FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trpc } from '../../lib/trpc.provider';
import styles from './CompleteRegistration.module.scss';

const CompleteRegistrationPage = () => {
  const completeMutation = trpc.registerRequestsRouter.completeRegistration.useMutation();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') ?? '', [params]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyDirections, setCompanyDirections] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyFoundationDate, setCompanyFoundationDate] = useState('');
  const [registerRequestId, setRegisterRequestId] = useState('');
  const [companyLegalFormId, setCompanyLegalFormId] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const res = await completeMutation.mutateAsync({
        token,
        user: {
          email,
          password,
        },
        company: {
          name: companyName,
          description: companyDescription,
          directions: companyDirections
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          address: companyAddress,
          foundationDate: companyFoundationDate,
          registerRequestId,
          companyLegalFormId,
        },
      } as any);
      setSuccess(`Done: userId=${(res as any).userId}, companyId=${(res as any).companyId}`);
    } catch (err: any) {
      setError(err?.message ?? 'Failed');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Завершение регистрации</h1>
      <form onSubmit={onSubmit}>
        {!token && <p className={styles.error}>Отсутствует token в URL (?token=...)</p>}
        <div className={styles.grid}>
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
          <div className={styles.field}>
            <label>Название компании</label>
            <input
              className={styles.input}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Описание</label>
            <input
              className={styles.input}
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Направления (через запятую)</label>
            <input
              className={styles.input}
              value={companyDirections}
              onChange={(e) => setCompanyDirections(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Адрес</label>
            <input
              className={styles.input}
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Дата основания</label>
            <input
              className={styles.input}
              value={companyFoundationDate}
              onChange={(e) => setCompanyFoundationDate(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>ID заявки</label>
            <input
              className={styles.input}
              value={registerRequestId}
              onChange={(e) => setRegisterRequestId(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>ID юр. формы</label>
            <input
              className={styles.input}
              value={companyLegalFormId}
              onChange={(e) => setCompanyLegalFormId(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={completeMutation.isPending}>
            {completeMutation.isPending ? '...' : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteRegistrationPage;
