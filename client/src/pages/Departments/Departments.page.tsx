import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { trpc } from '../../lib/trpc.provider';
import styles from './Departments.module.scss';

const DepartmentsPage = () => {
  const utils = trpc.useUtils();

  const departmentsQuery = trpc.clientCompaniesRouter.findAllDepartments.useQuery();
  const positionsQuery = trpc.clientCompaniesRouter.findAllPositions.useQuery();

  const [showAddDepForm, setShowAddDepForm] = useState(false);
  const [newDepName, setNewDepName] = useState('');
  const [modalCount, setModalCount] = useState(0);

  const openModal = useCallback(() => {
    setModalCount((c) => c + 1);
  }, []);

  const closeModal = useCallback(() => {
    setModalCount((c) => Math.max(0, c - 1));
  }, []);

  const createDepMutation = trpc.clientCompaniesRouter.createDepartment.useMutation({
    onSuccess: () => {
      utils.clientCompaniesRouter.findAllDepartments.invalidate();
      setShowAddDepForm(false);
      setNewDepName('');
      closeModal();
    },
  });

  const handleCreateDep = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newDepName.trim()) return;
      createDepMutation.mutate({ name: newDepName.trim() });
    },
    [newDepName, createDepMutation],
  );

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (modalCount > 0) {
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('modal-open');
    } else {
      document.documentElement.style.setProperty('--scrollbar-width', '0px');
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.documentElement.style.setProperty('--scrollbar-width', '');
      document.body.classList.remove('modal-open');
    };
  }, [modalCount]);

  if (departmentsQuery.isLoading || positionsQuery.isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (departmentsQuery.isError || positionsQuery.isError) {
    return <div className={styles.error}>Ошибка при загрузке данных</div>;
  }

  const departments = departmentsQuery.data ?? [];
  const positions = positionsQuery.data ?? [];

  const addDepModal =
    showAddDepForm &&
    createPortal(
      <div
        className={styles.modalOverlay}
        onClick={() => {
          setShowAddDepForm(false);
          closeModal();
        }}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h3 className={styles.modalTitle}>Добавить департамент</h3>
          <form className={styles.form} onSubmit={handleCreateDep}>
            <div className={styles.field}>
              <input
                className={styles.input}
                placeholder="Название департамента"
                value={newDepName}
                onChange={(e) => setNewDepName(e.target.value)}
              />
              {createDepMutation.isError && (
                <div className={styles.errorMsg}>{createDepMutation.error?.message ?? 'Ошибка создания'}</div>
              )}
            </div>
            <div className={styles.actions}>
              <button className={styles.btnPrimary} type="submit" disabled={createDepMutation.isPending}>
                {createDepMutation.isPending ? 'Создание...' : 'Создать'}
              </button>
              <button
                className={styles.btnSecondary}
                type="button"
                onClick={() => {
                  setShowAddDepForm(false);
                  closeModal();
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>,
      document.body,
    );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Департаменты</h1>

        <button
          className={styles.btnPrimary}
          onClick={() => {
            setShowAddDepForm(true);
            openModal();
          }}
        >
          Добавить
        </button>
      </header>

      {addDepModal}

      <ul className={styles.list}>
        {departments.map((dep) => (
          <DepartmentItem
            key={dep.id}
            dep={dep}
            positions={positions.filter((p) => p.departmentId === dep.id)}
            openModal={openModal}
            closeModal={closeModal}
          />
        ))}
      </ul>

      {departments.length === 0 && <div className={styles.empty}>Нет департаментов. Добавьте первый!</div>}
    </div>
  );
};

const DepartmentItem = ({
  dep,
  positions,
  openModal,
  closeModal,
}: {
  dep: any;
  positions: any[];
  openModal: () => void;
  closeModal: () => void;
}) => {
  const utils = trpc.useUtils();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(dep.name);
  const [showAddPosForm, setShowAddPosForm] = useState(false);
  const [newPosName, setNewPosName] = useState('');
  const [depError, setDepError] = useState('');

  const updateDepMutation = trpc.clientCompaniesRouter.updateDepartment.useMutation({
    onSuccess: () => {
      utils.clientCompaniesRouter.findAllDepartments.invalidate();
      setEditing(false);
      closeModal();
    },
    onError: (err) => {
      setDepError(err.message ?? 'Ошибка обновления');
    },
  });

  const deleteDepMutation = trpc.clientCompaniesRouter.deleteDepartment.useMutation({
    onSuccess: () => {
      utils.clientCompaniesRouter.findAllDepartments.invalidate();
      utils.clientCompaniesRouter.findAllPositions.invalidate();
      setDepError('');
    },
    onError: (err) => {
      setDepError(err.message ?? 'Ошибка удаления');
    },
  });

  const createPosMutation = trpc.clientCompaniesRouter.createPosition.useMutation({
    onSuccess: () => {
      utils.clientCompaniesRouter.findAllPositions.invalidate();
      setShowAddPosForm(false);
      setNewPosName('');
      closeModal();
    },
  });

  const handleUpdateDep = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!editName.trim()) return;
      updateDepMutation.mutate({ id: dep.id, name: editName.trim() });
    },
    [dep.id, editName, updateDepMutation],
  );

  const handleDeleteDep = useCallback(() => {
    if (positions.length > 0) {
      setDepError('Нельзя удалить департамент, пока в нем есть должности.');
      return;
    }
    if (confirm('Вы уверены, что хотите удалить департамент?')) {
      deleteDepMutation.mutate({ id: dep.id });
    }
  }, [dep.id, deleteDepMutation, positions.length]);

  const handleCreatePos = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPosName.trim()) return;
      createPosMutation.mutate({ name: newPosName.trim(), departmentId: dep.id });
    },
    [newPosName, dep.id, createPosMutation],
  );

  const editDepModal =
    editing &&
    createPortal(
      <div
        className={styles.modalOverlay}
        onClick={() => {
          setEditing(false);
          closeModal();
        }}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h3 className={styles.modalTitle}>Редактировать департамент</h3>
          <form className={styles.form} onSubmit={handleUpdateDep}>
            <div className={styles.field}>
              <input className={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} />
              {updateDepMutation.isError && (
                <div className={styles.errorMsg}>{updateDepMutation.error?.message ?? 'Ошибка обновления'}</div>
              )}
            </div>
            <div className={styles.actions}>
              <button className={styles.btnPrimary} type="submit" disabled={updateDepMutation.isPending}>
                {updateDepMutation.isPending ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                className={styles.btnSecondary}
                type="button"
                onClick={() => {
                  setEditing(false);
                  closeModal();
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>,
      document.body,
    );

  const addPosModal =
    showAddPosForm &&
    createPortal(
      <div
        className={styles.modalOverlay}
        onClick={() => {
          setShowAddPosForm(false);
          closeModal();
        }}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h3 className={styles.modalTitle}>Добавить должность</h3>
          <form className={styles.form} onSubmit={handleCreatePos}>
            <div className={styles.field}>
              <input
                className={styles.input}
                placeholder="Название должности"
                value={newPosName}
                onChange={(e) => setNewPosName(e.target.value)}
              />
              {createPosMutation.isError && (
                <div className={styles.errorMsg}>{createPosMutation.error?.message ?? 'Ошибка создания'}</div>
              )}
            </div>
            <div className={styles.actions}>
              <button className={styles.btnPrimary} type="submit" disabled={createPosMutation.isPending}>
                {createPosMutation.isPending ? 'Создание...' : 'Создать'}
              </button>
              <button
                className={styles.btnSecondary}
                type="button"
                onClick={() => {
                  setShowAddPosForm(false);
                  closeModal();
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>,
      document.body,
    );

  return (
    <li className={styles.item}>
      <div className={styles.accordionHeader} onClick={() => !editing && setExpanded(!expanded)}>
        <h2 className={styles.depTitle}>
          {dep.name} <span className={styles.chevron}>{expanded ? '−' : '+'}</span>
        </h2>
        <div className={styles.buttons}>
          <button
            className={styles.btnSecondary}
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
              openModal();
            }}
          >
            Редактировать
          </button>
          <button
            className={styles.btnDanger}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteDep();
            }}
            disabled={deleteDepMutation.isPending}
          >
            {deleteDepMutation.isPending ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
      {depError && <div className={styles.errorMsg}>{depError}</div>}

      {editDepModal}
      {addPosModal}

      {expanded && (
        <div className={styles.positions}>
          <ul className={styles.posList}>
            {positions.map((p) => (
              <PositionItem key={p.id} position={p} openModal={openModal} closeModal={closeModal} />
            ))}
          </ul>

          <button
            className={styles.btnPrimary}
            onClick={() => {
              setShowAddPosForm(true);
              openModal();
            }}
          >
            Добавить должность
          </button>
        </div>
      )}
    </li>
  );
};

const PositionItem = ({
  position,
  openModal,
  closeModal,
}: {
  position: any;
  openModal: () => void;
  closeModal: () => void;
}) => {
  const utils = trpc.useUtils();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(position.name);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    bio: '',
    employmentDate: '',
  });
  const [posError, setPosError] = useState('');

  const usersQuery = trpc.usersRouter.findAllUsers.useQuery({ positionId: position.id }, { enabled: expanded });

  const updatePosMutation = trpc.clientCompaniesRouter.updatePosition.useMutation({
    onSuccess: () => {
      utils.clientCompaniesRouter.findAllPositions.invalidate();
      setEditing(false);
      closeModal();
    },
    onError: (err) => {
      setPosError(err.message ?? 'Ошибка обновления');
    },
  });

  const deletePosMutation = trpc.clientCompaniesRouter.deletePosition.useMutation({
    onSuccess: () => {
      utils.clientCompaniesRouter.findAllPositions.invalidate();
      setPosError('');
    },
    onError: (err) => {
      setPosError(err.message ?? 'Ошибка удаления');
    },
  });

  const createUserMutation = trpc.usersRouter.createUserWithProfile.useMutation({
    onSuccess: () => {
      utils.usersRouter.findAllUsers.invalidate({ positionId: position.id });
      setShowAddUserForm(false);
      setNewUser({ email: '', password: '', name: '', surname: '', bio: '', employmentDate: '' });
      closeModal();
    },
  });

  const handleUpdatePos = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!editName.trim()) return;
      updatePosMutation.mutate({ id: position.id, name: editName.trim() });
    },
    [position.id, editName, updatePosMutation],
  );

  const handleDeletePos = useCallback(() => {
    if (expanded && usersQuery.data!.length > 0) {
      setPosError('Нельзя удалить должность, пока в ней есть пользователи.');
      return;
    }
    if (confirm('Вы уверены, что хотите удалить должность?')) {
      deletePosMutation.mutate({ id: position.id });
    }
  }, [position.id, deletePosMutation, expanded, usersQuery.data?.length]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleCreateUser = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newUser.email || !newUser.password || !newUser.name || !newUser.surname || !newUser.employmentDate) return;
      createUserMutation.mutate({
        ...newUser,
        role: 'USER',
        positionId: position.id,
        employmentDate: new Date(newUser.employmentDate),
      });
    },
    [newUser, position.id, createUserMutation],
  );

  const editPosModal =
    editing &&
    createPortal(
      <div
        className={styles.modalOverlay}
        onClick={() => {
          setEditing(false);
          closeModal();
        }}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h3 className={styles.modalTitle}>Редактировать должность</h3>
          <form className={styles.form} onSubmit={handleUpdatePos}>
            <div className={styles.field}>
              <input className={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} />
              {updatePosMutation.isError && (
                <div className={styles.errorMsg}>{updatePosMutation.error?.message ?? 'Ошибка обновления'}</div>
              )}
            </div>
            <div className={styles.actions}>
              <button className={styles.btnPrimary} type="submit" disabled={updatePosMutation.isPending}>
                {updatePosMutation.isPending ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                className={styles.btnSecondary}
                type="button"
                onClick={() => {
                  setEditing(false);
                  closeModal();
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>,
      document.body,
    );

  const addUserModal =
    showAddUserForm &&
    createPortal(
      <div
        className={styles.modalOverlay}
        onClick={() => {
          setShowAddUserForm(false);
          closeModal();
        }}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h3 className={styles.modalTitle}>Добавить пользователя</h3>
          <form className={styles.form} onSubmit={handleCreateUser}>
            <div className={styles.field}>
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="Пароль"
                value={newUser.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                name="name"
                placeholder="Имя"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                name="surname"
                placeholder="Фамилия"
                value={newUser.surname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.field}>
              <textarea
                className={styles.textarea}
                name="bio"
                placeholder="Био (опционально)"
                value={newUser.bio}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                name="employmentDate"
                type="date"
                placeholder="Дата трудоустройства"
                value={newUser.employmentDate}
                onChange={handleInputChange}
                required
              />
              {createUserMutation.isError && (
                <div className={styles.errorMsg}>{createUserMutation.error?.message ?? 'Ошибка создания'}</div>
              )}
            </div>
            <div className={styles.actions}>
              <button className={styles.btnPrimary} type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? 'Создание...' : 'Создать'}
              </button>
              <button
                className={styles.btnSecondary}
                type="button"
                onClick={() => {
                  setShowAddUserForm(false);
                  closeModal();
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>,
      document.body,
    );

  return (
    <li className={styles.posRow}>
      <div className={styles.row} onClick={() => !editing && setExpanded(!expanded)}>
        <span className={styles.posTitle}>
          {position.name} <span className={styles.chevron}>{expanded ? '−' : '+'}</span>
        </span>
        <div className={styles.buttons}>
          <button
            className={styles.btnSecondary}
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
              openModal();
            }}
          >
            Редактировать
          </button>
          <button
            className={styles.btnDanger}
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePos();
            }}
            disabled={deletePosMutation.isPending}
          >
            {deletePosMutation.isPending ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
      {posError && <div className={styles.errorMsg}>{posError}</div>}

      {editPosModal}
      {addUserModal}

      {expanded && (
        <div className={styles.usersContainer}>
          {usersQuery.isLoading && <div className={styles.loading}>Загрузка пользователей...</div>}

          {usersQuery.isError && <div className={styles.error}>Ошибка загрузки пользователей</div>}

          {usersQuery.data && usersQuery.data.length > 0 ? (
            <ul className={styles.userList}>
              {usersQuery.data.map((user: any) => (
                <li key={user.id} className={styles.userItem}>
                  <span className={styles.userName}>
                    {user.profile?.name} {user.profile?.surname}
                  </span>
                  <span className={styles.userEmail}>({user.email})</span>
                </li>
              ))}
            </ul>
          ) : (
            !usersQuery.isLoading && <div className={styles.noUsers}>В этой должности нет пользователей.</div>
          )}

          <button
            className={styles.btnPrimary}
            onClick={() => {
              setShowAddUserForm(true);
              openModal();
            }}
          >
            Добавить пользователя
          </button>
        </div>
      )}
    </li>
  );
};

export default DepartmentsPage;
