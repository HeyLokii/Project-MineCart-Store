import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { CartItem } from '@/types';

export const useCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const cartQuery = useQuery({
    queryKey: ['/api/cart', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const response = await apiRequest('GET', `/api/cart/${user.uid}`);
      return await response.json();
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: false
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      if (!user) throw new Error('Você precisa estar logado para adicionar ao carrinho');
      
      // Verificar se já está no carrinho
      const existingItem = cartQuery.data?.find((item: any) => item.productId === productId);
      
      if (existingItem) {
        // Se já existe, atualizar quantidade
        const res = await apiRequest('PUT', `/api/cart/${existingItem.id}`, {
          quantity: existingItem.quantity + quantity
        });
        return { ...await res.json(), action: 'updated' };
      } else {
        // Se não existe, adicionar novo
        const res = await apiRequest('POST', '/api/cart', {
          userId: user.uid,
          productId,
          quantity
        });
        return { ...await res.json(), action: 'added' };
      }
    },
    onSuccess: (data, { productId }) => {
      const action = data.action;
      toast({
        title: action === 'updated' ? "Quantidade atualizada!" : "Produto adicionado ao carrinho!",
        description: action === 'updated' 
          ? "A quantidade do produto foi atualizada no seu carrinho."
          : "O produto foi adicionado ao seu carrinho com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart', user?.uid] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar ao carrinho",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) => {
      const res = await apiRequest('PUT', `/api/cart/${cartItemId}`, { quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', user?.uid] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar carrinho",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      const res = await apiRequest('DELETE', `/api/cart/${cartItemId}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Produto removido do carrinho",
        description: "O produto foi removido do seu carrinho.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart', user?.uid] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover do carrinho",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user?.uid) throw new Error('User not authenticated');
      const res = await apiRequest('DELETE', `/api/cart/user/${user.uid}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Carrinho limpo",
        description: "Todos os produtos foram removidos do seu carrinho.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart', user?.uid] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao limpar carrinho",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const cartItems = Array.isArray(cartQuery.data) ? cartQuery.data : [];
  const cartTotal = cartItems.reduce((total: number, item: CartItem) => {
    if (item.product) {
      return total + (parseFloat(item.product.price) * item.quantity);
    }
    return total;
  }, 0);
  const itemCount = cartItems.reduce((count: number, item: CartItem) => count + item.quantity, 0);
  
  const isInCart = (productId: number) => {
    return cartItems.some((item: CartItem) => item.productId === productId);
  };

  return {
    cartItems,
    cartTotal,
    itemCount,
    isLoading: cartQuery.isLoading,
    isInCart,
    addToCart: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
    isUpdating: updateCartMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending
  };
};