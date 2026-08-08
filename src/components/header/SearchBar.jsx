import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '@/components/header/SearchBar.module.scss';

const SEARCH_DELAY = 400;

export default function SearchBar() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const currentQuery = pathname === '/search'
    ? new URLSearchParams(search).get('q') || ''
    : '';
  const [query, setQuery] = useState(currentQuery);

  const navigateToResults = useCallback((value) => {
    const normalizedQuery = value.trim();
    const destination = normalizedQuery
      ? `/search?q=${encodeURIComponent(normalizedQuery)}`
      : '/search';

    navigate(destination, { replace: pathname === '/search' });
  }, [navigate, pathname]);

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (query === currentQuery) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      navigateToResults(query);
    }, SEARCH_DELAY);

    return () => window.clearTimeout(timer);
  }, [currentQuery, navigateToResults, query]);

  function handleSubmit(event) {
    event.preventDefault();

    if (query.trim()) {
      navigateToResults(query);
    }
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
      <label className={styles.srOnly} htmlFor="header-search">영화 검색</label>
      <input
        autoComplete="off"
        id="header-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="영화 제목을 검색해보세요"
        type="search"
        value={query}
      />
      <button aria-label="검색" disabled={!query.trim()} type="submit">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
        </svg>
      </button>
    </form>
  );
}
