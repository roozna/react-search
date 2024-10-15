import { SearchbarSize, SearchbarStyles } from '../types';

const baseStyles: SearchbarStyles = {
  container: {
    width: '100%',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  label: {
    display: 'block',
    marginBottom: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderRadius: '0.375rem',
    border: '1px solid #D1D5DB',
    backgroundColor: '#FFFFFF',
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.875rem',
    color: '#111827',
    padding: '0.5rem 2.5rem',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    width: '1.25rem',
    height: '1.25rem',
    color: '#6B7280',
  },
  dropdownIcon: {
    position: 'absolute',
    right: '0.75rem',
    width: '1.25rem',
    height: '1.25rem',
    color: '#6B7280',
    transition: 'transform 0.2s ease-in-out',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '0.5rem',
    maxHeight: '13rem',
    overflowY: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 50,
    border: '1px solid #E5E7EB',
  },
  dropdownInner: {
    padding: '0.375rem',
  },
  dropdownItem: {
    padding: '0.5rem',
    cursor: 'pointer',
    borderRadius: '0.25rem',
    transition: 'background-color 0.2s ease-in-out',
  },
  dropdownItemHover: {
    backgroundColor: '#F3F4F6',
  },
  companyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  companyLogo: {
    flexShrink: 0,
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '9999px',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  companyInitials: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#1F2937',
  },
  companyTextInfo: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexGrow: 1,
  },
  companyName: {
    fontWeight: '500',
    color: '#111827',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  companyWebsite: {
    fontSize: '0.75rem',
    color: '#6B7280',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  checkIcon: {
    width: '1.25rem',
    height: '1.25rem',
    color: '#8B5CF6',
    marginLeft: 'auto',
    flexShrink: 0,
},
loadingContainer: {
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
},
spinner: {
  border: '2px solid #f3f3f3',
  borderTop: '2px solid #8B5CF6',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  animation: 'spin 1s linear infinite',
},
noResults: {
  padding: '0.75rem 1rem',
  textAlign: 'center',
  color: '#6B7280',
},
};

const sizeStyles: Record<SearchbarSize, Partial<SearchbarStyles>> = {
small: {
  container: { maxWidth: '20rem' },
  input: { padding: '0.375rem 2.25rem', fontSize: '0.75rem' },
  label: { fontSize: '0.75rem' },
  searchIcon: { width: '1rem', height: '1rem' },
  dropdownIcon: { width: '1rem', height: '1rem' },
},
medium: {
  container: { maxWidth: '25rem' },
  input: { padding: '0.5rem 2.5rem', fontSize: '0.875rem' },
  label: { fontSize: '0.875rem' },
  searchIcon: { width: '1.25rem', height: '1.25rem' },
  dropdownIcon: { width: '1.25rem', height: '1.25rem' },
},
large: {
  container: { maxWidth: '30rem' },
  input: { padding: '0.625rem 2.75rem', fontSize: '1rem' },
  label: { fontSize: '1rem' },
  searchIcon: { width: '1.5rem', height: '1.5rem' },
  dropdownIcon: { width: '1.5rem', height: '1.5rem' },
},
};

export const getSearchbarStyles = (
size: SearchbarSize,
mainColor: string,
customStyles: Partial<SearchbarStyles> = {}
): SearchbarStyles => {
const styles = {
  ...baseStyles,
  ...sizeStyles[size],
  inputWrapper: {
    ...baseStyles.inputWrapper,
    '&:focus-within': {
      borderColor: mainColor,
      boxShadow: `0 0 0 3px ${mainColor}33`,
    },
  },
  ...customStyles,
};

return styles;
};