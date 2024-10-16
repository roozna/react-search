export interface Employee {
    name: string
    title: string
    profile_picture: string
}

export interface ApiResponse {
    results: Company[];
    pagination: PaginationInfo;
}

export interface Company {
    id: string | number;
    name: string;
    website: string;
    image: string;
    followers?: string;
    cover_image?: string;
}

export type SearchbarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface SearchbarStyles {
  container?: React.CSSProperties;
  label?: React.CSSProperties;
  inputContainer?: React.CSSProperties;
  input?: React.CSSProperties;
  dropdown?: React.CSSProperties;
  dropdownInner?: React.CSSProperties;
  dropdownItem?: React.CSSProperties;
  loadingContainer?: React.CSSProperties;
  spinner?: React.CSSProperties;
  noResults?: React.CSSProperties;
  gradientOverlay?: React.CSSProperties;
  companyInfo?: React.CSSProperties;
  companyLogo?: React.CSSProperties;
  companyImage?: React.CSSProperties;
  companyInitials?: React.CSSProperties;
  companyTextInfo?: React.CSSProperties;
  companyName?: React.CSSProperties;
  companyWebsite?: React.CSSProperties;
  checkIcon?: React.CSSProperties;
  dropdownContainer?: React.CSSProperties;
}

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverColor: string;
  placeholderColor: string;
  scrollbarTrackColor: string;
  scrollbarThumbColor: string;
}

export interface SearchbarProps {
    apiKey: string;
    onSelect: (company: Company) => void;
    mainColor?: string;
    placeholderText?: string;
    labelText?: string;
    size?: SearchbarSize;
    width?: string;
    styles?: Partial<SearchbarStyles>;
    openByDefault?: boolean;
    theme?: ThemeMode;
    lightTheme?: Partial<Theme>;
    darkTheme?: Partial<Theme>;
    alwaysOpen?: boolean;
    infiniteScroll?: boolean;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalHits: number;
    hitsPerPage: number;
    nextPage: number | null;
}
