import { useParams, Link } from 'wouter';
import { MapPin, ExternalLink, Users, Download, Star, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import type { CreatorProfile, Product } from '@/types';

export default function Creator() {
  const { id } = useParams();

  const { data: creator, isLoading } = useQuery({
    queryKey: ['/api/users', id, 'profile'],
    enabled: !!id
  });

  const { data: products = [] } = useQuery({
    queryKey: ['/api/sellers', id, 'products'],
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 bg-muted rounded-full"></div>
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            </div>
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

  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Criador não encontrado</h1>
            <p className="text-muted-foreground mb-6">
              O perfil do criador que você está procurando não existe ou foi removido.
            </p>
            <Link href="/">
              <Button>Voltar ao Início</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalDownloads = products.reduce((total: number, product: Product) => total + (product.downloadCount || 0), 0);
  const averageRating = products.length > 0 
    ? products.reduce((total: number, product: Product) => total + parseFloat(product.rating), 0) / products.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Creator Header */}
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={creator.photoURL} alt={creator.displayName} />
                  <AvatarFallback className="text-2xl">
                    {creator.displayName?.charAt(0) || creator.email?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>

                {/* Creator Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{creator.displayName || 'Criador'}</h1>
                      {creator.isVerified && (
                        <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                          ✓ Verificado
                        </Badge>
                      )}
                      {creator.role === 'seller' && (
                        <Badge variant="secondary">Vendedor</Badge>
                      )}
                    </div>
                    
                    {creator.bio && (
                      <p className="text-muted-foreground text-lg">{creator.bio}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{products.length} {products.length === 1 ? 'produto' : 'produtos'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>{totalDownloads.toLocaleString()} downloads</span>
                    </div>
                    {averageRating > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-accent fill-current" />
                        <span>{averageRating.toFixed(1)} de avaliação média</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Membro desde {new Date(creator.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Links */}
                  {(creator.website || creator.socialLinks?.length > 0) && (
                    <div className="flex flex-wrap items-center gap-3">
                      {creator.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={creator.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Website
                          </a>
                        </Button>
                      )}
                      {creator.socialLinks?.map((link, index) => (
                        <Button key={index} variant="outline" size="sm" asChild>
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Link {index + 1}
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Produtos por {creator.displayName || 'este criador'}
              </h2>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {products.length} {products.length === 1 ? 'produto' : 'produtos'}
              </Badge>
            </div>

            {products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum produto ainda</h3>
                    <p>Este criador ainda não publicou nenhum produto na MineCart Store.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}