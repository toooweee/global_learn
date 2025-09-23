import { useMemo, useState } from 'react';
import { trpc } from '../../lib/trpc.provider';
import styles from './Departments.module.scss';
import Modal from '../../components/Modal/Modal';

const DepartmentsPage = () => {
  const utils = trpc.useUtils();

  const listQuery = trpc.clientCompaniesRouter.findAllDepartments.useQuery();
  const positionsQuery = trpc.clientCompaniesRouter.findAllPositions.useQuery();
  const [name, setName] = useState('');
  const [posName, setPosName] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isDepModalOpen, setDepModalOpen] = useState(false);
  const [isPosModalOpen, setPosModalOpen] = useState<{ open: boolean; depId: string | null }>({
    open: false,
    depId: null,
  });
  const [isEditPosModalOpen, setEditPosModalOpen] = useState<{ open: boolean; posId: string | null }>({
    open: false,
    posId: null,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const createMutation = trpc.clientCompaniesRouter.createDepartment.useMutation({
    onSuccess: async () => {
      setName('');
      await utils.clientCompaniesRouter.findAllDepartments.invalidate();
    },
  });

  const updateMutation = trpc.clientCompaniesRouter.updateDepartment.useMutation({
    onSuccess: async () => {
      setEditId(null);
      setEditName('');
      await utils.clientCompaniesRouter.findAllDepartments.invalidate();
    },
  });

  const deleteMutation = trpc.clientCompaniesRouter.deleteDepartment.useMutation({
    onSuccess: async () => {
      await utils.clientCompaniesRouter.findAllDepartments.invalidate();
    },
  });

  const createPosition = trpc.clientCompaniesRouter.createPosition.useMutation({
    onSuccess: async () => {
      setPosName('');
      await Promise.all([
        utils.clientCompaniesRouter.findAllPositions.invalidate(),
        utils.clientCompaniesRouter.findAllDepartments.invalidate(),
      ]);
      setPosModalOpen({ open: false, depId: null });
    },
  });
  const deletePosition = trpc.clientCompaniesRouter.deletePosition.useMutation({
    onSuccess: async () => {
      await utils.clientCompaniesRouter.findAllPositions.invalidate();
    },
  });
  const updatePosition = trpc.clientCompaniesRouter.updatePosition.useMutation({
    onSuccess: async () => {
      await utils.clientCompaniesRouter.findAllPositions.invalidate();
      setEditPosModalOpen({ open: false, posId: null });
    },
  });

  const list = useMemo(() => listQuery.data ?? [], [listQuery.data]);
  const positions = useMemo(() => positionsQuery.data ?? [], [positionsQuery.data]);

  return (
    <div className={styles.container}>
      <h2>Departments</h2>

      <div className={styles.form}>
        <button className={styles.buttonPrimary} type="button" onClick={() => setDepModalOpen(true)}>
          Добавить департамент
        </button>
      </div>

      {listQuery.isLoading || listQuery.isFetching ? <div>Loading…</div> : null}
      {listQuery.isError ? <div style={{ color: 'red' }}>{listQuery.error?.message ?? 'Error'}</div> : null}

      <ul className={styles.list}>
        {list.map((dep) => (
          <li key={dep.id} className={styles.item}>
            {editId === dep.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editName.trim()) return;
                  updateMutation.mutate({ id: dep.id, name: editName.trim() });
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
              <div
                className={styles.accordionHeader}
                onClick={() => setExpanded((p) => ({ ...p, [dep.id]: !p[dep.id] }))}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{dep.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>Positions: {dep.positionsCount ?? 0}</div>
                </div>
                <div className={styles.buttons}>
                  <button
                    type="button"
                    className={styles.buttonPrimary}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPosModalOpen({ open: true, depId: dep.id });
                    }}
                  >
                    Добавить позицию
                  </button>
                  <button
                    type="button"
                    className={styles.buttonGhost}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditId(dep.id);
                      setEditName(dep.name);
                    }}
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    className={styles.buttonGhost}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate({ id: dep.id });
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            )}

            {expanded[dep.id] && (
              <div className={styles.positions}>
                {positions
                  .filter((p) => p.departmentId === dep.id)
                  .map((p) => (
                    <div key={p.id} className={styles.posRow}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>Users: {p.usersCount ?? 0}</div>
                      </div>
                      <div className={styles.buttons}>
                        <button
                          type="button"
                          className={styles.buttonGhost}
                          onClick={() => setEditPosModalOpen({ open: true, posId: p.id })}
                        >
                          Редактировать
                        </button>
                        <button
                          type="button"
                          className={styles.buttonGhost}
                          onClick={() => deletePosition.mutate({ id: p.id })}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      <Modal
        open={isDepModalOpen}
        title="Новый департамент"
        onClose={() => setDepModalOpen(false)}
        actions={
          <div className={styles.row}>
            <button type="button" onClick={() => setDepModalOpen(false)}>
              Отмена
            </button>
            <button
              type="button"
              onClick={() => {
                if (!name.trim()) return;
                createMutation.mutate({ name: name.trim() });
                setDepModalOpen(false);
              }}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Создание…' : 'Создать'}
            </button>
          </div>
        }
      >
        <div className={styles.field}>
          <input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={isPosModalOpen.open}
        title="Новая позиция"
        onClose={() => setPosModalOpen({ open: false, depId: null })}
        actions={
          <div className={styles.row}>
            <button type="button" onClick={() => setPosModalOpen({ open: false, depId: null })}>
              Отмена
            </button>
            <button
              type="button"
              onClick={() => {
                if (!posName.trim() || !isPosModalOpen.depId) return;
                createPosition.mutate({ name: posName.trim(), departmentId: isPosModalOpen.depId });
              }}
              disabled={createPosition.isPending}
            >
              {createPosition.isPending ? 'Создание…' : 'Создать'}
            </button>
          </div>
        }
      >
        <div className={styles.field}>
          <input placeholder="Название" value={posName} onChange={(e) => setPosName(e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={isEditPosModalOpen.open}
        title="Редактировать позицию"
        onClose={() => setEditPosModalOpen({ open: false, posId: null })}
        actions={
          <div className={styles.row}>
            <button type="button" onClick={() => setEditPosModalOpen({ open: false, posId: null })}>
              Отмена
            </button>
            <button
              type="button"
              onClick={() => {
                const pos = positions.find((pp) => pp.id === isEditPosModalOpen.posId);
                if (!pos) return;
                if (!posName.trim()) return;
                updatePosition.mutate({ id: pos.id, name: posName.trim(), departmentId: pos.departmentId });
              }}
              disabled={updatePosition.isPending}
            >
              {updatePosition.isPending ? 'Сохранение…' : 'Сохранить'}
            </button>
          </div>
        }
      >
        <div className={styles.field}>
          <input placeholder="Название" value={posName} onChange={(e) => setPosName(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;
