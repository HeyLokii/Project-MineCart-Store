
import { useQuery } from '@tanstack/react-query';

interface Statistics {
  activeProducts: number;
  totalUsers: number;
  satisfactionRate: string;
  totalDownloads: number;
  totalOrders: number;
  productsWithReviews: number;
}

export const useStatistics = () => {
  return useQuery<Statistics>({
    queryKey: ['/api/statistics'],
    queryFn: async () => {
      const response = await fetch('/api/statistics');
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      return response.json();
    },
    refetchInterval: 5000, // Atualizar a cada 5 segundos para tempo real
    refetchIntervalInBackground: true, // Continuar atualizando mesmo em background
  });
};
