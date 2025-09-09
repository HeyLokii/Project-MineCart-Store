import { useParams, Link } from 'wouter';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Download, ShoppingCart, Heart, ArrowLeft, Play, Eye, Package, MessageCircle, Users, Calendar, HardDrive, FileType } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CheckoutPix from '@/components/CheckoutPix';
import ThreeViewer from '@/components/ThreeViewer';
import ReviewSystem from '@/components/ReviewSystem';
import type { Product } from '@/types';
import { formatBytes } from '@/lib/utils';

// Função para extrair ID do YouTube de diferentes formatos de URL
const extractYouTubeId = (url: string): string => {
  if (!url) return '';

  // Se já é apenas o ID (11 caracteres)
  if (url.length === 11 && !/[\/\?\&\=]/.test(url)) {
    return url;
  }

  // Extrair de URLs do YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return url; // Retorna o valor original se não conseguir extrair
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite, isToggling } = useFavorites();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
  });

  const { data: userOrders = [] } = useQuery({
    queryKey: ['/api/orders/user', user?.id],
    enabled: !!user?.id
  });

  const { data: productCreator } = useQuery({
    queryKey: ['/api/users', product?.sellerId],
    enabled: !!product?.sellerId
  });

  // Check if user has purchased this product
  const userHasPurchased = userOrders.some((order: any) => {
    // Verificar se o produto foi comprado (status completed)
    const productMatches = order.productId === parseInt(id || '0') || 
                          (product && order.product && order.product.uniqueId === product.uniqueId);
    return productMatches && order.status === 'completed';
  });

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
          className={`h-5 w-5 ${starClass}`}
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

  const handlePurchase = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para comprar produtos.",
        variant: "destructive",
      });
      return;
    }
    if (product) {
      setShowCheckout(true);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para favoritar produtos.",
        variant: "destructive",
      });
      return;
    }
    if (product) {
      const isProductFavorite = isFavorite(product.id);
      toggleFavorite({ productId: product.id, isFavorite: isProductFavorite });
    }
  };

  const handleCreatorClick = () => {
    if (product?.sellerId) {
      window.location.href = `/creator/${product.sellerId}`;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-muted h-8 w-48 rounded mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted h-64 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-muted h-8 rounded"></div>
              <div className="bg-muted h-4 rounded"></div>
              <div className="bg-muted h-20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-destructive text-lg">Produto não encontrado.</p>
          <Link href="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Images and 3D Viewer */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={product.images[selectedImageIndex] || product.images[product.mainImageIndex || 0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                        -{product.discount}%
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Badge className="absolute top-4 right-4 bg-yellow-500 text-black">
                        ⭐ Destaque
                      </Badge>
                    )}
                  </div>

                  {/* Image Gallery */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className={`w-full h-16 object-cover rounded-md cursor-pointer transition-all ${
                            selectedImageIndex === index
                              ? 'ring-2 ring-primary opacity-100'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* YouTube Video */}
                {(product.youtubeVideoId || product.videoUrl || product.youtubeUrl) && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Vídeo Demonstrativo</h4>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${extractYouTubeId(product.youtubeVideoId || product.videoUrl || product.youtubeUrl || '')}`}
                        title="Product Demo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}

                {/* 3D Viewer */}
                {product.modelUrl && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Visualização 3D</h4>
                    <ThreeViewer modelUrl={product.modelUrl} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Details and Reviews */}
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Avaliações ({product.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Produto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Descrição</h4>
                    <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
                  </div>

                  {product.compatibility && product.compatibility.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Compatibilidade</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.compatibility.map((version, index) => (
                          <Badge key={index} variant="secondary">{version}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.features && product.features.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Características</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {product.downloadCount.toLocaleString()} downloads
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent" />
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviewCount} avaliações)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewSystem
                productId={product.id}
                userHasPurchased={userHasPurchased}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-muted-foreground capitalize">{product.category}</p>
                    <span className="text-muted-foreground">•</span>
                    <p className="text-sm text-muted-foreground font-mono">ID: {product.uniqueId}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  {product.originalPrice && product.discount > 0 ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {parseFloat(product.originalPrice).toFixed(2)}
                        </span>
                        <Badge className="bg-red-500 text-white">
                          -{product.discount}%
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        R$ {parseFloat(product.price).toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl font-bold text-primary">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Downloads</p>
                      <p className="font-medium">{(product.downloadCount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Avaliações</p>
                      <p className="font-medium">{product.reviewCount || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handlePurchase}
                    className="w-full bg-primary hover:bg-primary/90 text-white border border-primary"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Comprar Agora
                  </Button>

                  <Button
                    onClick={handleAddToWishlist}
                    variant="outline"
                    className="w-full border border-gray-300 hover:border-gray-400"
                    size="lg"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-all duration-200 ${
                        isFavorite(product.id) 
                          ? 'fill-red-500 text-red-500 scale-110' 
                          : 'text-gray-400 hover:text-red-500 hover:scale-105'
                      }`} 
                    />
                    Adicionar aos Favoritos
                  </Button>
                </div>

                {/* Product Info */}
                <div className="border-t pt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Publicado em:</span>
                    <span>{new Date(product.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {product.fileSize && (
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Tamanho:</span>
                      <span>{typeof product.fileSize === 'string' && product.fileSize.includes(' ') 
                        ? product.fileSize 
                        : formatBytes(parseInt(product.fileSize) || 0)}</span>
                    </div>
                  )}

                  {product.fileType && (
                    <div className="flex items-center gap-2">
                      <FileType className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Tipo:</span>
                      <span>{product.fileType}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Criador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={productCreator?.avatarUrl || productCreator?.photoURL} />
                  <AvatarFallback>
                    {productCreator?.displayName?.[0] || productCreator?.firstName?.[0] || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p
                    className="font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={handleCreatorClick}
                  >
                    {productCreator?.displayName || `${productCreator?.firstName || ''} ${productCreator?.lastName || ''}`.trim() || 'Criador'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {productCreator?.role === 'admin' ? 'Administrador' :
                     productCreator?.isVerified ? 'Criador Verificado' : 'Criador'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {productCreator?.bio || 'Criador de conteúdo para Minecraft.'}
              </p>
              {productCreator && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {productCreator.youtubeUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={productCreator.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <span className="text-destructive">📺</span>
                        YouTube
                      </a>
                    </Button>
                  )}
                  {productCreator.twitterUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={productCreator.twitterUrl} target="_blank" rel="noopener noreferrer">
                        <span className="text-secondary">🐦</span>
                        Twitter
                      </a>
                    </Button>
                  )}
                  {productCreator.instagramUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={productCreator.instagramUrl} target="_blank" rel="noopener noreferrer">
                        <span className="text-pink-500">📷</span>
                        Instagram
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      {product && (
        <CheckoutPix
          products={[{
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
          }]}
          total={parseFloat(product.price)}
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            toast({
              title: "Compra realizada!",
              description: "Produto adicionado à sua biblioteca.",
            });
          }}
        />
      )}
    </div>
  );
}