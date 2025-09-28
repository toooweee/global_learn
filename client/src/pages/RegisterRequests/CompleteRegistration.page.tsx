import { type FormEvent, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { trpc } from '../../lib/trpc.provider';
import styles from './CompleteRegistration.module.scss';
import { loginRoute } from '../../lib/routes';
import MultiSelect from '../../components/MultiSelect/MultiSelect';

const CompleteRegistrationPage = () => {
  const navigate = useNavigate();
  const completeMutation = trpc.registerRequestsRouter.completeRegistration.useMutation();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') ?? '', [params]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyDirections, setCompanyDirections] = useState<string[]>([]);
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyFoundationDate, setCompanyFoundationDate] = useState('');
  const [companyLegalFormId, setCompanyLegalFormId] = useState('');

  const legalFormsQuery = trpc.legalFormsRouter.findAll.useQuery();
  const directionsQuery = trpc.directionsRouter.findAll.useQuery();

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
          directions: companyDirections,
          address: companyAddress,
          foundationDate: companyFoundationDate,
          companyLegalFormId,
        },
      } as any);
      setSuccess('Регистрация завершена успешно! Вы будете перенаправлены на страницу входа.');
      setTimeout(() => {
        navigate(loginRoute());
      }, 3000);
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
          <div className={`${styles.field} ${styles.fullRow}`}>
            <label>Направления</label>
            <MultiSelect
              options={(directionsQuery.data ?? []).map((d: any) => ({ label: d.name, value: d.id ?? d.name }))}
              value={companyDirections}
              onChange={setCompanyDirections}
              placeholder="Выберите направления"
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
              type="date"
              value={companyFoundationDate}
              onChange={(e) => setCompanyFoundationDate(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Юридическая форма</label>
            <select
              className={styles.input}
              value={companyLegalFormId}
              onChange={(e) => setCompanyLegalFormId(e.target.value)}
              required
            >
              <option value="">Выберите форму</option>
              {(legalFormsQuery.data ?? []).map((lf) => (
                <option key={lf.id} value={lf.id}>
                  {lf.name}
                </option>
              ))}
            </select>
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
