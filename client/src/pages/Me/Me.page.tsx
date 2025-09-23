import { trpc } from '../../lib/trpc.provider';
import styles from './MePage.module.scss';

const MePage = () => {
  const meQuery = trpc.usersRouter.me.useQuery();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мой профиль</h1>
      {meQuery.isLoading ? (
        <div>Загрузка…</div>
      ) : meQuery.isError ? (
        <div className={styles.error}>Ошибка: {meQuery.error.message}</div>
      ) : (
        <div className={styles.card}>
          <div>
            <span className={styles.label}>Email:</span> {meQuery.data?.email}
          </div>
          <div>
            <span className={styles.label}>Роль:</span> {meQuery.data?.role}
          </div>
        </div>
      )}
    </div>
  );
};

export default MePage;
