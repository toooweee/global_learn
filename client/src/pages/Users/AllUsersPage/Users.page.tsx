import { Link } from 'react-router-dom';
import { trpc } from '../../../lib/trpc.provider.tsx';
import { oneUserRoute } from '../../../lib/routes.ts';
import { useState, FormEvent } from 'react';
import styles from './Users.module.scss';

const UsersPage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.usersRouter.findAllUsers.useQuery();
  const utils = trpc.useUtils();
  const createMutation = trpc.usersRouter.createUser.useMutation({
    onSuccess: async () => {
      await utils.usersRouter.findAllUsers.invalidate();
    },
  });
  const deleteMutation = trpc.usersRouter.deleteUser.useMutation({
    onSuccess: async () => {
      await utils.usersRouter.findAllUsers.invalidate();
    },
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({ email, password });
    setEmail('');
    setPassword('');
  };

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: ${error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Пользователи</h1>

      <form className={styles.form} onSubmit={onCreate}>
        <input
          className={styles.input}
          placeholder={'email'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder={'password'}
          value={password}
          type={'password'}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} type={'submit'} disabled={createMutation.isPending}>
          Создать
        </button>
      </form>

      <ul className={styles.list}>
        {data?.map((user) => (
          <li className={styles.item} key={user.id}>
            <Link className={styles.link} to={oneUserRoute({ id: user.id })}>
              <p>id: ${user.id}</p>
              <p>Email: ${user.email}</p>
            </Link>
            <button
              className={styles.button}
              onClick={() => deleteMutation.mutate({ id: user.id })}
              disabled={deleteMutation.isPending}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
