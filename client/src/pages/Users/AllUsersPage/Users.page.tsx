import { Link } from 'react-router-dom';
import { trpc } from '../../../lib/trpc.provider.tsx';
import { oneUserRoute } from '../../../lib/routes.ts';
import { useState, FormEvent, useMemo } from 'react';
import Modal from '../../../components/Modal/Modal';
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
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'email_asc' | 'email_desc'>('newest');
  const [open, setOpen] = useState(false);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({ email, password });
    setEmail('');
    setPassword('');
    setOpen(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = (data ?? []).filter((u) =>
      q ? u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) : true,
    );
    const sorted = [...base];
    switch (sort) {
      case 'email_asc':
        sorted.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case 'email_desc':
        sorted.sort((a, b) => b.email.localeCompare(a.email));
        break;
      case 'oldest':
        sorted.sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
        break;
    }
    return sorted;
  }, [data, query, sort]);

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: ${error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Пользователи</h1>

      <div className={styles.toolbar}>
        <input
          className={styles.input}
          placeholder={'Поиск по email или id'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className={styles.select} value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
          <option value="email_asc">Email A→Z</option>
          <option value="email_desc">Email Z→A</option>
        </select>
        <button className={styles.button} type="button" onClick={() => setOpen(true)}>
          Создать пользователя
        </button>
      </div>

      <Modal open={open} title="Создание пользователя" onClose={() => setOpen(false)}>
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
      </Modal>

      <ul className={styles.list}>
        {filtered.map((user) => (
          <li className={styles.item} key={user.id}>
            <Link className={styles.link} to={oneUserRoute({ id: user.id })}>
              <div className={styles.userEmail}>{user.email}</div>
              <div className={styles.userMeta}>id: {user.id}</div>
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
