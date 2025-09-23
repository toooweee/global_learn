import { useMemo, useState } from 'react';
import { trpc } from '../../lib/trpc.provider';
import styles from './Positions.module.scss';

const PositionsPage = () => {
  const utils = trpc.useUtils();

  const listQuery = trpc.clientCompaniesRouter.findAllPositions.useQuery();
  const departmentsQuery = trpc.clientCompaniesRouter.findAllDepartments.useQuery();

  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDepartmentId, setEditDepartmentId] = useState('');

  const createMutation = trpc.clientCompaniesRouter.createPosition.useMutation({
    onSuccess: async () => {
      setName('');
      setDepartmentId('');
      await Promise.all([
        utils.clientCompaniesRouter.findAllPositions.invalidate(),
        utils.clientCompaniesRouter.findAllDepartments.invalidate(),
      ]);
    },
  });

  const updateMutation = trpc.clientCompaniesRouter.updatePosition.useMutation({
    onSuccess: async () => {
      setEditId(null);
      setEditName('');
      setEditDepartmentId('');
      await utils.clientCompaniesRouter.findAllPositions.invalidate();
    },
  });

  const deleteMutation = trpc.clientCompaniesRouter.deletePosition.useMutation({
    onSuccess: async () => {
      await utils.clientCompaniesRouter.findAllPositions.invalidate();
    },
  });

  const positions = useMemo(() => listQuery.data ?? [], [listQuery.data]);
  const departments = useMemo(() => departmentsQuery.data ?? [], [departmentsQuery.data]);

  return (
    <div className={styles.container}>
      <h2>Positions</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !departmentId) return;
          createMutation.mutate({ name: name.trim(), departmentId });
        }}
        className={styles.form}
      >
        <input placeholder="New position name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating…' : 'Create'}
        </button>
      </form>

      {listQuery.isLoading || listQuery.isFetching ? <div>Loading…</div> : null}
      {listQuery.isError ? <div style={{ color: 'red' }}>{listQuery.error?.message ?? 'Error'}</div> : null}

      <ul className={styles.list}>
        {positions.map((p) => (
          <li key={p.id} className={styles.item}>
            {editId === p.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editName.trim() || !editDepartmentId) return;
                  updateMutation.mutate({ id: p.id, name: editName.trim(), departmentId: editDepartmentId });
                }}
                className={styles.form}
              >
                <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                <select value={editDepartmentId} onChange={(e) => setEditDepartmentId(e.target.value)}>
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
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
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Users: {p.usersCount ?? 0}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Department: {p.department?.name ?? '—'}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(p.id);
                      setEditName(p.name);
                      setEditDepartmentId(p.departmentId);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteMutation.mutate({ id: p.id })}>
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

export default PositionsPage;
