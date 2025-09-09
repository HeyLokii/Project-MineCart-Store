import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Removido Select - usando botões para evitar problemas DOM
import { Switch } from '@/components/ui/switch';
import { Package, Users, DollarSign, TrendingUp, Calendar, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { Product, InsertProduct } from '@shared/schema';

// Importando o novo componente do painel de administração
import AdminDashboardComplete from './AdminDashboardComplete';

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  description: string;
  fileType: string;
  hasDiscount: boolean;
  discountPercentage: number;
  images: string[];
  mainImageIndex: number;
  youtubeVideoId: string;
  compatibility: string[];
  features: string[];
}

const categoryTemplates = {
  'skins': {
    fileTypes: ['.zip', '.rar', '.mcpack'],
    description: 'Skin exclusiva para Minecraft com design único e detalhado.',
    suggestedPrice: '4,99'
  },
  'worlds': {
    fileTypes: ['.mcworld', '.zip', '.rar'],
    description: 'Mundo customizado para Minecraft com estruturas e aventuras incríveis.',
    suggestedPrice: '9,99'
  },
  'addons': {
    fileTypes: ['.mcaddon', '.zip', '.rar'],
    description: 'Add-on funcional que adiciona novos recursos e mecânicas ao jogo.',
    suggestedPrice: '7,99'
  },
  'textures': {
    fileTypes: ['.mcpack', '.zip', '.rar'],
    description: 'Pack de texturas de alta qualidade para transformar o visual do seu Minecraft.',
    suggestedPrice: '6,99'
  },
  'mods': {
    fileTypes: ['.zip', '.rar', '.mcaddon'],
    description: 'Modificação que adiciona novos conteúdos e funcionalidades ao Minecraft.',
    suggestedPrice: '12,99'
  }
} as const;

