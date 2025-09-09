import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import ProductCard from '@/components/ProductCard';
import { Link } from 'wouter';
import { useProducts } from '@/hooks/useProducts';

export default function Favorites() {
  console.log('RENDERIZANDO PÁGINA DE FAVORITOS');
  
  const { user } = useAuth();
  const { favorites, isLoading } = useFavorites();
  const { data: products } = useProducts();
  
  // Mapear favoritos com produtos
  const favoriteProducts = Array.isArray(favorites) ? favorites
    .map((favorite: any) => {
      const product = products?.find((p: any) => p.id === favorite.productId);
      return product;
    })
    .filter(Boolean) : [];

  console.log('DADOS DOS FAVORITOS:', favorites);
  console.log('DADOS DOS PRODUTOS:', products);
  console.log('PRODUTOS FAVORITOS MAPEADOS:', favoriteProducts);

  // Removido temporariamente para usar usuário fixo durante desenvolvimento

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Meus Favoritos</h1>
            <p className="text-muted-foreground">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
            </p>
          </div>

          {favoriteProducts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h3>
                <p className="text-muted-foreground mb-6">
                  Comece a favoritar produtos para salvá-los aqui!
                </p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Explorar Produtos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}