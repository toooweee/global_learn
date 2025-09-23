import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth.provider';
import styles from './Header.module.scss';
import logo from '../../assets/logo.svg';
import { registerRequestsAdminRoute } from '../../lib/routes.ts';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className={styles.header}>
      <Link to={'/'} className={styles.brand}>
        <img src={logo} alt="logo" />
      </Link>

      <ul className={styles.nav}>
        <li>
          <Link className={styles.navLink} to={'/users'}>
            Пользователи
          </Link>
        </li>
        <li>
          <Link className={styles.navLink} to={registerRequestsAdminRoute()}>
            Заявки
          </Link>
        </li>
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
