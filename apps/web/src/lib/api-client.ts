/**
 * Standardized API client for calling backend endpoints (apps/api on port 4000)
 * with auto-fallback and type safety.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

/**
 * Resolves an API path to the full backend URL (http://localhost:4000/api/v1/...)
 */
export function getApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean.startsWith('/api/v1')) {
    return clean.replace('/api/v1', API_BASE_URL);
  }
  if (clean.startsWith('/api')) {
    const baseWithoutV1 = API_BASE_URL.replace(/\/v1\/?$/, '');
    return clean.replace('/api', baseWithoutV1);
  }
  return `${API_BASE_URL}${clean}`;
}

export async function fetchApi<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = getApiUrl(endpoint);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    const json = await res.json();
    return json;
  } catch (error) {
    console.warn(`[fetchApi Error] ${url}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Koneksi ke backend terputus.',
    };
  }
}
