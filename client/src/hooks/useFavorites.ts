import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Favorite } from '@/types';

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const favoritesQuery = useQuery({
    queryKey: ['/api/favorites', user?.uid],
    queryFn: () => user?.uid ? apiRequest('GET', `/api/favorites/${user.uid}`) : Promise.resolve([]),
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ productId, isFavorite }: { productId: number; isFavorite: boolean }) => {
      if (!user) throw new Error('Você precisa estar logado para favoritar');
      
      if (isFavorite) {
        await apiRequest('DELETE', `/api/favorites/${user.uid}/${productId}`);
        return { action: 'removed', productId };
      } else {
        const res = await apiRequest('POST', '/api/favorites', {
          userId: user.uid,
          productId
        });
        const data = await res.json();
        return { ...data, action: 'added' };
      }
    },
    onSuccess: (data, { productId, isFavorite }) => {
      toast({
        title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: `Produto foi ${isFavorite ? 'removido dos' : 'adicionado aos'} seus favoritos.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites', user?.uid] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar favoritos",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const isFavorite = (productId: number) => {
    if (!favoritesQuery.data || !Array.isArray(favoritesQuery.data)) return false;
    return favoritesQuery.data.some((fav: Favorite) => fav.productId === productId);
  };

  return {
    favorites: favoritesQuery.data || [],
    isLoading: favoritesQuery.isLoading,
    isFavorite,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isToggling: toggleFavoriteMutation.isPending
  };
};

export const useFavoriteStatus = (productId: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['/api/favorites', user?.uid, productId, 'check'],
    queryFn: () => user?.uid ? apiRequest('GET', `/api/favorites/${user.uid}/${productId}/check`) : Promise.resolve({ isFavorite: false }),
    enabled: !!user?.uid && !!productId,
    select: (data: any) => data.isFavorite,
    staleTime: 1000 * 60 * 2 // 2 minutes
  });
};