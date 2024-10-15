import React, { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { Company, SearchbarProps, SearchbarSize } from '../types';
import { useSearchbar } from '../hooks/useSearchbar';
import { searchCompanies } from '../utils/api';
import { getSearchbarStyles } from '../styles/searchbarStyles';
import './Searchbar.css';

const getInitials = (name: string): string => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

const getDomainName = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export function Searchbar({ 
  apiKey, 
  onSelect,
  mainColor = '#8B5CF6',
  placeholderText = 'Search companies...',
  labelText = 'Company name*',
  size = 'medium',
  customStyles = {}
}: SearchbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isFocused, setIsFocused] = useState(false);
  const { 
    query, 
    setQuery,
    setQueryWithoutFetch, 
    companies, 
    loading, 
    selectedCompany, 
    setSelectedCompany,
    isOpen,
    setIsOpen
  } = useSearchbar(
    (q: string) => searchCompanies(apiKey, q).then(response => response),
    2,
    300
  );

  const styles = getSearchbarStyles(size, mainColor, customStyles);

  const handleSelect = (company: Company) => {
    setSelectedCompany(company);
    onSelect(company);
    setQueryWithoutFetch(company.name);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < companies.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleSelect(companies[focusedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [companies]);

  return (
    <div style={styles.container}>
      <label htmlFor="company-search" style={styles.label}>
        {labelText}
      </label>
      <div style={styles.inputWrapper}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={styles.searchIcon}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          id="company-search"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsOpen(true);
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          aria-label={placeholderText}
          aria-autocomplete="list"
          aria-controls="company-list"
          aria-expanded={isOpen}
          style={styles.input}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{
            ...styles.dropdownIcon,
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {isOpen && (
        <div
          id="company-list"
          ref={dropdownRef}
          role="listbox"
          style={styles.dropdown}
        >
          <div style={styles.dropdownInner}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div className="spinner" style={styles.spinner} />
              </div>
            ) : companies.length > 0 ? (
              companies.map((company, index) => (
                <div
                  key={company.id}
                  role="option"
                  aria-selected={selectedCompany?.id === company.id}
                  onClick={() => handleSelect(company)}
                  onMouseEnter={() => setHoveredCompany(company.id.toString())}
                  onMouseLeave={() => setHoveredCompany(null)}
                  style={{
                    ...styles.dropdownItem,
                    backgroundColor: selectedCompany?.id === company.id || hoveredCompany === company.id || focusedIndex === index ? styles.dropdownItemHover.backgroundColor : 'transparent',
                    outline: focusedIndex === index ? `2px solid ${mainColor}` : 'none',
                  }}
                >
                  <div style={styles.companyInfo}>
                    <span style={styles.companyLogo}>
                      {company.image && !imageErrors[company.id] ? (
                        <img
                          src={company.image}
                          alt={`${company.name} logo`}
                          style={styles.companyImage}
                          onError={() => {
                            setImageErrors(prev => ({ ...prev, [company.id]: true }));
                          }}
                        />
                      ) : (
                        <span style={styles.companyInitials}>
                          {getInitials(company.name)}
                        </span>
                      )}
                    </span>
                    <div style={styles.companyTextInfo}>
                      <span style={styles.companyName}>
                        {company.name}
                      </span>
                      <span style={styles.companyWebsite}>
                        {getDomainName(company.website)}
                      </span>
                    </div>
                    {(selectedCompany?.id === company.id || hoveredCompany === company.id.toString()) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        style={styles.checkIcon}
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noResults}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}