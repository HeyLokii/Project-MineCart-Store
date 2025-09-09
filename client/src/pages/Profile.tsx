import { useState, useEffect, useId, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Mail, Calendar, Upload, Loader2, Bell, Package, Heart, Star, Download, ExternalLink, Info, CheckCircle, Camera, Globe, Youtube, Twitter, Instagram, CameraOff, Save, X, Edit, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpdateUserMutation } from '@/hooks/useUpdateUserMutation'; // Assumindo que esta mutation existe

export default function Profile() {
  const { user, userProfile, syncUserAvatar } = useAuth();
  const { toast } = useToast();
  const { favorites } = useFavorites();
  const { data: products } = useProducts();
  const uniqueId = useId();
  const avatarInputRef = useRef<HTMLInputElement>(null); // Ref para o input de arquivo do avatar

  // TEMPORÁRIO: Acesso liberado para análise da IA
  console.log('PROFILE - User:', user);
  console.log('PROFILE - UserProfile:', userProfile);
  console.log('PROFILE - Favorites data:', favorites);
  console.log('PROFILE - Products data:', products);

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Estado para o upload do avatar

  // Estado para os dados do usuário, permitindo a atualização do avatar sem recarregar tudo
  const [userData, setUserData] = useState(userProfile || user);

  // Atualiza o estado userData quando o userProfile ou user muda
  useEffect(() => {
    setUserData(userProfile || user);
  }, [userProfile, user]);

  // Inicializa o formulário de edição com os dados do usuário
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    youtubeUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    avatarUrl: '' // Será preenchido com a URL do avatar atual
  });

  // Atualiza o formulário de edição quando userData muda (ou userProfile/user inicialmente)
  useEffect(() => {
    if (userData) {
      setEditForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        displayName: userData.displayName || user.displayName || '',
        email: userData.email || user.email || '',
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
        youtubeUrl: userData.youtubeUrl || '',
        twitterUrl: userData.twitterUrl || '',
        instagramUrl: userData.instagramUrl || '',
        avatarUrl: userData.photoURL || user.photoURL || ''
      });
    }
  }, [userData, user]); // Adicionado 'user' como dependência para garantir que o email/displayName do user seja capturado

  // Mutation para atualizar o usuário
  const updateUserMutation = useUpdateUserMutation();

  // Buscar dados reais de compras da API
  const { data: userOrders = [] } = useQuery({
    queryKey: ['/api/orders/user', userData?.id], // Usa userData?.id para buscar os pedidos do usuário logado
    enabled: !!userData?.id // Habilita a query apenas se o ID do usuário estiver disponível
  });

  // Mapear favoritos com produtos reais da API
  const favoriteProducts = favorites
    .map(favorite => {
      const product = products?.find(p => p.id === favorite.productId);
      return product;
    })
    .filter(Boolean); // Remove quaisquer entradas nulas ou indefinidas

  const accountStats = {
    totalPurchases: userOrders.length,
    totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalDownloads: userOrders.reduce((sum, order) => sum + (order.downloadCount || 1), 0),
    memberSince: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('pt-BR') : "N/A"
  };

  const handleSaveProfile = async () => {
    try {
      if (!userData?.id) {
        toast({
          title: "Erro",
          description: "ID do usuário não encontrado.",
          variant: "destructive",
        });
        return;
      }

      // Envia apenas os campos que podem ser editados
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        displayName: editForm.displayName,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
        youtubeUrl: editForm.youtubeUrl,
        twitterUrl: editForm.twitterUrl,
        instagramUrl: editForm.instagramUrl,
        // avatarUrl não é atualizado diretamente aqui, mas sim pelo handleAvatarUpload
      };

      await updateUserMutation.mutateAsync({
        id: userData.id,
        ...payload
      });

      setIsEditing(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadProduct = (productId: number) => {
    console.log('Downloading product:', productId);
    toast({
      title: "Download iniciado",
      description: "O download do produto foi iniciado.",
    });
    // TODO: Implementar lógica de download real aqui
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações aprimoradas
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const minDimension = 100; // Mínimo 100x100 pixels

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Formato não suportado",
        description: "Use apenas arquivos JPG, PNG, GIF ou WebP.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      toast({
        title: "Arquivo muito grande",
        description: `Arquivo tem ${sizeMB}MB. Tamanho máximo permitido: 5MB.`,
        variant: "destructive"
      });
      return;
    }

    // Verificar dimensões da imagem
    const img = new Image();
    const checkDimensions = new Promise<boolean>((resolve) => {
      img.onload = () => {
        if (img.width < minDimension || img.height < minDimension) {
          toast({
            title: "Resolução muito baixa",
            description: `Dimensões mínimas: ${minDimension}x${minDimension} pixels. Sua imagem: ${img.width}x${img.height}`,
            variant: "destructive"
          });
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => resolve(false);
    });

    img.src = URL.createObjectURL(file);

    const isValidDimensions = await checkDimensions;
    if (!isValidDimensions) {
      URL.revokeObjectURL(img.src);
      return;
    }

    setIsUploading(true);

    // Mostrar preview imediato
    const previewUrl = URL.createObjectURL(file);
    setUserData(prev => prev ? { ...prev, photoURL: previewUrl } : null);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Limpar o preview temporário
        URL.revokeObjectURL(previewUrl);

        // Atualizar com a URL real do servidor
        setUserData(prev => prev ? { ...prev, photoURL: data.url } : null);

        // Sincronizar avatar em toda aplicação
        await syncUserAvatar(data.url);
        
        // Forçar re-render do header e outros componentes
        window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: { url: data.url } }));

        // Atualizar no banco de dados
        if (userData?.id) { // Usa userData?.id aqui também
          await updateUserMutation.mutateAsync({
            id: userData.id,
            photoURL: data.url
          });
        }

        toast({
          title: "Avatar atualizado! ✨",
          description: data.message || "Sua foto de perfil foi atualizada com sucesso!",
        });
      } else {
        // Reverter o preview em caso de erro
        URL.revokeObjectURL(previewUrl);
        setUserData(prev => prev ? { ...prev, photoURL: user?.photoURL || null } : null); // Reverte para a URL original do user

        toast({
          title: "Erro no upload",
          description: data.message || "Não foi possível fazer upload do avatar",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Reverter o preview em caso de erro
      URL.revokeObjectURL(previewUrl);
      setUserData(prev => prev ? { ...prev, photoURL: user?.photoURL || null } : null); // Reverte para a URL original do user

      console.error('Erro no upload:', error);
      toast({
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Limpar o input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Se o usuário não estiver logado, exibe uma mensagem de acesso restrito
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-8">Você precisa estar logado para acessar seu perfil.</p>
          <Button>Fazer Login</Button> {/* Botão de login ainda precisa ser implementado */}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e histórico de compras</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar do Perfil */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 transition-all duration-300 group-hover:scale-105">
                      <AvatarImage src={userData?.photoURL || editForm.avatarUrl || user.photoURL} alt={user.displayName} />
                      <AvatarFallback className="text-2xl">
                        {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isUploading && (
                      <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    style={{ display: 'none' }}
                  />

                  <Button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploading}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 px-3"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Camera className="h-3 w-3 mr-1" />
                        Editar Foto
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{userData?.displayName || user.displayName || 'Usuário'}</h3>
                  {userData?.firstName && userData?.lastName && (
                    <p className="text-sm text-muted-foreground">{userData.firstName} {userData.lastName}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{userData?.email || user.email}</p>
                  <p className="text-xs text-muted-foreground font-mono">ID: {userData?.uniqueId || userData?.id || user.uid}</p>
                  <Badge className="mt-2 capitalize">{userData?.role || 'user'}</Badge>
                </div>

                <div className="w-full space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Membro desde:</span>
                    {/* Garante que memberSince é uma data válida antes de formatar */}
                    <span>{accountStats.memberSince !== "N/A" ? new Date(accountStats.memberSince).toLocaleDateString('pt-BR') : accountStats.memberSince}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Compras:</span>
                    <span>{accountStats.totalPurchases}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Gasto total:</span>
                    <span>R$ {accountStats.totalSpent.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="purchases">Compras</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Estatísticas Rápidas */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Package className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{accountStats.totalPurchases}</p>
                        <p className="text-sm text-muted-foreground">Produtos Comprados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Download className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{accountStats.totalDownloads}</p>
                        <p className="text-sm text-muted-foreground">Downloads Realizados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">R$ {accountStats.totalSpent.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Total Gasto</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Compras Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Compras Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma compra realizada ainda</p>
                        <p className="text-sm">Explore nossos produtos e faça sua primeira compra!</p>
                      </div>
                    ) : (
                      userOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Pedido #{order.id}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">R$ {order.totalAmount.toFixed(2)}</span>
                            <Button size="sm" onClick={() => handleDownloadProduct(order.id)}>
                              <Download className="h-4 w-4 mr-1" />
                              Baixar
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Compras</CardTitle>
                  <CardDescription>Todos os seus produtos adquiridos</CardDescription>
                </CardHeader>
                <CardContent>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Nenhuma compra realizada</h3>
                      <p className="text-sm mb-4">Você ainda não fez nenhuma compra na nossa loja.</p>
                      <p className="text-sm">Explore nossos produtos e faça sua primeira compra!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Pedido #{order.id}</h4>
                              <Badge variant="outline" className="capitalize">{order.status}</Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Comprado em: {new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                              <span>Downloads: {order.downloadCount || 1}</span>
                              <Badge className={order.status === 'completed' ? 'bg-primary' : 'bg-accent'}>
                                {order.status === 'completed' ? 'Concluída' : 'Pendente'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-bold text-lg">R$ {order.totalAmount.toFixed(2)}</span>
                            <Button size="sm" onClick={() => handleDownloadProduct(order.id)}>
                              <Download className="h-4 w-4 mr-1" />
                              Baixar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Favoritos</CardTitle>
                  <CardDescription>Produtos que você marcou como favoritos</CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
                      <p className="text-muted-foreground">Comece a favoritar produtos para vê-los aqui!</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Informações Pessoais
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Ao cancelar a edição, restaura os valores originais do editForm
                        if (isEditing) {
                          setEditForm(prev => ({
                            ...prev,
                            firstName: userData?.firstName || '',
                            lastName: userData?.lastName || '',
                            displayName: userData?.displayName || user.displayName || '',
                            bio: userData?.bio || '',
                            location: userData?.location || '',
                            website: userData?.website || '',
                            youtubeUrl: userData?.youtubeUrl || '',
                            twitterUrl: userData?.twitterUrl || '',
                            instagramUrl: userData?.instagramUrl || ''
                          }));
                        }
                        setIsEditing(!isEditing);
                      }}
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      {isEditing ? 'Cancelar' : 'Editar'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Avatar Upload Section */}
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative group">
                        <Avatar className="w-32 h-32 border-4 border-primary/20 transition-all duration-300 group-hover:border-primary/40">
                          <AvatarImage
                            src={editForm.avatarUrl || user.photoURL}
                            alt="Avatar do usuário"
                            className="transition-all duration-300 group-hover:scale-105"
                          />
                          <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/70">
                            {editForm.firstName ? editForm.firstName[0].toUpperCase() :
                             user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {isUploading && (
                          <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center space-y-3">
                        <input
                          type="file"
                          ref={avatarInputRef}
                          onChange={handleAvatarUpload}
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          style={{ display: 'none' }}
                        />
                        <Button
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={isUploading}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2 hover:bg-primary/10 transition-colors"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Enviando...</span>
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4" />
                              <span>Alterar Foto</span>
                            </>
                          )}
                        </Button>

                        {/* Requisitos da imagem */}
                        <div className="bg-muted/50 rounded-lg p-4 max-w-sm">
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            Requisitos da Imagem
                          </h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                              Formatos: JPG, PNG, GIF, WebP
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                              Tamanho máximo: 5MB
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                              Dimensões mínimas: 100x100px
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                              A imagem será otimizada automaticamente
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`firstName-${uniqueId}`} className="text-foreground">Nome</Label>
                        <Input
                          id={`firstName-${uniqueId}`}
                          value={editForm.firstName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-input border-border text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`lastName-${uniqueId}`} className="text-foreground">Sobrenome</Label>
                        <Input
                          id={`lastName-${uniqueId}`}
                          value={editForm.lastName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-input border-border text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`displayName-${uniqueId}`} className="text-foreground">Nome de Usuário</Label>
                        <Input
                          id={`displayName-${uniqueId}`}
                          value={editForm.displayName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                          disabled={!isEditing}
                          className="bg-input border-border text-foreground"
                        />
                        <p className="text-xs text-muted-foreground">Como outros usuários vão te ver</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`email-${uniqueId}`} className="text-foreground">E-mail</Label>
                        <Input
                          id={`email-${uniqueId}`}
                          value={user.email} // Usa o email do user diretamente, que não pode ser alterado
                          disabled
                          className="bg-muted border-border text-muted-foreground"
                        />
                        <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-foreground">Biografia</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Conte um pouco sobre você..."
                        className="min-h-[100px] bg-input border-border text-foreground"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-foreground">Localização</Label>
                        <Input
                          id="location"
                          value={editForm.location}
                          onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Ex: São Paulo, Brasil"
                          className="bg-input border-border text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-foreground">Website</Label>
                        <Input
                          id="website"
                          value={editForm.website}
                          onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="https://seusite.com"
                          className="bg-input border-border text-foreground"
                        />
                      </div>
                    </div>

                    {/* Redes Sociais */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium text-foreground">Redes Sociais (opcionais)</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Youtube className="h-5 w-5 text-red-500 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <Label htmlFor="youtubeUrl" className="text-sm text-foreground">YouTube</Label>
                            <Input
                              id="youtubeUrl"
                              value={editForm.youtubeUrl}
                              onChange={(e) => setEditForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                              disabled={!isEditing}
                              placeholder="https://youtube.com/@seucanal"
                              className="bg-input border-border text-foreground"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Twitter className="h-5 w-5 text-blue-400 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <Label htmlFor="twitterUrl" className="text-sm text-foreground">Twitter/X</Label>
                            <Input
                              id="twitterUrl"
                              value={editForm.twitterUrl}
                              onChange={(e) => setEditForm(prev => ({ ...prev, twitterUrl: e.target.value }))}
                              disabled={!isEditing}
                              placeholder="https://twitter.com/seuusuario"
                              className="bg-input border-border text-foreground"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Instagram className="h-5 w-5 text-pink-500 flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <Label htmlFor="instagramUrl" className="text-sm text-foreground">Instagram</Label>
                            <Input
                              id="instagramUrl"
                              value={editForm.instagramUrl}
                              onChange={(e) => setEditForm(prev => ({ ...prev, instagramUrl: e.target.value }))}
                              disabled={!isEditing}
                              placeholder="https://instagram.com/seuusuario"
                              className="bg-input border-border text-foreground"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="flex-1 space-y-1">
                            <Label htmlFor="website-social" className="text-sm text-foreground">Site Pessoal</Label>
                            <Input
                              id="website-social"
                              value={editForm.website}
                              onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                              disabled={!isEditing}
                              placeholder="https://seusite.com"
                              className="bg-input border-border text-foreground"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="border-border text-foreground bg-card">
                          Cancelar
                        </Button>
                        <Button onClick={handleSaveProfile} className="bg-primary text-primary-foreground">
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Alterações
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Preferências da Conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Notificações por E-mail</h4>
                        <p className="text-sm text-muted-foreground">Receber notificações sobre novos produtos e promoções</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-border text-foreground">Configurar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Privacidade do Perfil</h4>
                        <p className="text-sm text-muted-foreground">Controlar quem pode ver suas informações</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-border text-foreground">Configurar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Métodos de Pagamento</h4>
                        <p className="text-sm text-muted-foreground">Gerenciar cartões e formas de pagamento</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-border text-foreground">Gerenciar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}