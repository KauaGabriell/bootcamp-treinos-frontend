const getBody = <T>(c: Response | Request): Promise<T> => {
  return c.json() as Promise<T>;
};

const getUrl = (contextUrl: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const newUrl = new URL(`${baseUrl}${contextUrl}`);
  return newUrl.toString();
};

const getHeaders = async (headers?: HeadersInit): Promise<HeadersInit> => {
  // Se estivermos no navegador (Client-side), não precisamos injetar cookies manualmente
  if (typeof window !== 'undefined') {
    return headers || {};
  }

  // Se estivermos no servidor (Server-side), importamos os cookies dinamicamente
  try {
    const { cookies } = await import('next/headers');
    const _cookies = await cookies();
    
    // Convertemos headers (que pode ser a classe Headers do Next.js) para um objeto simples
    const baseHeaders = headers instanceof Headers 
      ? Object.fromEntries(headers.entries()) 
      : (headers as Record<string, string>) || {};

    return {
      ...baseHeaders,
      cookie: _cookies.toString(),
    };
  } catch (e) {
    // Caso ocorra erro no import (ambiente não-node), retornamos os headers originais
    return headers || {};
  }
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const requestUrl = getUrl(url);
  const requestHeaders = await getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: "include",
  };

  const response = await fetch(requestUrl, requestInit);
  
  // Tratamento para respostas sem corpo (201, 204, etc)
  if (response.status === 201 || response.status === 204) {
    const data = response.status === 201 ? await getBody<T>(response) : {} as T;
    return { status: response.status, data, headers: response.headers } as T;
  }

  const data = await getBody<T>(response);
  return { status: response.status, data, headers: response.headers } as T;
};
