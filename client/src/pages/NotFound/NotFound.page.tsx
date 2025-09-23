import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

const NotFoundPage = () => {
  return (
    <div className={styles['not-found']}>
      <h1>Error</h1>
      <p>Page not found</p>
      <Link to="/" className={styles['back-link']}>
        Back to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
