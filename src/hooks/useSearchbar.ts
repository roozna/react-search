import { useState, useEffect, useCallback, useRef } from 'react';
import { Company } from '../types';

export const useSearchbar = (
  fetchCompanies: (query: string) => Promise<Company[]>,
  minQueryLength: number = 2,
  debounceTime: number = 300
) => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const shouldFetchRef = useRef(true);

  const fetchCompaniesRef = useRef(fetchCompanies);
  fetchCompaniesRef.current = fetchCompanies;

  const debouncedFetchCompanies = useCallback(
    debounce(async (q: string) => {
      if (q.length >= minQueryLength || q === '') {
        setLoading(true);
        try {
          const results = await fetchCompaniesRef.current(q);
          setCompanies(results);
        } catch (error) {
          console.error('Error fetching companies:', error);
          setCompanies([]);
        } finally {
          setLoading(false);
        }
      } else {
        setCompanies([]);
      }
    }, debounceTime),
    [minQueryLength, debounceTime]
  );

  useEffect(() => {
    if (shouldFetchRef.current) {
      debouncedFetchCompanies(query);
    } else {
      shouldFetchRef.current = true;
    }
  }, [query, debouncedFetchCompanies]);

  const setQueryWithoutFetch = (newQuery: string) => {
    shouldFetchRef.current = false;
    setQuery(newQuery);
  };

  return {
    query,
    setQuery,
    setQueryWithoutFetch,
    companies,
    loading,
    selectedCompany,
    setSelectedCompany,
    isOpen,
    setIsOpen
  };
};

function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<F>) {
    const context = this;
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}