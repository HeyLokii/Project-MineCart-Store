import { Link } from 'wouter';
import { Star, ShoppingCart, Download, FileType, HardDrive, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Product, User as UserType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites, useFavoriteStatus } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { formatBytes } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch creator information
  const { data: creator } = useQuery({
    queryKey: ['/api/users', product.sellerId],
    enabled: !!product.sellerId
  });

  // Use custom hooks
  const { isFavorite, toggleFavorite, isToggling } = useFavorites();
  const { addToCart, isAdding, isInCart } = useCart();

  const isProductFavorite = isFavorite(product.id);
  const isProductInCart = isInCart(product.id);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      let starClass = 'star-empty';
      if (i <= fullStars) {
        starClass = 'star-filled';
      } else if (i === fullStars + 1 && hasHalfStar) {
        starClass = 'star-half';
      }

      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${starClass}`}
        />
      );
    }
    return (
      <>
        <div className="star-gradient-defs">
          <svg width="0" height="0">
            <defs>
              <linearGradient id="half-star-gradient">
                <stop offset="50%" stopColor="#FCD34D" />
                <stop offset="50%" stopColor="#374151" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {stars}
      </>
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Faça login para continuar",
        description: "Você precisa estar logado para adicionar produtos ao carrinho.",
        variant: "destructive",
      });
      return;
    }
    addToCart({ productId: product.id });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Faça login para continuar",
        description: "Você precisa estar logado para favoritar produtos.",
        variant: "destructive",
      });
      return;
    }
    toggleFavorite({ productId: product.id, isFavorite: isProductFavorite });
  };

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/creator/${creator?.id}`;
  };

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <Card className="product-card overflow-hidden h-full flex flex-col cursor-pointer">
        <div className="relative">
          <img
            src={product.images[product.mainImageIndex || 0] || product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-white">
              {product.discount === 100 ? 'GRÁTIS' : `-${product.discount}%`}
            </Badge>
          )}
          {/* Botão de Favoritar */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-2 h-auto z-10 border-0 transition-smooth"
            onClick={handleToggleFavorite}
            disabled={isToggling}
          >
            <Heart 
                className={`h-4 w-4 transition-all duration-200 ${
                  isFavorite(product.id) 
                    ? 'fill-red-500 text-red-500 scale-110' 
                    : 'text-gray-400 hover:text-red-500 hover:scale-105'
                }`} 
              />
          </Button>
          {product.isFeatured && (
            <Badge className="absolute top-2 right-12 bg-accent text-accent-foreground">
              Destaque
            </Badge>
          )}
          {!product.isActive && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Indisponível</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <h4 className="font-semibold text-lg mb-2 truncate text-dark-safe">
            {product.name}
          </h4>
          <p className="text-sm text-muted-foreground mb-3 capitalize">{product.category}</p>

          {/* Product Description Preview */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 whitespace-pre-line">
            {product.description}
          </p>

          {/* Informações técnicas */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
            {product.fileSize && (
              <div className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                {typeof product.fileSize === 'string' && product.fileSize.includes(' ') 
                  ? product.fileSize 
                  : formatBytes(parseInt(product.fileSize) || 0)}
              </div>
            )}
            {product.fileType && (
              <div className="flex items-center gap-1">
                <FileType className="h-3 w-3" />
                {product.fileType}
              </div>
            )}
            {product.downloadCount > 0 && (
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {product.downloadCount}
              </div>
            )}
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-center">
              <div className="star-rating mr-2 flex">
                {renderStars(parseFloat(product.rating))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} avaliações)
              </span>
            </div>

            {/* Informações do Criador */}
            {creator && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={creator.avatarUrl || creator.photoURL} alt={creator.displayName} />
                  <AvatarFallback className="text-xs">
                    {creator.displayName?.charAt(0) || <User className="h-3 w-3" />}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  Por <span 
                    className="hover:underline font-medium text-primary cursor-pointer" 
                    onClick={handleCreatorClick}
                  >
                    {creator.displayName || 'Criador'}
                  </span>
                  {creator.isVerified && (
                    <Badge variant="secondary" className="ml-1 text-xs">✓</Badge>
                  )}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {product.originalPrice && product.discount > 0 ? (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {parseFloat(product.originalPrice).toFixed(2)}
                    </span>
                    <span className="text-xl font-bold text-primary-orange">
                      {product.discount === 100 ? 'GRÁTIS' : `R$ ${parseFloat(product.price).toFixed(2)}`}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-primary-orange">
                    R$ {parseFloat(product.price).toFixed(2)}
                  </span>
                )}
              </div>
              <Button 
                onClick={handleAddToCart}
                className="bg-primary-orange hover:bg-primary-alternative text-white btn-primary rounded-lg border border-primary-orange"
                size="sm"
                disabled={!product.isActive || isAdding}
              >
                <ShoppingCart className="mr-1 h-4 w-4" />
                {isAdding 
                  ? 'Adicionando...' 
                  : isProductInCart 
                    ? 'Adicionar +' 
                    : 'Carrinho'
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}