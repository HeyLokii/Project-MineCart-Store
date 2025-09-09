import { useState, useCallback } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';

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

const initialFormData: ProductFormData = {
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
};

const categoryTemplates = {
  skins: {
    fileTypes: ['.png', '.jpg'],
    description: 'Skin personalizada de alta qualidade para Minecraft. Compatible com Java e Bedrock Edition.',
    suggestedPrice: '4.99'
  },
  maps: {
    fileTypes: ['.zip', '.mcworld'],
    description: 'Mapa customizado para aventuras épicas. Inclui estruturas únicas e desafios.',
    suggestedPrice: '9.99'
  },
  mods: {
    fileTypes: ['.jar', '.mcaddon'],
    description: 'Mod que adiciona novas funcionalidades e mecânicas ao jogo.',
    suggestedPrice: '14.99'
  },
  textures: {
    fileTypes: ['.zip', '.mcpack'],
    description: 'Pack de texturas que transforma completamente o visual do seu Minecraft.',
    suggestedPrice: '7.99'
  },
  worlds: {
    fileTypes: ['.zip', '.mcworld'],
    description: 'Mundo completo com construções incríveis e paisagens únicas.',
    suggestedPrice: '12.99'
  }
};

export default function AdminDashboardFixed() {
  const { data: products = [] } = useProducts();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setEditingProduct(null);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    const template = categoryTemplates[category as keyof typeof categoryTemplates];
    setFormData(prev => ({
      ...prev,
      category,
      fileType: template?.fileTypes[0] || '.png',
      description: template?.description || '',
      price: template?.suggestedPrice || ''
    }));
  }, []);

  const calculateDiscountedPrice = useCallback(() => {
    const price = parseFloat(formData.price) || 0;
    const discounted = price * (1 - formData.discountPercentage / 100);
    return discounted.toFixed(2).replace('.', ',');
  }, [formData.price, formData.discountPercentage]);

  const handleOpenModal = useCallback((product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
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
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  }, [resetForm]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
  }, [resetForm]);

  const handleSaveProduct = useCallback(() => {
    if (editingProduct) {
      console.log('Updating product:', editingProduct.id, formData);
    } else {
      console.log('Creating product:', formData);
    }
    handleCloseModal();
  }, [editingProduct, formData, handleCloseModal]);

  const handleImageChange = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  }, []);

  const handleAddImage = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setFormData(prev => {
      if (prev.images.length <= 1) return prev;
      
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
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h2>
          <p className="text-muted-foreground">Gerencie produtos, usuários e configurações da loja</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 0,00</div>
                <p className="text-xs text-muted-foreground">Total de vendas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <div className="ml-2 space-y-1">
                    <p className="text-sm font-medium leading-none">Sistema iniciado</p>
                    <p className="text-sm text-muted-foreground">Aguardando primeiras atividades</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Gerenciar Produtos</h3>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>Gerencie todos os produtos da loja</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum produto cadastrado</p>
                    <p className="text-sm">Crie seu primeiro produto!</p>
                  </div>
                ) : (
                  products.map((product) => (
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
                          onClick={() => handleOpenModal(product)}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
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
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(categoryTemplates).map(([key, template]) => (
                      <div key={key} className="p-4 border rounded-lg">
                        <h5 className="font-medium capitalize mb-2">{key}</h5>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <div className="flex justify-between text-sm">
                          <span>Tipos: {template.fileTypes.join(', ')}</span>
                          <span>Sugerido: R$ {template.suggestedPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal único para criar/editar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Criar Novo Produto'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Modifique as informações do produto' : 'Preencha os dados do novo produto'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Produto</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Skin Guerreiro Medieval"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skins">Skins</SelectItem>
                    <SelectItem value="maps">Mapas</SelectItem>
                    <SelectItem value="mods">Mods</SelectItem>
                    <SelectItem value="textures">Texturas</SelectItem>
                    <SelectItem value="worlds">Mundos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Arquivo</Label>
                <Select value={formData.fileType} onValueChange={(value) => setFormData(prev => ({ ...prev, fileType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryTemplates[formData.category as keyof typeof categoryTemplates]?.fileTypes?.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="9,99"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.hasDiscount}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasDiscount: checked }))}
                />
                <Label>Aplicar Desconto</Label>
              </div>
              
              {formData.hasDiscount && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Desconto (%)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: parseInt(e.target.value) || 0 }))}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço com Desconto</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <span className="text-sm text-muted-foreground line-through">R$ {formData.price}</span>
                      <span className="ml-2 font-medium text-primary">R$ {calculateDiscountedPrice()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
                placeholder="Descrição automática baseada na categoria..."
              />
              <p className="text-xs text-muted-foreground">
                Descrição automática gerada para {formData.category}. Edite conforme necessário.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>URLs das Imagens</Label>
                {formData.images.map((image, index) => (
                  <div key={`image-${index}`} className="flex gap-2">
                    <Input
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`URL da imagem ${index + 1}`}
                    />
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
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
                  onClick={handleAddImage}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Imagem
                </Button>
              </div>

              {formData.images.length > 1 && (
                <div className="space-y-2">
                  <Label>Imagem Principal</Label>
                  <Select 
                    value={formData.mainImageIndex.toString()} 
                    onValueChange={(value) => {
                      const newIndex = parseInt(value);
                      if (!isNaN(newIndex)) {
                        setFormData(prev => ({ ...prev, mainImageIndex: newIndex }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a imagem principal" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.images.map((_, index) => (
                        <SelectItem key={`main-${index}`} value={index.toString()}>
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
                <Label>Vídeo do YouTube (Opcional)</Label>
                <Input
                  value={formData.youtubeVideoId}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeVideoId: e.target.value }))}
                  placeholder="ID do vídeo do YouTube (ex: dQw4w9WgXcQ)"
                />
                <p className="text-xs text-muted-foreground">
                  Cole apenas o ID do vídeo. Exemplo: se a URL for youtube.com/watch?v=abc123, use apenas "abc123".
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProduct}>
                {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}