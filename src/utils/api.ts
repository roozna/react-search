import { ApiResponse, Company, PaginationInfo } from '../types';

const API_URL = 'https://api.roozna.com/v1/search';

export async function searchCompanies(apiKey: string, query: string, page: number = 1): Promise<{ companies: Company[], pagination: PaginationInfo }> {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&page=${page}`, {
      headers: {
        'x-api-key': apiKey,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
  
    const data: ApiResponse = await response.json();
    return {
      companies: data.results,
      pagination: data.pagination
    };
  }
