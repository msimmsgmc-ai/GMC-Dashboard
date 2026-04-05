import { QueryClient } from "@tanstack/react-query";

// __PORT_5000__ is replaced at deploy time with the proxy path
const API_BASE = typeof window !== "undefined" && (window as any).__PORT_5000__
  ? (window as any).__PORT_5000__
  : "";

export async function apiRequest(url: string, options?: RequestInit) {
  const fullUrl = url.startsWith("/") ? `${API_BASE}${url}` : url;
  const res = await fetch(fullUrl, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [url, ...rest] = queryKey as string[];
        const fullPath = rest.length ? `${url}/${rest.join("/")}` : url;
        const res = await apiRequest(fullPath);
        return res.json();
      },
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
