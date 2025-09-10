import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Clock, AlertTriangle, CheckCircle, User, Calendar, MessageCircle, Check, Shield } from 'lucide-react';
import ChatModal from '@/components/ChatModal';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isUrgent: boolean;
  isRead: boolean;
  createdAt: string;
}

export default function AdminSupport() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgent' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  // Verificar autenticação
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para acessar esta área.
          </p>
          <Link href="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Shield className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para acessar o suporte administrativo.
          </p>
          <Link href="/">
            <Button>Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact'],
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PUT', `/api/contact/${id}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: "Marcado como lido",
        description: "A mensagem foi marcada como lida.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível marcar como lido.",
        variant: "destructive",
      });
    },
  });

  const markAsRepliedMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PUT', `/api/contact/${id}/replied`, { adminId: 1 });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: "Marcado como respondido",
        description: "O cliente foi notificado sobre a resposta do suporte.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível marcar como respondido.",
        variant: "destructive",
      });
    },
  });

  const filteredMessages = messages.filter(message => {
    switch (selectedFilter) {
      case 'urgent':
        return message.isUrgent;
      case 'unread':
        return !message.isRead;
      default:
        return true;
    }
  });

  const urgentCount = messages.filter(m => m.isUrgent && !m.isRead).length;
  const unreadCount = messages.filter(m => !m.isRead).length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Suporte ao Cliente</h1>
          <p className="text-muted-foreground">
            Gerencie mensagens de contato e solicitações de suporte
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{unreadCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{urgentCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={selectedFilter} onValueChange={setSelectedFilter as any} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Todas ({messages.length})</TabsTrigger>
            <TabsTrigger value="urgent">Urgentes ({urgentCount})</TabsTrigger>
            <TabsTrigger value="unread">Não Lidas ({unreadCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Mail className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma mensagem encontrada</h3>
                <p className="text-muted-foreground">
                  {selectedFilter === 'all'
                    ? 'Não há mensagens de contato ainda.'
                    : `Não há mensagens ${selectedFilter === 'urgent' ? 'urgentes' : 'não lidas'}.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((message) => (
              <Card key={message.id} className={`${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{message.subject}</CardTitle>
                      {message.isUrgent && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Urgente
                        </Badge>
                      )}
                      {!message.isRead && (
                        <Badge variant="secondary">Nova</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(message.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      {message.isRead && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {message.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {message.email}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{message.message}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Recebido em {new Date(message.createdAt).toLocaleString('pt-BR')}
                      </div>

                      <div className="flex gap-2">
                        {!message.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsReadMutation.mutate(message.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Lida
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRepliedMutation.mutate(message.id)}
                          disabled={markAsRepliedMutation.isPending}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Marcar como Respondido
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setIsChatOpen(true);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        contactMessage={selectedMessage}
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedMessage(null);
        }}
      />
    </div>
  );
}