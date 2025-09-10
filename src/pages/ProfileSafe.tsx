import { useState, useEffect, useId } from 'react';
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
import { User, Mail, Calendar, ShoppingBag, Settings, Edit, Save, Download, Star, Package, CreditCard, Camera, Globe, Youtube, Twitter, Instagram, Github, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  location: string;
  youtubeUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  pixKey: string;
}

export default function ProfileSafe() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const { favorites } = useFavorites();
  const { data: products } = useProducts();
  const uniqueId = useId();

  // Verificar se usuário está logado
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para acessar seu perfil.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    firstName: '',
    lastName: '',
    displayName: '',
    bio: '',
    location: '',
    youtubeUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    pixKey: ''
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Carregar dados do usuário por email se userProfile for null
  const { data: fetchedUserProfile } = useQuery({
    queryKey: ['/api/users/by-email', user?.email],
    enabled: !!user?.email && !userProfile,
  });

  // Usar userProfile do hook ou o fetchado
  const currentUserProfile = userProfile || fetchedUserProfile;

  // Carregar dados do usuário do storage
  const { data: userOrders = [] } = useQuery({
    queryKey: ['/api/orders/user', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const response = await fetch(`/api/orders/user/${user.uid}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!user?.uid
  });

  // Calcular estatísticas
  const favoriteProducts = products?.filter((product: any) => 
    Array.isArray(favorites) && favorites?.some((fav: any) => fav.productId === product.id)
  ) || [];

  const accountStats = {
    totalPurchases: userOrders.length,
    totalDownloads: userOrders.reduce((sum: number, order: any) => sum + (order.downloadCount || 1), 0),
    totalSpent: userOrders.reduce((sum: number, order: any) => sum + (parseFloat(order.amount) || 0), 0)
  };

  // Inicializar formulário quando dados chegarem
  useEffect(() => {
    if (currentUserProfile && !isEditing) {
      setEditForm({
        firstName: currentUserProfile.firstName || '',
        lastName: currentUserProfile.lastName || '',
        displayName: currentUserProfile.displayName || user?.displayName || '',
        bio: currentUserProfile.bio || '',
        location: currentUserProfile.location || '',
        youtubeUrl: currentUserProfile.youtubeUrl || '',
        twitterUrl: currentUserProfile.twitterUrl || '',
        instagramUrl: currentUserProfile.instagramUrl || '',
        pixKey: currentUserProfile.pixKey || ''
      });
    }
  }, [currentUserProfile, user, isEditing]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancelar - restaurar dados originais
      if (currentUserProfile) {
        setEditForm({
          firstName: currentUserProfile.firstName || '',
          lastName: currentUserProfile.lastName || '',
          displayName: currentUserProfile.displayName || user?.displayName || '',
          bio: currentUserProfile.bio || '',
          location: currentUserProfile.location || '',
          youtubeUrl: currentUserProfile.youtubeUrl || '',
          twitterUrl: currentUserProfile.twitterUrl || '',
          instagramUrl: currentUserProfile.instagramUrl || '',
          pixKey: currentUserProfile.pixKey || ''
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      // Usar ID do userProfile ou buscar por email
      let userId = currentUserProfile?.id;

      if (!userId && user?.email) {
        // Buscar usuário por email para obter o ID
        const userResponse = await fetch(`/api/users/by-email/${encodeURIComponent(user.email)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userId = userData.id;
        }
      }

      if (!userId) {
        console.error('ID do usuário não encontrado:', { userProfile, user });
        toast({ 
          title: 'Erro ao salvar perfil', 
          description: 'ID do usuário não encontrado.',
          variant: 'destructive' 
        });
        return;
      }

      console.log('Salvando perfil para usuário ID:', userId, 'dados:', editForm);

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Erro na resposta:', errorData);
        throw new Error('Erro ao salvar perfil');
      }

      // Atualizar dados locais imediatamente
      const updatedUser = await response.json();
      console.log('Usuário atualizado:', updatedUser);

      toast({ title: 'Perfil atualizado com sucesso!' });
      setIsEditing(false);

      // Forçar recarregamento dos dados do usuário
      window.location.reload();
    } catch (error) {
      console.error('Erro completo:', error);
      toast({ 
        title: 'Erro ao salvar perfil', 
        description: 'Tente novamente mais tarde.',
        variant: 'destructive' 
      });
    }
  };

  const handleDownloadProduct = (orderId: number) => {
    toast({ title: 'Download iniciado!', description: 'Seu produto será baixado em breve.' });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground">
            Você precisa estar logado para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  console.log('Debug ProfileSafe - user:', user);
  console.log('Debug ProfileSafe - userProfile:', userProfile);
  console.log('Debug ProfileSafe - fetchedUserProfile:', fetchedUserProfile);
  console.log('Debug ProfileSafe - currentUserProfile:', currentUserProfile);
  console.log('Debug ProfileSafe - currentUserProfile.id:', currentUserProfile?.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header do Perfil */}
        <div className="flex items-center space-x-6 p-6 bg-card rounded-lg border">
          <div className="relative group">
            <Avatar className="w-24 h-24">
              <AvatarImage src={currentUserProfile?.avatarUrl || user.photoURL} />
              <AvatarFallback className="text-2xl">
                {currentUserProfile?.firstName?.[0] || user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 5 * 1024 * 1024) {
                    toast({
                      title: "Arquivo muito grande",
                      description: "A imagem deve ter no máximo 5MB.",
                      variant: "destructive"
                    });
                    return;
                  }

                  if (!file.type.startsWith('image/')) {
                    toast({
                      title: "Tipo inválido",
                      description: "Por favor, selecione uma imagem.",
                      variant: "destructive"
                    });
                    return;
                  }

                  setAvatarFile(file);
                  setIsUploadingAvatar(true);

                  try {
                    const formData = new FormData();
                    formData.append('avatar', file);
                    
                    const response = await fetch('/api/upload/avatar', {
                      method: 'POST',
                      body: formData,
                    });
                    
                    if (!response.ok) {
                      throw new Error('Erro no upload');
                    }
                    
                    const { url } = await response.json();
                    
                    // Atualizar o perfil com a nova URL
                    let userId = currentUserProfile?.id;
                    if (!userId && user?.email) {
                      const userResponse = await fetch(`/api/users/by-email/${encodeURIComponent(user.email)}`);
                      if (userResponse.ok) {
                        const userData = await userResponse.json();
                        userId = userData.id;
                      }
                    }
                    
                    if (userId) {
                      const updateResponse = await fetch(`/api/users/${userId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ avatarUrl: url })
                      });
                      
                      if (updateResponse.ok) {
                        toast({
                          title: "Foto atualizada!",
                          description: "Sua foto de perfil foi alterada com sucesso."
                        });
                        // Recarregar a página para mostrar a nova foto
                        window.location.reload();
                      }
                    }
                  } catch (error) {
                    console.error('Erro no upload:', error);
                    toast({
                      title: "Erro no upload",
                      description: "Não foi possível atualizar a foto.",
                      variant: "destructive"
                    });
                  } finally {
                    setIsUploadingAvatar(false);
                    e.target.value = '';
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <>
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    Editar Foto
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {currentUserProfile?.displayName || user.displayName || 'Usuário'}
            </h1>
            <p className="text-muted-foreground">
              {currentUserProfile?.firstName && currentUserProfile?.lastName 
                ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`
                : user.email}
            </p>
            {currentUserProfile?.id && (
              <p className="text-xs text-muted-foreground font-mono">
                ID: {currentUserProfile.id}
              </p>
            )}
            {currentUserProfile?.bio && (
              <p className="mt-2 text-sm">{currentUserProfile.bio}</p>
            )}
            <div className="flex items-center space-x-4 mt-3">
              {currentUserProfile?.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 mr-1" />
                  {currentUserProfile.location}
                </div>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-1" />
                {user.email}
              </div>
            </div>
          </div>

          {/* Notificações */}
          <div className="ml-auto flex items-center space-x-4">
            <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsNotificationsOpen(true)}>
                  <Bell className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Notificações</DialogTitle>
                  <DialogDescription>
                    Veja suas últimas notificações.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma notificação encontrada
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Conteúdo do Perfil */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="purchases">Inventário</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Estatísticas */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{accountStats.totalPurchases}</p>
                      <p className="text-sm text-muted-foreground">Compras Realizadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Package className="h-8 w-8 text-primary" />
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

          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seu Inventário</CardTitle>
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
                    {userOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Pedido #{order.id}</h4>
                            <Badge variant="outline" className="capitalize">{order.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Comprado em: {new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                            <span>Downloads: {order.downloadCount || 1}</span>
                            <Badge className={order.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                              {order.status === 'completed' ? 'Concluída' : 'Pendente'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-bold text-lg">R$ {(parseFloat(order.amount) || 0).toFixed(2)}</span>
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
                  <div className="flex space-x-2">
                    {isEditing && (
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Save className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditToggle}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {isEditing ? 'Cancelar' : 'Editar'}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`firstName-${uniqueId}`} className="text-foreground">Nome</Label>
                      <Input
                        id={`firstName-${uniqueId}`}
                        value={isEditing ? editForm.firstName : (currentUserProfile?.firstName || '')}
                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lastName-${uniqueId}`} className="text-foreground">Sobrenome</Label>
                      <Input
                        id={`lastName-${uniqueId}`}
                        value={isEditing ? editForm.lastName : (currentUserProfile?.lastName || '')}
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
                        value={isEditing ? editForm.displayName : (currentUserProfile?.displayName || user.displayName || '')}
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
                        value={currentUserProfile?.email || user.email}
                        disabled
                        className="bg-muted border-border text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`bio-${uniqueId}`} className="text-foreground">Biografia</Label>
                    <Textarea
                      id={`bio-${uniqueId}`}
                      value={isEditing ? editForm.bio : (currentUserProfile?.bio || '')}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Conte um pouco sobre você..."
                      className="min-h-[100px] bg-input border-border text-foreground"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`location-${uniqueId}`} className="text-foreground">Localização</Label>
                      <Input
                        id={`location-${uniqueId}`}
                        value={isEditing ? editForm.location : (currentUserProfile?.location || '')}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Cidade, País"
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground">Redes Sociais</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`youtube-${uniqueId}`} className="text-foreground flex items-center">
                          <Youtube className="h-4 w-4 mr-1" />
                          YouTube
                        </Label>
                        <Input
                          id={`youtube-${uniqueId}`}
                          value={isEditing ? editForm.youtubeUrl : (currentUserProfile?.youtubeUrl || '')}
                          onChange={(e) => setEditForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="https://youtube.com/@seucanal"
                          className="bg-input border-border text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`twitter-${uniqueId}`} className="text-foreground flex items-center">
                          <Twitter className="h-4 w-4 mr-1" />
                          Twitter
                        </Label>
                        <Input
                          id={`twitter-${uniqueId}`}
                          value={isEditing ? editForm.twitterUrl : (currentUserProfile?.twitterUrl || '')}
                          onChange={(e) => setEditForm(prev => ({ ...prev, twitterUrl: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="https://twitter.com/seuusuario"
                          className="bg-input border-border text-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`instagram-${uniqueId}`} className="text-foreground flex items-center">
                        <Instagram className="h-4 w-4 mr-1" />
                        Instagram
                      </Label>
                      <Input
                        id={`instagram-${uniqueId}`}
                        value={isEditing ? editForm.instagramUrl : (currentUserProfile?.instagramUrl || '')}
                        onChange={(e) => setEditForm(prev => ({ ...prev, instagramUrl: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="https://instagram.com/seuusuario"
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}