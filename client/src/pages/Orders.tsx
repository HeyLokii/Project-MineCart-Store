import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Calendar, CreditCard, Package, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Order } from '@shared/schema';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

function getStatusText(status: string): string {
  switch (status) {
    case 'completed':
      return 'Concluído';
    case 'pending':
      return 'Pendente';
    case 'failed':
      return 'Falhou';
    default:
      return 'Desconhecido';
  }
}

export default function Orders() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Buscar pedidos reais da API usando ID do usuário
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders/user', user?.uid],
    enabled: !!user?.uid,
  });

  const handleDownload = async (product: any) => {
    try {
      if (!product.downloadUrl) {
        toast({
          title: "Erro",
          description: "Link de download não disponível.",
          variant: "destructive",
        });
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = product.downloadUrl;
      link.download = product.fileName || `${product.name}.zip`; // Use fileName if available, otherwise construct from product name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download iniciado!",
        description: `${product.name} está sendo baixado.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para ver suas compras.
          </p>
          <Link href="/auth">
            <Button>Fazer Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Inventário</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Inventário</h1>
        <Badge variant="secondary" className="ml-auto">
          {orders.length} {orders.length === 1 ? 'compra' : 'compras'}
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma compra ainda</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não fez nenhuma compra. Que tal explorar nossos produtos?
            </p>
            <Link href="/">
              <Button>Explorar Produtos</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id} className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                      {order.product?.images?.[0] ? (
                        <img
                          src={order.product.images[0]}
                          alt={order.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {order.product?.name || 'Produto'}
                      </h3>
                      <p className="text-sm text-gray-400">ID: {order.product?.uniqueId || 'N/A'}</p>
                      <p className="text-sm text-gray-400">Compra #{order.id}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-primary">R$ {parseFloat(order.amount).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {order.status === 'completed' && order.product?.downloadUrl ? (
                      <Button size="sm" onClick={() => handleDownload(order.product)} className="bg-primary hover:bg-primary/90">
                        <Download className="mr-2 h-4 w-4" />
                        Baixar Produto
                      </Button>
                    ) : (
                      <Button size="sm" disabled variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Processando...
                      </Button>
                    )}
                    <Link href={`/product/${order.productId}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Produto
                      </Button>
                    </Link>
                  </div>
                </div>

                {order.status === 'completed' && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg border-l-4 border-l-primary">
                    <p className="text-sm text-primary">
                      ✅ Compra finalizada! O produto está disponível para download.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}