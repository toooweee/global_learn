import { useMemo, useState } from 'react';
import { trpc } from '../../lib/trpc.provider';
import styles from './Directions.module.scss';

const DirectionsPage = () => {
  const utils = trpc.useUtils();
  const { data, isLoading, isFetching, isError, error } = trpc.directionsRouter.findAll.useQuery();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const createMutation = trpc.directionsRouter.create.useMutation({
    onSuccess: async () => {
      setNewName('');
      await utils.directionsRouter.findAll.invalidate();
    },
  });

  const updateMutation = trpc.directionsRouter.update.useMutation({
    onSuccess: async () => {
      setEditingId(null);
      setEditedName('');
      await utils.directionsRouter.findAll.invalidate();
    },
  });

  const deleteMutation = trpc.directionsRouter.delete.useMutation({
    onSuccess: async () => {
      await utils.directionsRouter.findAll.invalidate();
    },
  });

  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditedName(name);
  };

  const handleSave = () => {
    if (!editedName.trim()) return;
    updateMutation.mutate({ id: editingId!, name: editedName.trim() });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this direction?')) {
      deleteMutation.mutate({ id });
    }
  };

  const list = useMemo(() => data ?? [], [data]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Направления</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newName.trim()) return;
          createMutation.mutate({ name: newName.trim() });
        }}
        className={styles.form}
      >
        <input
          className={styles.input}
          placeholder="New direction name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className={styles.btn} disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating…' : 'Create'}
        </button>
      </form>

      {isLoading || isFetching ? <div className={styles.loading}>Loading…</div> : null}
      {isError ? <div className={styles.error}>{error?.message ?? 'Error'}</div> : null}

      {updateMutation.isError && <div className={styles.error}>Update failed: {updateMutation.error?.message}</div>}
      {deleteMutation.isError && <div className={styles.error}>Delete failed: {deleteMutation.error?.message}</div>}
      {createMutation.isError && <div className={styles.error}>Create failed: {createMutation.error?.message}</div>}

      <ul className={styles.list}>
        {list.map((d: any) => (
          <li key={d.id} className={styles.item}>
            <div className={styles.content}>
              {editingId === d.id ? (
                <>
                  <input
                    className={styles.input}
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    autoFocus
                  />
                  <div className={styles.actions}>
                    <button className={styles.btn} onClick={handleSave} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? 'Saving…' : 'Save'}
                    </button>
                    <button className={styles.btnSecondary} onClick={handleCancel} disabled={updateMutation.isPending}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.info}>
                    <span className={styles.name}>{d.name}</span>
                    <small className={styles.date}>Created: {new Date(d.createdAt).toLocaleDateString()}</small>
                    {d.updatedAt && d.updatedAt !== d.createdAt && (
                      <small className={styles.date}>Updated: {new Date(d.updatedAt).toLocaleDateString()}</small>
                    )}
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.btnSecondary} onClick={() => handleEdit(d.id, d.name)}>
                      Edit
                    </button>
                    <button
                      className={styles.btnDanger}
                      onClick={() => handleDelete(d.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {list.length === 0 && !isLoading && !isError && (
        <div className={styles.empty}>No directions yet. Create one above!</div>
      )}
    </div>
  );
};

export default DirectionsPage;
