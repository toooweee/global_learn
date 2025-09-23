import { useParams } from 'react-router-dom';
import { trpc } from '../../../lib/trpc.provider.tsx';
import styles from './User.module.scss';

const UserPage = () => {
  const { id } = useParams() as { id: string };

  if (!id) {
    return (
      <div>
        <p>No id provided</p>
      </div>
    );
  }

  const { data, error, isError, isFetching, isLoading } = trpc.usersRouter.findUser.useQuery({ id });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{data?.email}</h1>
      <p className={styles.meta}>ID: {data?.id}</p>
    </div>
  );
};

export default UserPage;
