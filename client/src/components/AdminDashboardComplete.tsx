import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Package, 
  Users, 
  DollarSign, 
  Download, 
  Activity,
  Plus,
  Settings,
  TrendingUp,
  UserPlus,
  Shield,
  Clock,
  Edit,
  Trash2,
  Check,
  X,
  Upload,
  Link,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ProductAnalysisModal from '@/components/ProductAnalysisModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface ActivityLog {
  id: number;
  action: string;
  description: string;
  createdAt: string;
  user: {
    displayName: string;
    email: string;
    photoURL?: string;
  };
}

export default function AdminDashboardComplete() {
  const [newCreatorData, setNewCreatorData] = useState({
    email: '',
    displayName: '',
    userId: ''
  });
  const [selectedProductForAnalysis, setSelectedProductForAnalysis] = useState<any>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // Estados dos modais
  const [viewProfileModal, setViewProfileModal] = useState({ open: false, user: null as any });
  const [warnModal, setWarnModal] = useState({ open: false, user: null as any });
  const [suspendModal, setSuspendModal] = useState({ open: false, user: null as any });
  const [suspendDuration, setSuspendDuration] = useState('');
  const [suspendUnit, setSuspendUnit] = useState('days');
  const [suspendReason, setSuspendReason] = useState(''); // State for suspension reason
  const [warnReason, setWarnReason] = useState('');
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    discount: '',
    images: [] as string[],
    compatibility: '',
    youtubeVideo: '',
    features: '',
    fileUrl: '',
    fileName: '',
  });

  const [imageMethod, setImageMethod] = useState<'upload' | 'url'>('upload');
  const [urlInputs, setUrlInputs] = useState<string[]>(['']);
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('📢 Aviso Importante');

  // Funções dos modais
  const handleViewProfile = (user: any) => {
    setViewProfileModal({ open: true, user });
  };

  const handleWarnUser = (user: any) => {
    setWarnModal({ open: true, user });
    setWarnReason('');
  };

  const handleSuspendUser = (user: any) => {
    setSuspendModal({ open: true, user });
    setSuspendDuration('');
    setSuspendUnit('days');
    setSuspendReason(''); // Clear reason when opening modal
  };

  const confirmWarn = () => {
    if (!warnReason.trim()) return;
    // Implementar API para avisar usuário
    toast({ title: "Aviso enviado", description: `${warnModal.user?.displayName} foi avisado.` });
    setWarnModal({ open: false, user: null });
  };

  const confirmSuspend = () => {
    if (suspendModal.user && (suspendUnit === 'perm' || suspendDuration) && suspendReason.trim()) {
      const duration = suspendUnit === 'perm' ? 'permanente' : `${suspendDuration} ${suspendUnit}`;
      console.log(`Suspendendo usuário ${suspendModal.user.id} por ${duration} - Motivo: ${suspendReason}`);

      // TODO: Implementar API call para suspender usuário
      // Aqui você adicionaria a chamada para a API que salva a suspensão no banco

      toast({ 
        title: "Usuário suspenso", 
        description: `${suspendModal.user?.displayName} foi suspenso ${duration}.` 
      });
      setSuspendModal({ open: false, user: null });
      setSuspendDuration('');
      setSuspendUnit('days');
      setSuspendReason('');
    }
  };

  const removeSuspension = (userId: number) => {
    console.log(`Removendo suspensão do usuário ${userId}`);
    // TODO: Implementar API call para remover suspensão
    toast({ title: "Suspensão removida", description: `A suspensão do usuário ${userId} foi removida.` });
  };


  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data with automatic refresh
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products', { admin: 'true' }],
    queryFn: () => fetch('/api/products?admin=true').then(res => res.json()),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Separate products by status for better management
  const pendingProducts = products.filter((p: any) => p.status === 'pending');
  const approvedProducts = products.filter((p: any) => p.status === 'approved');
  const rejectedProducts = products.filter((p: any) => p.status === 'rejected');

  const { data: activities = [] } = useQuery<ActivityLog[]>({
    queryKey: ['/api/activities'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Buscar dados reais do backend
  const { data: allUsers = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
  });

  const { data: allProducts = [] } = useQuery<any[]>({
    queryKey: ['/api/products', { admin: 'true' }],
  });

  const { data: allOrders = [] } = useQuery<any[]>({
    queryKey: ['/api/orders'],
  });

  // Calcular estatísticas reais
  const stats = {
    totalProducts: allProducts.length,
    activeUsers: allUsers.length,
    totalAdmins: allUsers.filter(user => user.role === 'admin').length,
    totalSales: allOrders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0),
    totalDownloads: allProducts.reduce((sum, product) => sum + (product.downloadCount || 0), 0),
  };

  // Verificar se o usuário atual é o Dono (heylokibr333@gmail.com)
  const isOwner = user?.email === 'heylokibr333@gmail.com';

  // Filtrar usuários administradores
  const adminUsers = allUsers.filter((user: any) => user.role === 'admin');

  // Estado para busca de usuários
  const [userSearch, setUserSearch] = useState('');

  const addAdminForm = useForm({
    defaultValues: {
      email: ''
    }
  });

  const addCreatorForm = useForm({
    defaultValues: {
      email: ''
    }
  });

  const addAdminMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await fetch('/api/users/promote-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Falha ao promover usuário a admin');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      addAdminForm.reset();
      toast({
        title: "Sucesso!",
        description: "Usuário promovido a administrador",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível promover usuário",
        variant: "destructive"
      });
    }
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/users/${userId}/remove-admin`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Falha ao remover admin');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Sucesso!",
        description: "Permissões de admin removidas",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover admin",
        variant: "destructive"
      });
    }
  });

  const onAddAdmin = async (data: any) => {
    if (!isOwner) {
      toast({
        title: "Acesso Negado",
        description: "Apenas o proprietário pode adicionar administradores",
        variant: "destructive"
      });
      return;
    }
    addAdminMutation.mutate(data);
  };

  const onRemoveAdmin = (adminId: number) => {
    if (!isOwner) return;
    removeAdminMutation.mutate(adminId);
  };

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, creatorId: user?.uid }),
      });
      if (!response.ok) throw new Error('Falha ao criar produto');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        discount: '',
        images: [],
        compatibility: '',
        youtubeVideo: '',
        features: '',
        fileUrl: '',
        fileName: '',
      });
      toast({
        title: "Sucesso!",
        description: "Produto criado com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar produto",
        variant: "destructive"
      });
    }
  });

  const handleCreateProduct = () => {
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    createProductMutation.mutate(productForm);
  };

  const onAddCreator = async (data: any) => {
    // Funcionalidade para adicionar criador
    console.log('Adicionando criador:', data.email);
  };

  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    refetchInterval: 20000,
  });

  // Stats calculation com dados em tempo real
  const totalSales = (orders as any[]).reduce((sum: number, order: any) => sum + parseFloat(order.amount || '0'), 0);

  // Calcular crescimento semanal
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const salesThisWeek = (orders as any[]).filter((order: any) => 
    new Date(order.createdAt) >= oneWeekAgo
  ).reduce((sum: number, order: any) => sum + parseFloat(order.amount || '0'), 0);

  const salesLastWeek = (orders as any[]).filter((order: any) => {
    const orderDate = new Date(order.createdAt);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return orderDate >= twoWeeksAgo && orderDate < oneWeekAgo;
  }).reduce((sum: number, order: any) => sum + parseFloat(order.amount || '0'), 0);

  const weeklyGrowth = salesLastWeek > 0 
    ? ((salesThisWeek - salesLastWeek) / salesLastWeek * 100).toFixed(1)
    : salesThisWeek > 0 ? '100' : '0';

  const salesStats = {
    totalProducts: products.length,
    pendingProducts: pendingProducts.length,
    approvedProducts: approvedProducts.length,
    activeUsers: (allUsers as any[]).length,
    totalSales: totalSales,
    totalDownloads: approvedProducts.reduce((sum: number, product: any) => sum + (product.downloadCount || 0), 0),
    weeklyGrowth: weeklyGrowth,
    salesThisWeek: salesThisWeek,
  };

  // Add creator mutation
  const addCreatorMutation = useMutation({
    mutationFn: async (data: typeof newCreatorData) => {
      const response = await fetch('/api/users/add-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, adminId: user?.uid }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao adicionar criador');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      setNewCreatorData({ email: '', displayName: '', userId: '' });
      toast({
        title: "Criador adicionado!",
        description: "O novo criador foi adicionado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddCreator = () => {
    if (!newCreatorData.email || !newCreatorData.displayName) {
      toast({
        title: "Campos obrigatórios",
        description: "Email e nome de exibição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    addCreatorMutation.mutate(newCreatorData);
  };

  const handleProductAction = async (productId: string, action: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: action,
          isActive: action === 'approved'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar ação');
      }

      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });

      toast({
        title: "Sucesso",
        description: `Produto ${action === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar ação no produto",
        variant: "destructive",
      });
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'product_created': return <Package className="h-4 w-4 text-primary" />;
      case 'user_created': return <UserPlus className="h-4 w-4 text-secondary" />;
      case 'review_created': return <TrendingUp className="h-4 w-4 text-accent" />;
      case 'user_permissions_updated': return <Shield className="h-4 w-4 text-secondary" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'product_created': return 'bg-primary/10 text-primary';
      case 'user_created': return 'bg-secondary/10 text-secondary';
      case 'review_created': return 'bg-yellow-100 text-yellow-800';
      case 'user_permissions_updated': return 'bg-secondary/10 text-secondary';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Product approval functions
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

      // Invalidate all product queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });

      toast({
        title: "Produto aprovado",
        description: "O produto foi aprovado e está agora visível no catálogo.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao aprovar produto.",
        variant: "destructive",
      });
    }
  };

  const handleRejectProduct = async (productId: number, reason?: string) => {
    const rejectionReason = reason || prompt("Digite o motivo da rejeição:");
    if (!rejectionReason) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason,
          isActive: false
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao rejeitar produto');
      }

      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });

      toast({
        title: "Produto rejeitado",
        description: "O produto foi rejeitado e o criador foi notificado.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao rejeitar produto.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/download`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Erro ao baixar produto');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `product_${productId}_download.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Download iniciado",
        description: "Seu download está sendo processado.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível baixar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleCreateProductSubmit = async () => {
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.description) {
      toast({
        title: "Campos obrigatórios faltando",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productForm, creatorId: user?.uid }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar produto');
      }

      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });

      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        discount: '',
        images: [],
        compatibility: '',
        youtubeVideo: '',
        features: '',
        fileUrl: '',
        fileName: '',
      });

      toast({
        title: "Produto criado!",
        description: "Seu produto foi enviado para análise.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "Produto atualizado com sucesso!" });
    }
  });

  const sendAnnouncementMutation = useMutation({
    mutationFn: async (data: { message: string; title: string }) => {
      const response = await fetch('/api/notifications/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to send announcement');
      return response.json();
    },
    onSuccess: () => {
      setAnnouncementMessage('');
      setAnnouncementTitle('📢 Aviso Importante');
      toast({ 
        title: "Aviso enviado!", 
        description: "O aviso foi enviado para todos os usuários." 
      });
    },
    onError: () => {
      toast({ 
        title: "Erro ao enviar aviso", 
        description: "Tente novamente.",
        variant: "destructive" 
      });
    }
  });

  const handleSendAnnouncement = () => {
    if (announcementMessage.trim() && announcementTitle.trim()) {
      sendAnnouncementMutation.mutate({
        message: announcementMessage.trim(),
        title: announcementTitle.trim()
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 p-6 rounded-lg header-gradient text-white">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="https://i.imgur.com/5OKEMhN.png" 
            alt="MineCart Store Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        </div>
        <p className="text-white/80">Gerencie produtos, usuários e configurações da plataforma</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Enviar Aviso Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="announcement-title">Título do Aviso</Label>
                <Input
                  id="announcement-title"
                  placeholder="Ex: 📢 Aviso Importante, 🎉 Novidade, ⚠️ Manutenção"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="announcement-message">Mensagem</Label>
                  <Input
                    id="announcement-message"
                    placeholder="Digite o aviso para todos os usuários..."
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSendAnnouncement}
                  disabled={!announcementMessage.trim() || !announcementTitle.trim() || sendAnnouncementMutation.isPending}
                  className="mt-6"
                >
                  {sendAnnouncementMutation.isPending ? 'Enviando...' : 'Enviar Aviso'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="settings">Painel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAdmins}</div>
                <p className="text-xs text-muted-foreground">Administradores ativos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {stats.totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total arrecadado</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity: ActivityLog) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {activity.user?.displayName || 'Sistema'}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <Badge className={getActionColor(activity.action)}>
                      {activity.action.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}

                {activities.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aguardando primeiras atividades</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>





        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gestão de Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingProducts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-orange-600 mb-3">
                    🕐 Produtos Aguardando Análise ({pendingProducts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingProducts.map((product: any) => (
                      <Card key={product.id} className="border-2 border-orange-200">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <img
                                src={product.images?.[0] || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                              <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                              <p className="text-sm font-semibold text-primary">R$ {parseFloat(product.price).toFixed(2)}</p>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              Aguardando Análise
                            </Badge>

                            <div className="space-y-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full mb-2"
                                onClick={() => {
                                  setSelectedProductForAnalysis(product);
                                  setIsAnalysisModalOpen(true);
                                }}
                              >
                                Ver Detalhes Completos
                              </Button>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveProduct(product.id)}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Aprovar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  className="flex-1"
                                  onClick={() => handleRejectProduct(product.id)}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Rejeitar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {approvedProducts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-600 mb-3">
                    ✅ Produtos Aprovados ({approvedProducts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedProducts.slice(0, 6).map((product: any) => (
                      <Card key={product.id} className="border-2 border-green-200">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <img
                                src={product.images?.[0] || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                              <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                              <p className="text-sm font-semibold text-primary">R$ {parseFloat(product.price).toFixed(2)}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              Aprovado
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {approvedProducts.length > 6 && (
                    <p className="text-center text-muted-foreground mt-4">
                      ... e mais {approvedProducts.length - 6} produtos aprovados
                    </p>
                  )}
                </div>
              )}

              {rejectedProducts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-3">
                    ❌ Produtos Rejeitados ({rejectedProducts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rejectedProducts.slice(0, 3).map((product: any) => (
                  <Card key={product.id} className="border-2 border-red-200">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <img
                                src={product.images?.[0] || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                              <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                              <p className="text-sm font-semibold text-primary">R$ {parseFloat(product.price).toFixed(2)}</p>
                            </div>
                            <Badge variant="destructive">
                              Rejeitado
                            </Badge>

                            {product.rejectionReason && (
                              <div className="bg-red-50 dark:bg-red-950 p-2 rounded text-xs">
                                <p className="text-red-800 dark:text-red-200 font-medium">Motivo da rejeição:</p>
                                <p className="text-red-700 dark:text-red-300">{product.rejectionReason}</p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                              <Button size="sm" variant="destructive" className="flex-1">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {rejectedProducts.length > 3 && (
                    <p className="text-center text-muted-foreground mt-4">
                      ... e mais {rejectedProducts.length - 3} produtos rejeitados
                    </p>
                  )}
                </div>
              )}

              {products.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum produto encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Painel de Controle
              </CardTitle>
              <p className="text-muted-foreground">Gerencie usuários e permissões</p>
            </CardHeader>
            <CardContent>
              {/* Navegação das configurações */}
              <Tabs defaultValue="users" className="w-full">
                <TabsList className={`grid w-full ${isOwner ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <TabsTrigger value="users">Usuários ({allUsers.length})</TabsTrigger>
                  <TabsTrigger value="add-creator">Adicionar Criador</TabsTrigger>
                  {isOwner && <TabsTrigger value="add-admin">Adicionar Admin</TabsTrigger>}
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Gestão de Usuários
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Campo de busca */}
                      <div className="mb-6">
                        <Input
                          placeholder="Buscar usuários por nome, email ou ID..."
                          className="max-w-md"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allUsers
                          .filter(u => 
                            userSearch === '' || 
                            u.firstName?.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.lastName?.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.displayName?.toLowerCase().includes(userSearch.toLowerCase())
                          )
                          .map((userData: any) => (
                          <Card key={userData.id} className="border-2 dark:border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <Avatar>
                                  <AvatarImage src={userData.photoURL} />
                                  <AvatarFallback className="bg-gray-600 text-white">
                                    {userData.displayName?.charAt(0) || userData.email.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-medium text-sm text-foreground">
                                    {userData.firstName && userData.lastName 
                                      ? `${userData.firstName} ${userData.lastName}` 
                                      : userData.displayName || userData.email
                                    }
                                    {userData.email === 'heylokibr333@gmail.com' && 
                                      <span className="ml-2 text-xs text-amber-600 font-bold">(DONO)</span>
                                    }
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {userData.email}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ID: {userData.id}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2 mb-3">
                                <Badge variant={
                                  userData.role === 'admin' ? 'default' : 
                                  userData.role === 'creator' ? 'secondary' : 'outline'
                                }>
                                  {userData.role === 'admin' ? 'Admin' : 
                                   userData.role === 'creator' ? 'Criador' : 'Usuário'}
                                </Badge>
                                {userData.canCreateProducts && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-800">Pode criar produtos</Badge>
                                )}
                                {userData.isVerified && (
                                  <Badge className="bg-green-100 text-green-800">Verificado</Badge>
                                )}
                                {userData.isSuspended && (
                                   <Badge variant="destructive">Suspenso</Badge>
                                )}
                              </div>

                              {/* Opções de ação */}
                              <div className="flex gap-1 flex-wrap">
                                {userData.email !== 'heylokibr333@gmail.com' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex-1 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                                      onClick={() => handleViewProfile(userData)}
                                    >
                                      Ver Perfil
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex-1 text-xs text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors"
                                      onClick={() => handleWarnUser(userData)}
                                    >
                                      Avisar
                                    </Button>
                                    {/* TODO: Verificar se usuário está suspenso */}
                                    {userData.isSuspended ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-xs hover:bg-green-600 hover:text-white transition-colors"
                                        onClick={() => removeSuspension(userData.id)}
                                      >
                                        Remover Suspensão
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1 text-xs hover:bg-red-600 transition-colors"
                                        onClick={() => handleSuspendUser(userData)}
                                      >
                                        Suspender
                                      </Button>
                                    )}
                                  </>
                                )}
                                {userData.email === 'heylokibr333@gmail.com' && (
                                  <p className="text-xs text-amber-600 font-medium text-center w-full">
                                    Conta do Proprietário
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="add-creator" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Adicionar Criador
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newCreatorData.email}
                            onChange={(e) => setNewCreatorData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="criador@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="userId">ID do Usuário (Segurança)</Label>
                          <Input
                            id="userId"
                            type="text"
                            value={newCreatorData.userId}
                            onChange={(e) => setNewCreatorData(prev => ({ ...prev, userId: e.target.value }))}
                            placeholder="ID único do usuário"
                          />
                        </div>

                        <div>
                          <Label htmlFor="displayName">Nome de Exibição *</Label>
                          <Input
                            id="displayName"
                            value={newCreatorData.displayName}
                            onChange={(e) => setNewCreatorData(prev => ({ ...prev, displayName: e.target.value }))}
                            placeholder="Nome do Criador"
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handleAddCreator}
                        disabled={addCreatorMutation.isPending}
                        className="w-full md:w-auto"
                      >
                        {addCreatorMutation.isPending ? 'Adicionando...' : 'Adicionar Criador'}
                      </Button>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Informações sobre Criadores</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Criadores podem adicionar e gerenciar seus próprios produtos</li>
                          <li>• IDs são gerados automaticamente de forma sequencial</li>
                          <li>• Owner = ID 1, Admin = ID 2, novos usuários = ID 3+</li>
                          <li>• Criadores não têm acesso às configurações administrativas</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {isOwner && (
                  <TabsContent value="add-admin" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Gerenciar Administradores
                        </CardTitle>
                        <p className="text-muted-foreground">
                          Apenas o proprietário pode gerenciar administradores
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Admins Atuais */}
                        <div>
                          <h4 className="font-semibold mb-3">Administradores Atuais ({adminUsers.length})</h4>
                          {adminUsers.length > 0 ? (
                            <div className="space-y-3">
                              {adminUsers.map((admin) => (
                                <div key={admin.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={admin.photoURL} alt={admin.displayName || admin.email} />
                                      <AvatarFallback className="bg-blue-600 text-white">
                                        {admin.firstName?.[0] || admin.email?.[0]?.toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-foreground">
                                        {admin.firstName && admin.lastName 
                                          ? `${admin.firstName} ${admin.lastName}` 
                                          : admin.displayName || admin.email
                                        }
                                      </p>
                                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                                    </div>
                                  </div>
                                  {admin.email !== 'heylokibr333@gmail.com' && (
                                    <Button 
                                      size="sm" 
                                      variant="destructive" 
                                      className="text-xs"
                                      onClick={() => onRemoveAdmin(admin.id)}
                                      disabled={removeAdminMutation.isPending}
                                    >
                                      {removeAdminMutation.isPending ? 'Removendo...' : 'Remover Admin'}
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Nenhum administrador além do proprietário</p>
                          )}
                        </div>

                        {/* Adicionar Novo Admin */}
                        <div className="border-t pt-6">
                          <h4 className="font-semibold mb-3">Adicionar Novo Administrador</h4>
                          <Form {...addAdminForm}>
                            <form onSubmit={addAdminForm.handleSubmit(onAddAdmin)} className="space-y-4">
                              <FormField
                                control={addAdminForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email do Usuário</FormLabel>
                                    <FormControl>
                                      <Input placeholder="usuario@exemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" disabled={addAdminMutation.isPending}>
                                {addAdminMutation.isPending ? 'Processando...' : 'Tornar Administrador'}
                              </Button>
                            </form>
                          </Form>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>



      </Tabs>

      {/* Modal de Análise de Produto */}
      <ProductAnalysisModal
        product={selectedProductForAnalysis}
        isOpen={isAnalysisModalOpen}
        onClose={() => {
          setIsAnalysisModalOpen(false);
          setSelectedProductForAnalysis(null);
        }}
        onApprove={handleApproveProduct}
        onReject={(productId) => handleRejectProduct(productId)}
      />

      {/* Modal Ver Perfil */}
    <Dialog open={viewProfileModal.open} onOpenChange={(open) => setViewProfileModal({ open, user: null })}>
      <DialogContent className="max-w-md" aria-describedby="profile-description">
        <DialogHeader>
          <DialogTitle>Perfil do Usuário</DialogTitle>
          <DialogDescription id="profile-description">
            Visualizar informações detalhadas do usuário selecionado
          </DialogDescription>
        </DialogHeader>
        {viewProfileModal.user && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={viewProfileModal.user.photoURL} />
                <AvatarFallback>
                  {viewProfileModal.user.displayName?.charAt(0) || viewProfileModal.user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{viewProfileModal.user.displayName || 'Usuário'}</h3>
                <p className="text-sm text-muted-foreground">{viewProfileModal.user.email}</p>
                <p className="text-xs text-muted-foreground">ID: {viewProfileModal.user.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Função:</strong> {viewProfileModal.user.role === 'admin' ? 'Admin' : viewProfileModal.user.role === 'creator' ? 'Criador' : 'Usuário'}
              </div>
              <div>
                <strong>Verificado:</strong> {viewProfileModal.user.isVerified ? 'Sim' : 'Não'}
              </div>
              <div>
                <strong>Pode criar produtos:</strong> {viewProfileModal.user.canCreateProducts ? 'Sim' : 'Não'}
              </div>
              <div>
                <strong>Membro desde:</strong> {new Date(viewProfileModal.user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setViewProfileModal({ open: false, user: null })}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Modal Avisar */}
    <Dialog open={warnModal.open} onOpenChange={(open) => setWarnModal({ open, user: null })}>
      <DialogContent className="max-w-md" aria-describedby="warn-description">
        <DialogHeader>
          <DialogTitle>Avisar Usuário</DialogTitle>
          <DialogDescription id="warn-description">
            Envie um aviso para {warnModal.user?.displayName || warnModal.user?.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="warnReason">Motivo do aviso *</Label>
            <Textarea
              id="warnReason"
              value={warnReason}
              onChange={(e) => setWarnReason(e.target.value)}
              placeholder="Descreva o motivo do aviso..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setWarnModal({ open: false, user: null })}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmWarn} 
            disabled={!warnReason.trim()}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Enviar Aviso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Modal Suspender */}
    <Dialog open={suspendModal.open} onOpenChange={(open) => setSuspendModal({ open, user: null })}>
      <DialogContent className="max-w-md" aria-describedby="suspend-description">
        <DialogHeader>
          <DialogTitle>Suspender Usuário</DialogTitle>
          <DialogDescription id="suspend-description">
            Suspender {suspendModal.user?.displayName || suspendModal.user?.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="suspendDuration">Duração</Label>
              <Input
                id="suspendDuration"
                type="number"
                value={suspendDuration}
                onChange={(e) => setSuspendDuration(e.target.value)}
                placeholder="1"
                disabled={suspendUnit === 'perm'}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="suspendUnit">Unidade</Label>
              <Select value={suspendUnit} onValueChange={setSuspendUnit}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="hours" className="text-foreground hover:bg-accent">Horas</SelectItem>
                  <SelectItem value="days" className="text-foreground hover:bg-accent">Dias</SelectItem>
                  <SelectItem value="perm" className="text-foreground hover:bg-accent">Permanente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="suspendReason">Motivo da Suspensão *</Label>
            <textarea
              id="suspendReason"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Descreva o motivo da suspensão..."
              className="w-full min-h-[80px] px-3 py-2 bg-background border border-border rounded-md text-sm resize-none"
              required
            />
          </div>

          <p className="text-sm text-muted-foreground">
            ⚠️ Esta ação impedirá o usuário de acessar a plataforma
            {suspendUnit === 'perm' ? ' permanentemente' : ` por ${suspendDuration || '1'} ${suspendUnit === 'hours' ? 'horas' : 'dias'}`}.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setSuspendModal({ open: false, user: null })}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={confirmSuspend}
            disabled={(suspendUnit !== 'perm' && !suspendDuration) || !suspendReason.trim()}
          >
            Suspender
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
}