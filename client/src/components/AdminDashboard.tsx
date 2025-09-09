import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Users, 
  DollarSign, 
  Download, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  BarChart3,
  Settings,
  TrendingUp
} from 'lucide-react';
import { PaymentSettings } from './PaymentSettings';
import { SellerPayouts } from './SellerPayouts';

export default function AdminDashboard() {
  const [stats] = useState({
    totalProducts: 1247,
    activeUsers: 8923,
    monthlySales: 45230,
    totalDownloads: 23456,
  });

  const [products] = useState([
    {
      id: 1,
      name: 'Dragões Supremos',
      category: 'Mundo',
      price: 15.99,
      status: 'active',
    },
    {
      id: 2,
      name: 'Pack de Texturas Medieval',
      category: 'Texturas',
      price: 12.50,
      status: 'active',
    },
  ]);

  const handleEditProduct = (id: number) => {
    console.log('Edit product:', id);
    // TODO: Implement edit functionality
  };

  const handleDeleteProduct = (id: number) => {
    console.log('Delete product:', id);
    // TODO: Implement delete functionality
  };

  const handleAddProduct = () => {
    console.log('Add new product');
    // TODO: Implement add functionality
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary rounded-lg p-3 mr-4">
                <Package className="text-white h-6 w-6" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Produtos</p>
                <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary rounded-lg p-3 mr-4">
                <Users className="text-white h-6 w-6" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Usuários Ativos</p>
                <p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-secondary rounded-lg p-3 mr-4">
                <DollarSign className="text-white h-6 w-6" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Vendas do Mês</p>
                <p className="text-2xl font-bold">R$ {stats.monthlySales.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-accent rounded-lg p-3 mr-4">
                <Download className="text-white h-6 w-6" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Downloads</p>
                <p className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="minecraftia text-primary">Painel Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="payments">
                <Settings className="w-4 h-4 mr-1" />
                Pagamentos
              </TabsTrigger>
              <TabsTrigger value="payouts">
                <TrendingUp className="w-4 h-4 mr-1" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Gerenciar Produtos</h3>
                <Button onClick={handleAddProduct} className="bg-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Produto
                </Button>
              </div>
              
              <div className="border rounded-lg">
                <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/30 font-semibold">
                  <div>Nome</div>
                  <div>Categoria</div>
                  <div>Preço</div>
                  <div>Status</div>
                  <div>Ações</div>
                </div>
                {products.map((product) => (
                  <div key={product.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-muted-foreground">{product.category}</div>
                    <div>R$ {(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(2)}</div>
                    <div>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditProduct(product.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Gerenciamento de usuários em desenvolvimento</p>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Analytics detalhado em desenvolvimento</p>
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <PaymentSettings />
            </TabsContent>

            <TabsContent value="payouts">
              <SellerPayouts />
            </TabsContent>

            <TabsContent value="settings">
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Configurações do sistema em desenvolvimento</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
