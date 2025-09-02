import { useQuery } from '@tanstack/react-query';
import type { ServerConfig } from '@shared/schema';

export function useServerStatus() {
  return useQuery<ServerConfig>({
    queryKey: ['/api/server/status'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
