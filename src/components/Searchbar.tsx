import React, { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { Company, SearchbarProps, SearchbarSize, SearchbarStyles, Theme, ThemeMode, PaginationInfo } from '../types';
import { useSearchbar } from '../hooks/useSearchbar';
import { searchCompanies } from '../utils/api';
import './Searchbar.css';

const defaultLightTheme: Theme = {
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#e5e7eb',
  hoverColor: '#f3f4f6',
  placeholderColor: '#9ca3af',
  scrollbarTrackColor: '#f1f1f1',
  scrollbarThumbColor: '#888',
};

const defaultDarkTheme: Theme = {
  backgroundColor: '#1f2937',
  textColor: '#f9fafb',
  borderColor: '#4b5563',
  hoverColor: '#374151',
  placeholderColor: '#9ca3af',
  scrollbarTrackColor: '#4a5568',
  scrollbarThumbColor: '#718096',
};

const getInitials = (name: string) => {
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

const sizeStyles: Record<SearchbarSize, { scale: number }> = {
  xs: { scale: 0.75 },
  sm: { scale: 0.875 },
  md: { scale: 1 },
  lg: { scale: 1.125 },
  xl: { scale: 1.25 },
  '2xl': { scale: 1.5 },
};

export function Searchbar({ 
  apiKey, 
  onSelect,
  mainColor = '#8B5CF6',
  placeholderText = 'Search companies...',
  labelText = 'Company name*',
  size = 'sm',
  width = '25rem',
  styles = {},
  openByDefault = false,
  alwaysOpen = false,
  infiniteScroll = false,
  theme: userTheme,
  lightTheme: userLightTheme = {},
  darkTheme: userDarkTheme = {}
}: SearchbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isFocused, setIsFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { 
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
  } = useSearchbar(
    async (q: string, page: number = 1) => {
      setIsLoadingMore(page > 1);
      const response = await searchCompanies(apiKey, q, page);
      setIsLoadingMore(false);
      return response;
    },
    2,
    300
  );

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

  useEffect(() => {
    if (userTheme) {
      setIsDarkMode(userTheme === 'dark');
    } else {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(darkModeMediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      darkModeMediaQuery.addEventListener('change', handleChange);

      return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    }
  }, [userTheme]);

  useEffect(() => {
    setIsOpen(openByDefault);
  }, [openByDefault]);

  const getLighterColor = (color: string, factor: number = 0.2): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${factor})`;
  };

  const lightTheme: Theme = { ...defaultLightTheme, ...userLightTheme };
  const darkTheme: Theme = { ...defaultDarkTheme, ...userDarkTheme };
  const theme = isDarkMode ? darkTheme : lightTheme;

  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spinner {
      border: 2px solid #f3f3f3;
      border-top: 2px solid ${mainColor};
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
    }
  `;

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: ${theme.scrollbarTrackColor};
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${theme.scrollbarThumbColor};
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${isDarkMode ? '#A0AEC0' : '#555'};
    }
  `;

  const containerStyle: React.CSSProperties = {
    width: width,
    position: 'relative',
    fontSize: `${sizeStyles[size].scale}rem`,
    ...styles.container
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    borderRadius: '0.5rem',
    border: isFocused ? `1px solid ${mainColor}` : `1px solid ${theme.borderColor}`,
    backgroundColor: theme.backgroundColor,
    boxShadow: isFocused ? `0 0 0 4px ${getLighterColor(mainColor)}` : '0 1px 2px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    ...styles.inputContainer
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '1em',
    color: theme.textColor,
    ...styles.input
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '0.5em',
    maxHeight: '13em',
    overflowY: 'auto',
    backgroundColor: theme.backgroundColor,
    borderRadius: '0.5em',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
    border: `1px solid ${theme.borderColor}`,
    padding: '0.375em',
    ...styles.dropdown
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: '0.5em',
    cursor: 'pointer',
    borderRadius: '0.375em',
    ...styles.dropdownItem
  };

  const placeholderClass = `placeholder-${isDarkMode ? 'dark' : 'light'}`;

  const placeholderStyles = `
    .${placeholderClass}::placeholder {
      color: ${theme.placeholderColor};
    }
  `;

  const handleReset = () => {
    setQuery('');
    setSelectedCompany(null);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (alwaysOpen) {
      setIsOpen(true);
    }
  }, [alwaysOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!infiniteScroll || !pagination || loading || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreResults();
    }
  };

  return (
    <div style={containerStyle}>
      <style>{spinnerStyle}</style>
      <style>{scrollbarStyles}</style>
      <style>{placeholderStyles}</style>
      <label
        htmlFor="company-search"
        style={{
          display: 'block',
          textAlign: 'left',
          marginBottom: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: theme.textColor,
          ...styles.label
        }}
      >
        {labelText}
      </label>
      <div style={inputContainerStyle}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          width: '100%',
          padding: '0.625rem 0.875rem',
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ width: '1.25rem', height: '1.25rem', color: theme.placeholderColor, marginRight: '0.5rem' }}
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
              if (!alwaysOpen) setIsOpen(true);
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            aria-label={placeholderText}
            aria-autocomplete="list"
            aria-controls="company-list"
            aria-expanded={isOpen}
            className={placeholderClass}
            style={inputStyle}
          />
          {(query || selectedCompany) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{
                width: '1.25rem',
                height: '1.25rem',
                color: theme.placeholderColor,
                marginLeft: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={handleReset}
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{
                width: '1.25rem',
                height: '1.25rem',
                color: theme.placeholderColor,
                marginLeft: '0.5rem',
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease-in-out',
              }}
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      {(isOpen || alwaysOpen) && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5em',
            backgroundColor: theme.backgroundColor,
            borderRadius: '0.5em',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            border: `1px solid ${theme.borderColor}`,
            width: '100%',
            ...styles.dropdownContainer
          }}
        >
          <div
            id="company-list"
            ref={dropdownRef}
            role="listbox"
            className="custom-scrollbar"
            style={{
              maxHeight: '13em',
              overflowY: 'auto',
              padding: '0.375em',
              ...styles.dropdown
            }}
            onScroll={handleScroll}
          >
            <div style={{ 
              padding: '0.375em', 
              position: 'relative',
              ...styles.dropdownInner 
            }}>
              {loading && !isLoadingMore ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1em', ...styles.loadingContainer }}>
                  <div className="spinner" style={styles.spinner} />
                </div>
              ) : companies.length > 0 ? (
                <>
                  {companies.map((company, index) => (
                    <div
                      key={company.id}
                      role="option"
                      aria-selected={selectedCompany?.id === company.id}
                      onClick={() => handleSelect(company)}
                      onMouseEnter={() => setHoveredCompany(company.id.toString())}
                      onMouseLeave={() => setHoveredCompany(null)}
                      style={{
                        ...dropdownItemStyle,
                        backgroundColor: selectedCompany?.id === company.id || hoveredCompany === company.id || focusedIndex === index ? theme.hoverColor : 'transparent',
                        outline: focusedIndex === index ? `2px solid ${mainColor}` : 'none',
                      }}
                      className="selected-business"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', ...styles.companyInfo }}>
                        <span
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                            width: '1.5em',
                            height: '1.5em',
                            borderRadius: '9999px',
                            overflow: 'hidden',
                            backgroundColor: '#F3F4F6',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            flexShrink: 0,
                            ...styles.companyLogo
                          }}
                        >
                          {company.image && !imageErrors[company.id] ? (
                            <img
                              src={company.image}
                              alt={`${company.name} logo`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', ...styles.companyImage }}
                              onError={() => {
                                console.log('Error loading image for company:', company.id);
                                setImageErrors(prev => ({ ...prev, [company.id]: true }));
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%',
                                borderRadius: '9999px',
                                backgroundColor: '#F3F4F6',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                color: '#1F2937',
                                ...styles.companyInitials
                              }}
                            >
                              {getInitials(company.name)}
                            </span>
                          )}
                        </span>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          overflow: 'hidden', 
                          flexGrow: 1, 
                          whiteSpace: 'nowrap',
                          ...styles.companyTextInfo 
                        }}>
                          <span style={{ 
                            fontWeight: '500', 
                            color: theme.textColor, 
                            marginRight: '0.5em',
                            ...styles.companyName 
                          }}>
                            {company.name}
                          </span>
                          <span style={{ 
                            color: isDarkMode ? '#9CA3AF' : '#6B7280', 
                            ...styles.companyWebsite 
                          }}>
                            {getDomainName(company.website)}
                          </span>
                        </div>
                        {(selectedCompany?.id === company.id || hoveredCompany === company.id.toString()) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            style={{ 
                              width: '1.25em', 
                              height: '1.25em', 
                              color: mainColor, 
                              marginLeft: 'auto',
                              flexShrink: 0,
                              ...styles.checkIcon 
                            }}
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
                  ))}
                  {isLoadingMore && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1em', ...styles.loadingContainer }}>
                      <div className="spinner" style={styles.spinner} />
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: '0.75em 1em', textAlign: 'center', color: theme.textColor, ...styles.noResults }}>
                  No results found
                </div>
              )}
            </div>
          </div>
          <div style={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2em',
            background: `linear-gradient(to bottom, ${theme.backgroundColor}00, ${theme.backgroundColor})`,
            pointerEvents: 'none',
            borderBottomLeftRadius: '0.5em',
            borderBottomRightRadius: '0.5em',
            marginTop: '-2em',
            ...styles.gradientOverlay
          }} />
        </div>
      )}
    </div>
  );
}
