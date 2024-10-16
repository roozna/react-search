import { useState, useEffect, useCallback, useRef } from 'react';
import { Company, PaginationInfo } from '../types';

export const useSearchbar = (
  fetchCompanies: (query: string, page: number) => Promise<{ companies: Company[], pagination: PaginationInfo }>,
  minQueryLength: number = 2,
  debounceTime: number = 300
) => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const shouldFetchRef = useRef(true);

  const fetchCompaniesRef = useRef(fetchCompanies);
  fetchCompaniesRef.current = fetchCompanies;

  const debouncedFetchCompanies = useCallback(
    debounce(async (q: string, page: number = 1) => {
      if (q.length >= minQueryLength || q === '') {
        setLoading(true);
        try {
          const { companies: results, pagination: paginationInfo } = await fetchCompaniesRef.current(q, page);
          if (page === 1) {
            setCompanies(results);
          } else {
            setCompanies(prevCompanies => [...prevCompanies, ...results]);
          }
          setPagination(paginationInfo);
        } catch (error) {
          console.error('Error fetching companies:', error);
          setCompanies([]);
          setPagination(null);
        } finally {
          setLoading(false);
        }
      } else {
        setCompanies([]);
        setPagination(null);
      }
    }, debounceTime),
    [minQueryLength, debounceTime]
  );

  useEffect(() => {
    if (shouldFetchRef.current) {
      debouncedFetchCompanies(query, 1);
    } else {
      shouldFetchRef.current = true;
    }
  }, [query, debouncedFetchCompanies]);

  const setQueryWithoutFetch = (newQuery: string) => {
    shouldFetchRef.current = false;
    setQuery(newQuery);
  };

  const loadMoreResults = useCallback(() => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      debouncedFetchCompanies(query, pagination.currentPage + 1);
    }
  }, [query, pagination, debouncedFetchCompanies]);

  return {
    query,
    setQuery,
    setQueryWithoutFetch,
    companies,
    setCompanies,
    loading,
    selectedCompany,
    setSelectedCompany,
    isOpen,
    setIsOpen,
    pagination,
    loadMoreResults
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
