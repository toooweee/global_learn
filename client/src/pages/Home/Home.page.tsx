import styles from './HomePage.module.scss';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Global Learn</h1>
      <p className={styles.subtitle}>Главная страница в разработке</p>
    </div>
  );
};

export default HomePage;
