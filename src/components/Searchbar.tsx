import React, { useRef, useEffect, useState, KeyboardEvent } from 'react';
import { Company, SearchbarProps } from '../types';
import { useSearchbar } from '../hooks/useSearchbar';
import { searchCompanies } from '../utils/api';
import './Searchbar.css';

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

export function Searchbar({ 
  apiKey, 
  onSelect,
  mainColor = '#8B5CF6',
  placeholderText = 'Search companies...',
  labelText = 'Company name*'
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

  const getLighterColor = (color: string, factor: number = 0.2): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${factor})`;
  };

  // Add this CSS class to your Searchbar.css file
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

  return (
    <>
    <div style={{ width: '100%', position: 'relative', maxWidth: '25rem' }}>
      <style>{spinnerStyle}</style>
      <label
        htmlFor="company-search"
        style={{
          display: 'block',
          textAlign: 'left',
          marginBottom: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
        }}
      >
        {labelText}
      </label>
      <div
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '0.5rem',
          border: isFocused ? `1px solid ${mainColor}` : '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
          boxShadow: isFocused ? `0 0 0 4px ${getLighterColor(mainColor)}` : '0 1px 2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '25rem',
          transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        }}
      >
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
            style={{ width: '1.25rem', height: '1.25rem', color: '#6B7280', marginRight: '0.5rem' }}
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
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              color: '#111827',
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{
              width: '1.25rem',
              height: '1.25rem',
              color: '#6B7280',
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
        </div>
      </div>
      {isOpen && (
        <div
          id="company-list"
          ref={dropdownRef}
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.5rem',
            maxHeight: '13rem',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            border: '1px solid #E5E7EB',
            padding: '0.375rem',
          }}
        >
          <div style={{ padding: '0.375rem' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <div className="spinner" />
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
                    padding: '0.5rem',
                    cursor: 'pointer',
                    borderRadius: '0.375rem',
                    backgroundColor: selectedCompany?.id === company.id || hoveredCompany === company.id || focusedIndex === index ? '#F3F4F6' : 'transparent',
                    outline: focusedIndex === index ? `2px solid ${mainColor}` : 'none',
                  }}
                  className="selected-business"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        flexShrink: 0,
                        position: 'relative',
                        display: 'inline-block',
                        width: '1.5rem',
                        height: '1.5rem',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        backgroundColor: '#F3F4F6',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      {company.image && !imageErrors[company.id] ? (
                        <img
                          src={company.image}
                          alt={`${company.name} logo`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={() => {
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
                          }}
                        >
                          {getInitials(company.name)}
                        </span>
                      )}
                    </span>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      overflow: 'hidden',
                      flexGrow: 1,
                    }}>
                      <span style={{ 
                        fontWeight: '500', 
                        color: '#111827', 
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {company.name}
                      </span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: '#6B7280', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
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
                          width: '1.25rem', 
                          height: '1.25rem', 
                          color: mainColor, 
                          marginLeft: 'auto',
                          flexShrink: 0,
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
              ))
            ) : (
              <div style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#6B7280' }}>
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}