import { ApiResponse, Company } from '../types';

const API_URL = 'https://api.roozna.com/v1/search';

export async function searchCompanies(apiKey: string, query: string, page: number = 1): Promise<Company[]> {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
  
    const data: ApiResponse = await response.json();
    return data.results;
  }