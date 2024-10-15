export interface Employee {
    name: string
    title: string
    profile_picture: string
}

export interface ApiResponse {
    results: Company[]
    pagination: {
        currentPage: number
        totalPages: number
        totalHits: number
        hitsPerPage: number
        nextPage: number | null
    }
}

export interface Company {
    id: string | number;
    name: string;
    website: string;
    image: string;
  }
  
  export type SearchbarSize = 'small' | 'medium' | 'large';

export interface SearchbarProps {
    apiKey: string;
    onSelect: (company: Company) => void;
    mainColor?: string;
    placeholderText?: string;
    labelText?: string;
    size?: SearchbarSize;
    customStyles?: Partial<SearchbarStyles>;
}

export interface SearchbarStyles {
    container: React.CSSProperties;
    label: React.CSSProperties;
    inputWrapper: React.CSSProperties;
    input: React.CSSProperties;
    searchIcon: React.CSSProperties;
    dropdownIcon: React.CSSProperties;
    dropdown: React.CSSProperties;
    dropdownInner: React.CSSProperties;
    dropdownItem: React.CSSProperties;
    dropdownItemHover: React.CSSProperties;
    companyInfo: React.CSSProperties;
    companyLogo: React.CSSProperties;
    companyImage: React.CSSProperties;
    companyInitials: React.CSSProperties;
    companyTextInfo: React.CSSProperties;
    companyName: React.CSSProperties;
    companyWebsite: React.CSSProperties;
    checkIcon: React.CSSProperties;
    loadingContainer: React.CSSProperties;
    spinner: React.CSSProperties;
    noResults: React.CSSProperties;
}
