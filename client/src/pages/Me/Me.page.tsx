import React, { useState, useEffect } from 'react';
import { trpc } from '../../lib/trpc.provider';
import styles from './MePage.module.scss';

const MePage = () => {
  const utils = trpc.useUtils();
  const meQuery = trpc.usersRouter.me.useQuery();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    bio: '',
    employmentDate: new Date().toISOString().split('T')[0],
  });

  const updateMutation = trpc.usersRouter.updateProfile.useMutation({
    onSuccess: () => {
      utils.usersRouter.me.invalidate();
      setIsFormOpen(false);
    },
  });

  const createMutation = trpc.usersRouter.createProfile.useMutation({
    onSuccess: () => {
      utils.usersRouter.me.invalidate();
      setIsFormOpen(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commonData = {
      name: formData.name,
      surname: formData.surname,
      bio: formData.bio || undefined,
    };
    const user = meQuery.data;
    const profile = user?.profile;
    const hasProfile = !!profile;

    if (hasProfile) {
      updateMutation.mutate(commonData);
    } else {
      createMutation.mutate({
        ...commonData,
        employmentDate: new Date(formData.employmentDate),
      });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && meQuery.data?.profile) {
      const formDataToSend = new FormData();
      formDataToSend.append('avatar', file);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No token');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/users/upload-avatar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        });

        if (response.ok) {
          utils.usersRouter.me.invalidate();
          e.target.value = '';
        } else {
          const error = await response.text();
          console.error('Upload failed', error);
        }
      } catch (error) {
        console.error('Upload failed', error);
      }
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    if (isFormOpen) {
      const user = meQuery.data;
      const profile = user?.profile;
      const hasProfile = !!profile;
      if (hasProfile) {
        setFormData({
          name: profile.name,
          surname: profile.surname,
          bio: profile.bio || '',
          employmentDate: '',
        });
      } else {
        setFormData({
          name: '',
          surname: '',
          bio: '',
          employmentDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [isFormOpen, meQuery.data]);

  if (meQuery.isLoading) {
    return <div className={styles.loading}>Загрузка…</div>;
  }

  if (meQuery.isError) {
    return <div className={styles.error}>Ошибка: {meQuery.error.message}</div>;
  }

  const user = meQuery.data;
  const profile = user?.profile;
  const hasProfile = !!profile;
  const isPending = updateMutation.isPending || createMutation.isPending;

  if (!hasProfile && !isFormOpen) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Мой профиль</h1>

        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatarPlaceholder}>
                <span className={styles.placeholderIcon}>👤</span>
              </div>
            </div>
          </div>

          <div className={styles.noProfilePrompt}>
            <p>Профиль не создан. Чтобы продолжить, создайте его.</p>
            <button type="button" onClick={() => setIsFormOpen(true)} className={styles.buttonPrimary}>
              Создать профиль
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мой профиль</h1>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            {profile ? (
              <img
                src={`http://localhost:3000${profile.avatar?.path}`}
                alt="Аватар"
                className={styles.avatar}
                crossOrigin="anonymous"
                loading="lazy"
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <span className={styles.placeholderIcon}>👤</span>
              </div>
            )}
            {hasProfile && (
              <label className={styles.uploadLabel}>
                <span className={styles.uploadIcon}>📷</span> Изменить
                <input type="file" accept="image/*" onChange={handleAvatarChange} className={styles.fileInput} />
              </label>
            )}
          </div>
        </div>

        {isFormOpen ? (
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <div className={styles.field}>
              <label className={styles.label}>Имя</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Фамилия</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            {!hasProfile && (
              <div className={styles.field}>
                <label className={styles.label}>Дата трудоустройства</label>
                <input
                  type="date"
                  name="employmentDate"
                  value={formData.employmentDate}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
            )}
            <div className={styles.field}>
              <label className={styles.label}>Био</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className={styles.textarea}
                rows={4}
                placeholder="Расскажите о себе..."
              />
            </div>
            <div className={styles.actions}>
              <button type="submit" disabled={isPending} className={styles.buttonPrimary}>
                {isPending ? 'Сохранение...' : hasProfile ? 'Сохранить' : 'Создать профиль'}
              </button>
              <button type="button" onClick={handleCancel} className={styles.buttonSecondary}>
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.profileInfo}>
            <div className={styles.field}>
              <span className={styles.label}>Полное имя:</span>
              <span className={styles.value}>
                {profile?.name} {profile?.surname}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{user!.email}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Роль:</span>
              <span className={`${styles.value} ${styles.roleBadge}`}>{user!.role}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Дата трудоустройства:</span>
              <span className={styles.value}>{new Date(profile!.employmentDate).toLocaleDateString('ru-RU')}</span>
            </div>
            {profile?.bio && (
              <div className={styles.field}>
                <span className={styles.label}>Био:</span>
                <p className={styles.bio}>{profile.bio}</p>
              </div>
            )}
            <button type="button" onClick={() => setIsFormOpen(true)} className={styles.buttonPrimary}>
              Редактировать профиль
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MePage;
