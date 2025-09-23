import { useMemo, useState } from 'react';
import { trpc } from '../../lib/trpc.provider';
import styles from './LegalForms.module.scss';

const LegalFormsPage = () => {
  const utils = trpc.useUtils();
  const listQuery = trpc.legalFormsRouter.findAll.useQuery();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const createMutation = trpc.legalFormsRouter.create.useMutation({
    onSuccess: async () => {
      setName('');
      await utils.legalFormsRouter.findAll.invalidate();
    },
  });

  const updateMutation = trpc.legalFormsRouter.update.useMutation({
    onSuccess: async () => {
      setEditId(null);
      setEditName('');
      await utils.legalFormsRouter.findAll.invalidate();
    },
  });

  const deleteMutation = trpc.legalFormsRouter.delete.useMutation({
    onSuccess: async () => {
      await utils.legalFormsRouter.findAll.invalidate();
    },
  });

  const list = useMemo(() => listQuery.data ?? [], [listQuery.data]);

  return (
    <div className={styles.container}>
      <h2>Legal Forms</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createMutation.mutate({ name: name.trim() });
        }}
        className={styles.form}
      >
        <input placeholder="New legal form name" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating…' : 'Create'}
        </button>
      </form>

      {listQuery.isLoading || listQuery.isFetching ? <div>Loading…</div> : null}
      {listQuery.isError ? <div style={{ color: 'red' }}>{listQuery.error?.message ?? 'Error'}</div> : null}

      <ul className={styles.list}>
        {list.map((lf) => (
          <li key={lf.id} className={styles.item}>
            {editId === lf.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editName.trim()) return;
                  updateMutation.mutate({ id: lf.id, name: editName.trim() });
                }}
                className={styles.form}
              >
                <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                <button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving…' : 'Save'}
                </button>
                <button type="button" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <div className={styles.row}>
                <div>
                  <div style={{ fontWeight: 600 }}>{lf.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{new Date(lf.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(lf.id);
                      setEditName(lf.name);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteMutation.mutate({ id: lf.id })}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegalFormsPage;