export default function AdminDashboardSafe() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'skins',
    price: '4,99',
    description: '',
    fileType: '.png',
    hasDiscount: false,
    discountPercentage: 10,
    images: [],
    mainImageIndex: 0,
    youtubeVideoId: '',
    compatibility: ['Minecraft 1.20+'],
    features: ['Premium Quality']
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [productFile, setProductFile] = useState<{
    url: string;
    filename: string;
    originalName: string;
    size: string;
    type: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products']
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Erro ao criar produto');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      handleCloseModal();
      toast({ title: 'Produto criado com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao criar produto', description: error.message, variant: 'destructive' });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<Product> }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro ao atualizar produto');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      handleCloseModal();
      toast({ title: 'Produto atualizado com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar produto', description: error.message, variant: 'destructive' });
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/product-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro no upload do arquivo');
      }

      const result = await response.json();
      setProductFile(result);
      toast({ title: 'Arquivo enviado com sucesso!' });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({ 
        title: 'Erro no upload', 
        description: 'Falha ao enviar o arquivo', 
        variant: 'destructive' 
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'skins',
      price: '4,99',
      description: '',
      fileType: '.png',
      hasDiscount: false,
      discountPercentage: 10,
      images: [],
      mainImageIndex: 0,
      youtubeVideoId: '',
      compatibility: ['Minecraft 1.20+'],
      features: ['Premium Quality']
    });
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        fileType: product.fileType || '.png',
        hasDiscount: (product.discount || 0) > 0,
        discountPercentage: product.discount || 10,
        images: product.images.length > 0 ? product.images : [''],
        mainImageIndex: product.mainImageIndex || 0,
        youtubeVideoId: product.youtubeVideoId || '',
        compatibility: product.compatibility || ['Minecraft 1.20+'],
        features: product.features || ['Premium Quality']
      });
    } else {
      setEditingProduct(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setProductFile(null);
    resetForm();
  };

  const updateFormByCategory = (category: string) => {
    const template = categoryTemplates[category as keyof typeof categoryTemplates];
    if (template) {
      setFormData(prev => ({
        ...prev,
        category,
        price: template.suggestedPrice,
        description: template.description,
        fileType: template.fileTypes[0]
      }));
    }
  };

  const calculateDiscountedPrice = () => {
    if (!formData.hasDiscount || !formData.discountPercentage || !formData.price) return formData.price;
    const price = parseFloat(formData.price.replace(',', '.'));
    return price.toFixed(2);
  };

  const handleImageChangeByIndex = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const handleAddNewImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleRemoveImageByIndex = (index: number) => {
    if (formData.images.length <= 1) return;

    const newImages = formData.images.filter((_, i) => i !== index);
    const newMainIndex = formData.mainImageIndex >= index ? 
      Math.max(0, formData.mainImageIndex - 1) : formData.mainImageIndex;

    setFormData(prev => ({
      ...prev,
      images: newImages,
      mainImageIndex: newMainIndex
    }));
  };

  const handleSaveProduct = () => {
    // Validação básica
    if (!formData.name.trim()) {
      toast({ title: 'Erro', description: 'Nome do produto é obrigatório', variant: 'destructive' });
      return;
    }

    if (!formData.category) {
      toast({ title: 'Erro', description: 'Selecione uma categoria', variant: 'destructive' });
      return;
    }

    if (!formData.price || parseFloat(formData.price.replace(',', '.')) <= 0) {
      toast({ title: 'Erro', description: 'Preço deve ser maior que zero', variant: 'destructive' });
      return;
    }

    const cleanImages = formData.images.filter(img => img.trim() !== '');
    if (cleanImages.length === 0) {
      toast({ title: 'Erro', description: 'Adicione pelo menos uma imagem', variant: 'destructive' });
      return;
    }

    if (!editingProduct && !productFile) {
      toast({ title: 'Erro', description: 'Faça upload do arquivo do produto', variant: 'destructive' });
      return;
    }

    const originalPrice = parseFloat(formData.price.replace(',', '.'));
    const discountPercentage = formData.hasDiscount ? Math.min(formData.discountPercentage, 100) : 0;

    // Se tem desconto, o preço informado é o preço ORIGINAL
    // Calculamos o preço final aplicando o desconto
    let finalPrice = originalPrice;

    if (formData.hasDiscount && discountPercentage > 0) {
      // Aplicar desconto ao preço original
      finalPrice = originalPrice * (1 - discountPercentage / 100);
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      price: finalPrice.toFixed(2),
      originalPrice: formData.hasDiscount ? originalPrice.toFixed(2) : null,
      discount: Math.round(discountPercentage),
      description: formData.description.trim() || 'Descrição do produto',
      images: cleanImages,
      mainImageIndex: Math.min(formData.mainImageIndex, cleanImages.length - 1),
      youtubeVideoId: formData.youtubeVideoId?.trim() || '',
      modelUrl: '',
      downloadUrl: productFile?.url || editingProduct?.downloadUrl || '#',
      fileName: productFile?.originalName || editingProduct?.fileName || '',
      fileSize: productFile?.size || editingProduct?.fileSize || '1.2 MB',
      fileType: productFile?.type || formData.fileType || '.zip',
      compatibility: formData.compatibility.filter(c => c.trim() !== ''),
      features: formData.features.filter(f => f.trim() !== ''),
      tags: [formData.category],
      isFeatured: false,
      sellerId: 1
    };

    // console.log('Dados do produto:', productData); // Debug removido

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  // Auto-configuração baseada na categoria
  useEffect(() => {
    if (!editingProduct) {
      updateFormByCategory(formData.category);
    }
  }, [formData.category, editingProduct]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

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
                        <span className="font-medium">R$ {parseFloat(product.price || '0').toFixed(2)}</span>
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
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>Configure as opções administrativas</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Aqui será inserido o painel de configurações completo */}
              <AdminDashboardComplete />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Seguro para Produtos */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Modifique as informações do produto.' : 'Preencha os dados para criar um novo produto.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 p-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Produto</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do produto..."
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['skins', 'worlds', 'addons', 'textures', 'mods'].map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={formData.category === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, category }))}
                    >
                      {category === 'skins' && 'Skins'}
                      {category === 'worlds' && 'Worlds'}
                      {category === 'addons' && 'Add-ons'}
                      {category === 'textures' && 'Textures'}
                      {category === 'mods' && 'Mods'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Arquivo</Label>
                <div className="flex gap-2 flex-wrap">
                  {(categoryTemplates[formData.category as keyof typeof categoryTemplates]?.fileTypes || []).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.fileType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, fileType: type }))}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{formData.hasDiscount ? 'Preço Original (R$)' : 'Preço (R$)'}</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="9,99"
                />
                {formData.hasDiscount && (
                  <p className="text-xs text-muted-foreground">
                    Digite o preço original. O desconto será aplicado automaticamente.
                  </p>
                )}
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
                      max="100"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: Math.min(parseInt(e.target.value) || 0, 100) }))}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preview do Preço</Label>
                    <div className="p-2 bg-muted rounded-md">
                      {formData.hasDiscount && formData.discountPercentage > 0 && formData.price ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {parseFloat(formData.price.replace(',', '.')).toFixed(2)}
                          </span>
                          <span className="ml-2 font-medium text-primary">
                            {formData.discountPercentage === 100 ? 
                              'GRÁTIS' : 
                              `R$ ${(parseFloat(formData.price.replace(',', '.')) * (1 - formData.discountPercentage / 100)).toFixed(2)}`
                            }
                          </span>
                          <Badge variant="destructive" className="ml-2 text-xs">
                            -{formData.discountPercentage}%
                          </Badge>
                        </>
                      ) : (
                        <span className="font-medium">R$ {formData.price}</span>
                      )}
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
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload das Imagens</Label>
                <p className="text-xs text-muted-foreground">
                  Adicione as imagens que serão exibidas na página do produto. Primeira imagem será a principal.
                </p>

                <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="product-images-upload"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);

                      if (files.length === 0) return;

                      // Validate file types
                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

                      if (invalidFiles.length > 0) {
                        toast({
                          title: "Tipo de arquivo inválido",
                          description: "Apenas imagens JPG, PNG, GIF e WEBP são permitidas.",
                          variant: "destructive",
                        });
                        e.target.value = '';
                        return;
                      }

                      // Validate file sizes (10MB max each)
                      const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
                      if (oversizedFiles.length > 0) {
                        toast({
                          title: "Arquivos muito grandes",
                          description: "Algumas imagens excedem 10MB e foram ignoradas.",
                          variant: "destructive",
                        });
                      }

                      const validFiles = files.filter(file => 
                        file.size <= 10 * 1024 * 1024 && allowedTypes.includes(file.type)
                      );

                      if (validFiles.length === 0) {
                        e.target.value = '';
                        return;
                      }

                      try {
                        toast({
                          title: "Fazendo upload das imagens...",
                          description: `Carregando ${validFiles.length} imagem(ns)...`,
                        });

                        const uploadPromises = validFiles.map(async (file) => {
                          const formDataUpload = new FormData();
                          formDataUpload.append('image', file);

                          const response = await fetch('/api/upload/product-image', {
                            method: 'POST',
                            body: formDataUpload,
                          });

                          if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.message || 'Upload failed');
                          }

                          const result = await response.json();
                          return result.url;
                        });

                        const uploadedUrls = await Promise.all(uploadPromises);
                        setFormData(prev => ({ 
                          ...prev, 
                          images: [...prev.images, ...uploadedUrls] 
                        }));

                        toast({
                          title: "Imagens carregadas!",
                          description: `${uploadedUrls.length} imagem(ns) carregada(s) com sucesso.`,
                        });
                      } catch (error: any) {
                        toast({
                          title: "Erro no upload das imagens",
                          description: error.message || "Falha ao carregar algumas imagens.",
                          variant: "destructive",
                        });
                      } finally {
                        e.target.value = '';
                      }
                    }}
                  />
                  <label htmlFor="product-images-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="mx-auto h-12 w-12 text-blue-400">
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-primary">Clique para adicionar imagens</span> ou arraste arquivos
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPG, PNG, GIF, WEBP (máx. 10MB cada) • Máximo 5 imagens
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Preview das imagens carregadas */}
                {formData.images.length > 0 && formData.images.some(img => img.trim() !== '') && (
                  <div className="space-y-2">
                    <Label>Imagens Carregadas ({formData.images.filter(img => img.trim() !== '').length})</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {formData.images.filter(img => img.trim() !== '').map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-24 object-cover rounded border"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImageByIndex(index)}
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </Button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {formData.images.filter(img => img.trim() !== '').length > 1 && (
                <div className="space-y-2">
                  <Label>Imagem Principal</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.filter(img => img.trim() !== '').map((_, index) => (
                      <Button
                        key={`main-btn-${index}`}
                        type="button"
                        variant={formData.mainImageIndex === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, mainImageIndex: index }))}
                      >
                        Imagem {index + 1} {index === 0 ? '(primeira)' : ''}
                      </Button>
                    ))}
                  </div>
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
                  placeholder="ID do vídeo do YouTube"
                />
              </div>

              {/* Campos de Compatibilidade */}
              <div className="space-y-2">
                <Label>Compatibilidade</Label>
                <div className="space-y-2">
                  {formData.compatibility.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newCompatibility = [...formData.compatibility];
                          newCompatibility[index] = e.target.value;
                          setFormData(prev => ({ ...prev, compatibility: newCompatibility }));
                        }}
                        placeholder="Ex: Minecraft 1.20+"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newCompatibility = formData.compatibility.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, compatibility: newCompatibility }));
                        }}
                        disabled={formData.compatibility.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, compatibility: [...prev.compatibility, ''] }));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Compatibilidade
                  </Button>
                </div>
              </div>

              {/* Campos de Características */}
              <div className="space-y-2">
                <Label>Características</Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData(prev => ({ ...prev, features: newFeatures }));
                        }}
                        placeholder="Ex: Premium Quality"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newFeatures = formData.features.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, features: newFeatures }));
                        }}
                        disabled={formData.features.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Característica
                  </Button>
                </div>
              </div>

              {/* Campo de Upload do Arquivo do Produto */}
              <div className="space-y-3">
                <Label>Arquivo do Produto *</Label>
                {!editingProduct && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".zip,.rar,.mcaddon,.mcpack,.mcworld,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden"
                      id="product-file-upload"
                    />
                    <label 
                      htmlFor="product-file-upload" 
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div className="text-sm">
                        <span className="font-medium text-primary">Clique para fazer upload</span>
                        <span className="text-muted-foreground"> ou arraste e solte</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ZIP, RAR, MCADDON, MCPACK, MCWORLD (máx. 100MB)
                      </p>
                    </label>
                  </div>
                )}

                {productFile && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">
                            {productFile.originalName}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {productFile.size} • {productFile.type}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Pronto
                      </Badge>
                    </div>
                  </div>
                )}

                {editingProduct && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Arquivo atual:</strong> {editingProduct.fileName || 'Arquivo existente'}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Faça upload de um novo arquivo apenas se desejar substituir o arquivo atual.
                    </p>
                  </div>
                )}

                {uploadingFile && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Fazendo upload do arquivo...
                      </p>
                    </div>
                  </div>
                )}
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