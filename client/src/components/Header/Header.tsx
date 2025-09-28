import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth.provider';
import { trpc } from '../../lib/trpc.provider';
import styles from './Header.module.scss';
import logo from '../../assets/logo.svg';
import {
  registerRequestsAdminRoute,
  departmentsRoute,
  directionsRoute,
  legalFormsRoute,
  meRoute,
  homeRoute,
  companiesRoute,
} from '../../lib/routes.ts';

const getInitialColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const Header = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const meQuery = trpc.usersRouter.me.useQuery();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    logout();
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (meQuery.isError) {
    console.error('Failed to load user data');
  }

  const user = meQuery.data;
  const profile = user?.profile;
  const emailInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';
  const initialColor = getInitialColor(user?.email || '');

  return (
    <header className={styles.header}>
      <Link to={homeRoute()} className={styles.brand}>
        <img src={logo} alt="logo" />
      </Link>

      <ul className={styles.nav}>
        {role === 'ADMIN' && (
          <>
            <li>
              <Link className={styles.navLink} to={companiesRoute()}>
                Компании
              </Link>
            </li>
            <li>
              <Link className={styles.navLink} to={registerRequestsAdminRoute()}>
                Заявки
              </Link>
            </li>
            <li>
              <Link className={styles.navLink} to={directionsRoute()}>
                Направления
              </Link>
            </li>
            <li>
              <Link className={styles.navLink} to={legalFormsRoute()}>
                Правовые формы
              </Link>
            </li>
          </>
        )}
        {role === 'CLIENT_ADMIN' && (
          <li>
            <Link className={styles.navLink} to={departmentsRoute()}>
              Моя компания
            </Link>
          </li>
        )}
      </ul>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <div className={`${styles.userMenu} ${isDropdownOpen ? styles.dropdownOpen : ''}`} ref={userMenuRef}>
            <button className={styles.avatarButton} onClick={toggleDropdown} type="button">
              {profile?.avatar ? (
                <img src={`http://localhost:3000${profile.avatar.path}`} alt="Аватар" className={styles.avatar} />
              ) : (
                <div className={styles.avatarInitial} style={{ backgroundColor: initialColor }}>
                  {emailInitial}
                </div>
              )}
            </button>
            <ul className={styles.dropdown}>
              <li>
                <Link className={styles.dropdownLink} to={meRoute()} onClick={closeDropdown}>
                  Мой профиль
                </Link>
              </li>
              <li>
                <button className={styles.dropdownButton} onClick={handleLogout} type="button">
                  Выйти
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link className={styles.navLink} to={'/login'}>
            Войти
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
