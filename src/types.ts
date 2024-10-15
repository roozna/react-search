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
  
  export interface SearchbarProps {
    apiKey: string;
    onSelect: (company: Company) => void;
    mainColor?: string;
    placeholderText?: string;
    labelText?: string;
  }

export interface SearchbarStyles {
    container: React.CSSProperties;
    label: React.CSSProperties;
    input: React.CSSProperties;
    dropdown: React.CSSProperties;
    dropdownItem: React.CSSProperties;
    companyImage: React.CSSProperties;
    companyName: React.CSSProperties;
    companyWebsite: React.CSSProperties;
    selectedIcon: React.CSSProperties;
}