import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Package, DollarSign, BarChart3, Upload, FileText, Settings, LifeBuoy, Cog, CheckCircle, XCircle } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Link } from 'wouter';
import ActivityFeed from './ActivityFeed';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  fileType: string;
  hasDiscount: boolean;
  discountPercentage: number;
  images: string[];
  mainImageIndex: number;
  youtubeVideoId: string;
}

export default function AdminDashboardNew() {
  const { data: products = [], refetch: refetchProducts } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: 'skins',
    fileType: '.png',
    hasDiscount: false,
    discountPercentage: 0,
    images: [''],
    mainImageIndex: 0,
    youtubeVideoId: ''
  });

  // Mocking pendingProducts and related functions for demonstration
  const [pendingProducts, setPendingProducts] = useState([
    { id: 1, name: 'Mapa Aventura', status: 'pending', isActive: false, category: 'maps', price: '15,00', images: ['/mapa1.png'], mainImageIndex: 0, description: 'Mapa de aventura' },
    { id: 2, name: 'Skin Guerreiro', status: 'pending', isActive: false, category: 'skins', price: '8,50', images: ['/skin1.png'], mainImageIndex: 0, description: 'Skin de guerreiro' },
  ]);
  const refetchPendingProducts = () => {
    // In a real app, this would fetch from an API
    setPendingProducts([
      { id: 1, name: 'Mapa Aventura', status: 'pending', isActive: false, category: 'maps', price: '15,00', images: ['/mapa1.png'], mainImageIndex: 0, description: 'Mapa de aventura' },
      { id: 2, name: 'Skin Guerreiro', status: 'pending', isActive: false, category: 'skins', price: '8,50', images: ['/skin1.png'], mainImageIndex: 0, description: 'Skin de guerreiro' },
    ]);
  };
  const approveProductMutation = { isPending: false };
  const rejectProductMutation = { isPending: false };
  const queryClient = useQueryClient();
  const { toast } = useToast();


  const categoryTemplates = {
    skins: {
      fileTypes: ['.png', '.json'],
      defaultDescription: 'Skin personalizada para Minecraft com alta qualidade e detalhes únicos. Compatível com Java Edition e Bedrock Edition.',
      priceRange: { min: 2.99, max: 9.99 }
    },
    maps: {
      fileTypes: ['.mcworld', '.zip'],
      defaultDescription: 'Mapa customizado para Minecraft com aventuras únicas, puzzles desafiadores e paisagens incríveis.',
      priceRange: { min: 5.99, max: 19.99 }
    },
    mods: {
      fileTypes: ['.mcaddon', '.mcpack', '.zip'],
      defaultDescription: 'Mod que adiciona novas funcionalidades, itens e mecânicas ao seu Minecraft. Fácil instalação.',
      priceRange: { min: 3.99, max: 24.99 }
    },
    textures: {
      fileTypes: ['.mcpack', '.zip'],
      defaultDescription: 'Pack de texturas premium que transforma completamente a aparência do seu Minecraft.',
      priceRange: { min: 4.99, max: 14.99 }
    },
    worlds: {
      fileTypes: ['.mcworld', '.zip'],
      defaultDescription: 'Mundo completo e personalizado para Minecraft com estruturas únicas e paisagens deslumbrantes.',
      priceRange: { min: 7.99, max: 29.99 }
    }
  };

  const handleCategoryChange = (category: string) => {
    const template = categoryTemplates[category as keyof typeof categoryTemplates];
    setProductForm(prev => ({
      ...prev,
      category,
      fileType: template.fileTypes[0],
      description: template.defaultDescription,
      price: template.priceRange.min.toFixed(2).replace('.', ',')
    }));
  };

  const calculateDiscountedPrice = () => {
    if (!productForm.hasDiscount || !productForm.price) return productForm.price;
    const price = parseFloat(productForm.price.replace(',', '.'));
    const discounted = price * (1 - productForm.discountPercentage / 100);
    return discounted.toFixed(2).replace('.', ',');
  };

  const handleEditProduct = (product: any) => {
    setIsCreateModalOpen(false);
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'skins',
      fileType: product.fileType || '.png',
      hasDiscount: (product.discount || 0) > 0,
      discountPercentage: product.discount || 0,
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [''],
      mainImageIndex: product.mainImageIndex || 0,
      youtubeVideoId: product.youtubeVideoId || ''
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'skins',
      fileType: '.png',
      hasDiscount: false,
      discountPercentage: 0,
      images: [''],
      mainImageIndex: 0,
      youtubeVideoId: ''
    });
    setEditingProduct(null);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      console.log('Updating product:', editingProduct.id, productForm);
      // In a real scenario, you would call an API to update the product
      // For now, just close and reset
    } else {
      console.log('Creating product:', productForm);
      // In a real scenario, you would call an API to create the product
      // For now, just close and reset
    }
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleApproveProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          isActive: true
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao aprovar produto');
      }

      // Atualizar o estado local imediatamente
      setPendingProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, status: 'approved', isActive: true }
          : p
      ).filter(p => p.status === 'pending'));

      // Forçar revalidação dos dados
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products/pending'] });

      // Refetch para garantir dados atualizados
      refetchPendingProducts();
      refetchProducts();

      toast({
        title: "Produto aprovado! ✅",
        description: "O produto foi aprovado com sucesso e está visível no catálogo.",
      });
    } catch (error) {
      console.error('Erro ao aprovar produto:', error);
      toast({
        title: "Erro ao aprovar produto",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleRejectProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          isActive: false
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao rejeitar produto');
      }

      // Atualizar o estado local imediatamente
      setPendingProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, status: 'rejected', isActive: false }
          : p
      ).filter(p => p.status === 'pending'));

      // Forçar revalidação dos dados
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products/pending'] });

      // Refetch para garantir dados atualizados
      refetchPendingProducts();
      refetchProducts();

      toast({
        title: "Produto rejeitado. ❌",
        description: "O produto foi rejeitado e não ficará visível no catálogo.",
      });
    } catch (error) {
      console.error('Erro ao rejeitar produto:', error);
      toast({
        title: "Erro ao rejeitar produto",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };


  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isActive).length,
    totalRevenue: 'R$ 0,00',
    pendingOrders: pendingProducts.length,
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Gerencie produtos, vendas e configurações da loja</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProducts} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Para processar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5 text-blue-500" />
                  Suporte ao Cliente
                </CardTitle>
                <CardDescription>Gerencie mensagens de contato e suporte</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/support">
                  <Button variant="outline" className="w-full">
                    Acessar Suporte
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cog className="h-5 w-5 text-green-500" />
                  Configurações do Site
                </CardTitle>
                <CardDescription>Edite redes sociais e configurações gerais</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full">
                    Acessar Configurações
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-500" />
                  Gerenciar Produtos
                </CardTitle>
                <CardDescription>Criar, editar e organizar produtos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab('products')}
                >
                  Acessar Produtos
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <ActivityFeed limit={5} />
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>

            <Dialog
              open={isCreateModalOpen}
              onOpenChange={(open) => {
                setIsCreateModalOpen(open);
                if (!open) {
                  setTimeout(resetForm, 100);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Produto</DialogTitle>
                  <DialogDescription>
                    Configure os detalhes do produto com templates automáticos por categoria
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Produto</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Skin Guerreiro Medieval"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={productForm.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="border border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(['Skins', 'Worlds', 'Add-ons', 'Textures', 'Mods'] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => {
                                const descriptions = {
                                  'Skins': 'Pack de skins de alta qualidade para transformar o visual do seu Minecraft.',
                                  'Worlds': 'Mundo personalizado com construções únicas e aventuras incríveis.',
                                  'Add-ons': 'Addon que adiciona novas funcionalidades e mecânicas ao jogo.',
                                  'Textures': 'Pack de texturas de alta qualidade para transformar o visual do seu Minecraft.',
                                  'Mods': 'Modificação que adiciona novos conteúdos e funcionalidades ao jogo.'
                                };
                                setProductForm({
                                  ...productForm,
                                  category: cat,
                                  description: descriptions[cat as keyof typeof descriptions] || productForm.description
                                });
                              }}
                              className={`category-button px-4 py-2 rounded-lg transition-colors border-2 ${
                                productForm.category === cat
                                  ? 'bg-primary text-primary-foreground border-primary active'
                                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border'
                              }`}
                              aria-pressed={productForm.category === cat}
                              data-state={productForm.category === cat ? 'on' : 'off'}
                            >
                              {cat}
                            </button>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fileType">Tipo de Arquivo</Label>
                      <Select value={productForm.fileType} onValueChange={(value) => setProductForm(prev => ({ ...prev, fileType: value }))}>
                        <SelectTrigger className="border border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryTemplates[productForm.category as keyof typeof categoryTemplates]?.fileTypes?.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          )) || []}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="9,99"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="discount"
                        checked={productForm.hasDiscount}
                        onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, hasDiscount: checked }))}
                      />
                      <Label htmlFor="discount">Aplicar Desconto</Label>
                    </div>

                    {productForm.hasDiscount && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="discountPercentage">Desconto (%)</Label>
                          <Input
                            id="discountPercentage"
                            type="number"
                            min="1"
                            max="50"
                            value={productForm.discountPercentage}
                            onChange={(e) => setProductForm(prev => ({ ...prev, discountPercentage: parseInt(e.target.value) || 0 }))}
                            placeholder="10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Preço com Desconto</Label>
                          <div className="p-2 bg-muted rounded-md">
                            <span className="text-sm text-muted-foreground line-through">R$ {productForm.price}</span>
                            <span className="ml-2 font-medium text-primary">R$ {calculateDiscountedPrice()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[100px]"
                      placeholder="Descrição automática baseada na categoria..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Descrição automática gerada para {productForm.category}. Edite conforme necessário.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>URLs das Imagens</Label>
                      {productForm.images.map((image, index) => (
                        <div key={`img-${index}-${productForm.images.length}`} className="flex gap-2">
                          <Input
                            value={image}
                            onChange={(e) => {
                              const newImages = [...productForm.images];
                              newImages[index] = e.target.value;
                              setProductForm(prev => ({ ...prev, images: newImages }));
                            }}
                            placeholder={`URL da imagem ${index + 1}`}
                          />
                          {productForm.images.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setProductForm(prev => {
                                  const newImages = prev.images.filter((_, i) => i !== index);
                                  const newMainIndex = index <= prev.mainImageIndex ?
                                    Math.max(0, prev.mainImageIndex - 1) :
                                    prev.mainImageIndex;
                                  return {
                                    ...prev,
                                    images: newImages,
                                    mainImageIndex: Math.min(newMainIndex, newImages.length - 1)
                                  };
                                });
                              }}
                            >
                              Remover
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setProductForm(prev => ({ ...prev, images: [...prev.images, ''] }))}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Imagem
                      </Button>
                    </div>

                    {productForm.images.length > 1 && (
                      <div className="space-y-2">
                        <Label>Imagem Principal</Label>
                        <Select
                          value={productForm.mainImageIndex.toString()}
                          onValueChange={(value) => {
                            const newIndex = parseInt(value);
                            if (!isNaN(newIndex)) {
                              setProductForm(prev => ({ ...prev, mainImageIndex: newIndex }));
                            }
                          }}
                        >
                          <SelectTrigger className="border border-gray-300">
                            <SelectValue placeholder="Selecione a imagem principal" />
                          </SelectTrigger>
                          <SelectContent>
                            {productForm.images.map((_, index) => (
                              <SelectItem key={`main-img-${index}`} value={index.toString()}>
                                Imagem {index + 1} {index === 0 ? '(primeira)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Esta imagem aparecerá nos cards de produto e como destaque na página de detalhes.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="youtubeVideo">Vídeo do YouTube (Opcional)</Label>
                      <Input
                        id="youtubeVideo"
                        value={productForm.youtubeVideoId}
                        onChange={(e) => setProductForm(prev => ({ ...prev, youtubeVideoId: e.target.value }))}
                        placeholder="ID do vídeo do YouTube (ex: dQw4w9WgXcQ)"
                      />
                      <p className="text-xs text-muted-foreground">
                        Cole apenas o ID do vídeo. Exemplo: se a URL for youtube.com/watch?v=abc123, use apenas "abc123".
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsCreateModalOpen(false);
                      resetForm();
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProduct}>
                      Criar Produto
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isEditModalOpen}
              onOpenChange={(open) => {
                setIsEditModalOpen(open);
                if (!open) {
                  resetForm();
                  setEditingProduct(null);
                }
              }}
            >
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Produto</DialogTitle>
                  <DialogDescription>
                    Modifique as informações do produto
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Nome do Produto</Label>
                      <Input
                        id="edit-name"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Skin Guerreiro Medieval"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Categoria</Label>
                      <Select value={productForm.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="border border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(['Skins', 'Worlds', 'Add-ons', 'Textures', 'Mods'] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => {
                                const descriptions = {
                                  'Skins': 'Pack de skins de alta qualidade para transformar o visual do seu Minecraft.',
                                  'Worlds': 'Mundo personalizado com construções únicas e aventuras incríveis.',
                                  'Add-ons': 'Addon que adiciona novas funcionalidades e mecânicas ao jogo.',
                                  'Textures': 'Pack de texturas de alta qualidade para transformar o visual do seu Minecraft.',
                                  'Mods': 'Modificação que adiciona novos conteúdos e funcionalidades ao jogo.'
                                };
                                setProductForm({
                                  ...productForm,
                                  category: cat,
                                  description: descriptions[cat as keyof typeof descriptions] || productForm.description
                                });
                              }}
                              className={`category-button px-4 py-2 rounded-lg transition-colors border-2 ${
                                productForm.category === cat
                                  ? 'bg-primary text-primary-foreground border-primary active'
                                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border'
                              }`}
                              aria-pressed={productForm.category === cat}
                              data-state={productForm.category === cat ? 'on' : 'off'}
                            >
                              {cat}
                            </button>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-fileType">Tipo de Arquivo</Label>
                      <Select value={productForm.fileType} onValueChange={(value) => setProductForm(prev => ({ ...prev, fileType: value }))}>
                        <SelectTrigger className="border border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryTemplates[productForm.category as keyof typeof categoryTemplates]?.fileTypes?.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          )) || []}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Preço (R$)</Label>
                      <Input
                        id="edit-price"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="9,99"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-discount"
                        checked={productForm.hasDiscount}
                        onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, hasDiscount: checked }))}
                      />
                      <Label htmlFor="edit-discount">Aplicar Desconto</Label>
                    </div>

                    {productForm.hasDiscount && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-discountPercentage">Desconto (%)</Label>
                          <Input
                            id="edit-discountPercentage"
                            type="number"
                            min="1"
                            max="50"
                            value={productForm.discountPercentage}
                            onChange={(e) => setProductForm(prev => ({ ...prev, discountPercentage: parseInt(e.target.value) || 0 }))}
                            placeholder="10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Preço com Desconto</Label>
                          <div className="p-2 bg-muted rounded-md">
                            <span className="text-sm text-muted-foreground line-through">R$ {productForm.price}</span>
                            <span className="ml-2 font-medium text-primary">R$ {calculateDiscountedPrice()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Descrição</Label>
                    <Textarea
                      id="edit-description"
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[100px]"
                      placeholder="Descrição do produto..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-images">URLs das Imagens</Label>
                      {productForm.images.map((image, index) => (
                        <div key={`edit-img-${index}-${productForm.images.length}`} className="flex gap-2">
                          <Input
                            value={image}
                            onChange={(e) => {
                              const newImages = [...productForm.images];
                              newImages[index] = e.target.value;
                              setProductForm(prev => ({ ...prev, images: newImages }));
                            }}
                            placeholder={`URL da imagem ${index + 1}`}
                          />
                          {productForm.images.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setProductForm(prev => {
                                  const newImages = prev.images.filter((_, i) => i !== index);
                                  const newMainIndex = index <= prev.mainImageIndex ?
                                    Math.max(0, prev.mainImageIndex - 1) :
                                    prev.mainImageIndex;
                                  return {
                                    ...prev,
                                    images: newImages,
                                    mainImageIndex: Math.min(newMainIndex, newImages.length - 1)
                                  };
                                });
                              }}
                            >
                              Remover
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setProductForm(prev => ({ ...prev, images: [...prev.images, ''] }))}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Imagem
                      </Button>
                    </div>

                    {productForm.images.length > 1 && (
                      <div className="space-y-2">
                        <Label htmlFor="edit-mainImage">Imagem Principal</Label>
                        <Select
                          value={productForm.mainImageIndex.toString()}
                          onValueChange={(value) => setProductForm(prev => ({ ...prev, mainImageIndex: parseInt(value) }))}
                        >
                          <SelectTrigger className="border border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {productForm.images.map((_, index) => (
                              <SelectItem key={`edit-main-img-${index}`} value={index.toString()}>
                                Imagem {index + 1} {index === 0 ? '(primeira)' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Esta imagem aparecerá nos cards de produto e como destaque na página de detalhes.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="edit-youtubeVideo">Vídeo do YouTube (Opcional)</Label>
                      <Input
                        id="edit-youtubeVideo"
                        value={productForm.youtubeVideoId}
                        onChange={(e) => setProductForm(prev => ({ ...prev, youtubeVideoId: e.target.value }))}
                        placeholder="ID do vídeo do YouTube (ex: dQw4w9WgXcQ)"
                      />
                      <p className="text-xs text-muted-foreground">
                        Cole apenas o ID do vídeo. Exemplo: se a URL for youtube.com/watch?v=abc123, use apenas "abc123".
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsEditModalOpen(false);
                      resetForm();
                      setEditingProduct(null);
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveProduct}>
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Produtos Aguardando Aprovação</CardTitle>
              <CardDescription>Revise e aprove ou rejeite novos produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.images[product.mainImageIndex || 0] || product.images[0] || '/placeholder.png'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{product.price}</span>
                      <Badge variant="outline">Pendente</Badge>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveProduct(product.id)}
                          disabled={approveProductMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white border border-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {approveProductMutation.isPending ? 'Aprovando...' : 'Aprovar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectProduct(product.id)}
                          disabled={rejectProductMutation.isPending}
                          className="border border-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {rejectProductMutation.isPending ? 'Rejeitando...' : 'Rejeitar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Produtos Publicados</CardTitle>
              <CardDescription>Gerencie todos os produtos ativos e inativos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.images[product.mainImageIndex || 0] || product.images[0] || '/placeholder.png'}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{product.price}</span>
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Loja</CardTitle>
              <CardDescription>Configure templates e preferências</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Templates de Categoria</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configurações automáticas aplicadas quando uma categoria é selecionada
                  </p>

                  <div className="grid gap-4">
                    {Object.entries(categoryTemplates).map(([category, template]) => (
                      <div key={category} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium capitalize">{category}</h5>
                          <Badge variant="outline">{template.fileTypes.join(', ')}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{template.defaultDescription}</p>
                        <p className="text-xs text-muted-foreground">
                          Preço sugerido: R$ {template.priceRange.min.toFixed(2).replace('.', ',')} - R$ {template.priceRange.max.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}