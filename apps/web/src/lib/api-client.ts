/**
 * Standardized API client for calling /api/v1 endpoints with auto-fallback and type safety
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function fetchApi<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

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
