import { useMemo } from 'react';
import { trpc } from '../../lib/trpc.provider';
import styles from './Companies.page.module.scss';

const CompaniesPage = () => {
  const { data, isLoading, isFetching, isError, error } = trpc.companiesRouter.findAll.useQuery();

  const companies = useMemo(() => data ?? [], [data]);

  if (isLoading || isFetching) {
    return <div className={styles.loading}>Loading companies...</div>;
  }

  if (isError) {
    return <div className={styles.error}>{error?.message ?? 'Error loading companies'}</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Все клиенты</h1>
        <p className={styles.subtitle}>Найдено {companies.length} объекта</p>
      </header>

      <div className={styles.grid}>
        {companies.map((company) => (
          <article key={company.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{company.name}</h2>
              <span className={styles.status} data-status={company.status}>
                {company.status}
              </span>
            </div>

            {company.description && <p className={styles.description}>{company.description}</p>}

            <div className={styles.details}>
              <div className={styles.detail}>
                <span className={styles.label}>Правовая форма</span>
                <span className={styles.value}>{company.companyLegalForm.name}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Адресс</span>
                <span className={styles.value}>{company.address}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Дата основания</span>
                <span className={styles.value}>{new Date(company.foundationDate).toLocaleDateString()}</span>
              </div>

              {company.registerRequestId && (
                <div className={styles.detail}>
                  <span className={styles.label}>Register Request ID</span>
                  <span className={styles.value}>{company.registerRequestId}</span>
                </div>
              )}
            </div>

            <div className={styles.directions}>
              <span className={styles.directionsLabel}>Направления:</span>
              <ul className={styles.directionsList}>
                {company.directions.map((direction, idx) => (
                  <li key={idx} className={styles.directionTag}>
                    {direction}
                  </li>
                ))}
              </ul>
            </div>

            <footer className={styles.cardFooter}>
              <span className={styles.date}>Created: {new Date(company.createdAt).toLocaleDateString()}</span>
              {company.updatedAt && company.updatedAt !== company.createdAt && (
                <span className={styles.date}>Updated: {new Date(company.updatedAt).toLocaleDateString()}</span>
              )}
            </footer>
          </article>
        ))}
      </div>

      {companies.length === 0 && (
        <div className={styles.empty}>
          <p>No companies yet.</p>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
