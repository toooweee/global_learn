import { trpc } from '../../lib/trpc.provider';
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

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Заявки на регистрацию</h1>
      <ul className={styles.list}>
        {data?.map((rr) => (
          <li className={styles.item} key={rr.id}>
            <div>
              <div>
                {rr.email} — {rr.phone}
              </div>
              <div className={styles.status}>Статус: {rr.status}</div>
            </div>
            <div className={styles.actions}>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRegisterRequestsPage;
