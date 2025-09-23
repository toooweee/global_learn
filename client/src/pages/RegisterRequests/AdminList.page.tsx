import { trpc } from '../../lib/trpc.provider';
import { useMemo, useState } from 'react';
import styles from './AdminList.module.scss';

const AdminRegisterRequestsPage = () => {
  const { data, isLoading, isFetching, error, isError } =
    trpc.registerRequestsRouter.findAllRegisterRequests.useQuery();
  const utils = trpc.useUtils();
  const updateMutation = trpc.registerRequestsRouter.updateRegisterRequestStatus.useMutation({
    onSuccess: async () => {
      await utils.registerRequestsRouter.findAllRegisterRequests.invalidate();
    },
  });

  const [status, setStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? [])
      .filter((rr) => (status === 'ALL' ? true : rr.status === status))
      .filter((rr) => (q ? rr.email.toLowerCase().includes(q) || rr.phone.includes(q) : true));
  }, [data, status, query]);

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Заявки на регистрацию</h1>
      <div className={styles.toolbar}>
        <input
          className={styles.input}
          placeholder={'Поиск по email/телефону'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="ALL">Все</option>
          <option value="PENDING">Ожидают</option>
          <option value="APPROVED">Одобрены</option>
          <option value="REJECTED">Отклонены</option>
        </select>
      </div>
      <div className={styles.headers}>
        <span>Email</span>
        <span>Телефон</span>
        <span>Статус</span>
        <span></span>
      </div>
      <ul className={styles.list}>
        {filtered.map((rr) => (
          <li className={styles.item} key={rr.id}>
            <div>{rr.email}</div>
            <div>{rr.phone}</div>
            <div className={styles.status}>{rr.status}</div>
            <div className={styles.actions}>
              {rr.status === 'PENDING' && (
                <>
                  <button
                    className={`${styles.button} ${styles.buttonApprove}`}
                    onClick={() => updateMutation.mutate({ id: rr.id, status: 'APPROVED' })}
                  >
                    Одобрить
                  </button>
                  <button
                    className={`${styles.button} ${styles.buttonReject}`}
                    onClick={() => updateMutation.mutate({ id: rr.id, status: 'REJECTED' })}
                  >
                    Отклонить
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRegisterRequestsPage;
