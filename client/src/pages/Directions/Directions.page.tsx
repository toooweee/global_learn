import { useMemo, useState } from 'react';
import { trpc } from '../../lib/trpc.provider';
import styles from './Directions.module.scss';

const DirectionsPage = () => {
  const utils = trpc.useUtils();
  const { data, isLoading, isFetching, isError, error } = trpc.directionsRouter.findAll.useQuery();

  const [newName, setNewName] = useState('');

  const createMutation = trpc.directionsRouter.create.useMutation({
    onSuccess: async () => {
      setNewName('');
      await utils.directionsRouter.findAll.invalidate();
    },
  });

  const list = useMemo(() => data ?? [], [data]);

  return (
    <div className={styles.container}>
      <h2>Directions</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newName.trim()) return;
          createMutation.mutate({ name: newName.trim() });
        }}
        className={styles.form}
      >
        <input placeholder="New direction name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating…' : 'Create'}
        </button>
      </form>

      {isLoading || isFetching ? <div>Loading…</div> : null}
      {isError ? <div style={{ color: 'red' }}>{error?.message ?? 'Error'}</div> : null}

      <ul className={styles.list}>
        {list.map((d: any, idx) => (
          <li key={d.id ?? idx} className={styles.item}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>{d.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectionsPage;
