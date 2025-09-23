import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth.provider';
import styles from './Header.module.scss';
import logo from '../../assets/logo.svg';
import {
  registerRequestsAdminRoute,
  companiesRoute,
  departmentsRoute,
  positionsRoute,
  directionsRoute,
  legalFormsRoute,
  meRoute,
  homeRoute,
  allUsersRoute,
} from '../../lib/routes.ts';

const Header = () => {
  const { isAuthenticated, logout, role } = useAuth();
  return (
    <header className={styles.header}>
      <Link to={homeRoute()} className={styles.brand}>
        <img src={logo} alt="logo" />
      </Link>

      <ul className={styles.nav}>
        {role === 'ADMIN' && (
          <>
            <li>
              <Link className={styles.navLink} to={allUsersRoute()}>
                Пользователи
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
          <>
            <li>
              <Link className={styles.navLink} to={departmentsRoute()}>
                Департаменты
              </Link>
            </li>
          </>
        )}
        {isAuthenticated && (
          <li>
            <Link className={styles.navLink} to={meRoute()}>
              Мой профиль
            </Link>
          </li>
        )}
      </ul>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <button className={styles.button} onClick={() => logout()}>
            Выйти
          </button>
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
