
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Mail, Package, ShoppingCart, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  description: string;
  entityType: string;
  entityId: number;
  metadata?: any;
  createdAt: string;
  user: {
    displayName: string | null;
    email: string;
    photoURL: string | null;
  } | null;
}

export default function ActivityFeed({ limit = 10 }: { limit?: number }) {
  const { toast } = useToast();

  const { data: activities = [], isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['/api/activities'],
    staleTime: 1000 * 30, // 30 segundos
  });

  const markAsRepliedMutation = useMutation({
    mutationFn: async (entityId: number) => {
      const response = await apiRequest('PUT', `/api/contact/${entityId}/replied`, { adminId: 1 });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: "Marcado como respondido ✅",
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

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'support_contact':
        return <MessageCircle className="h-4 w-4 text-orange-500" />;
      case 'support_replied':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'product_created':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'order_completed':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'support_contact':
        return 'border-l-orange-500';
      case 'support_replied':
        return 'border-l-green-500';
      case 'product_created':
        return 'border-l-blue-500';
      case 'order_completed':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentActivities = activities.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma atividade recente</p>
          </div>
        ) : (
          recentActivities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 border-l-4 bg-card rounded-r-lg ${getActivityColor(activity.action)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {getActivityIcon(activity.action)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.user?.photoURL || ''} />
                        <AvatarFallback className="text-xs bg-primary/10">
                          {activity.user?.displayName?.[0] || activity.user?.email?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {activity.user?.displayName || activity.user?.email || 'Sistema'}
                      </span>
                      
                      {activity.action === 'support_contact' && (
                        <Badge variant={activity.metadata?.isUrgent ? "destructive" : "secondary"} className="text-xs">
                          {activity.metadata?.isUrgent ? (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              URGENTE
                            </>
                          ) : (
                            'Suporte'
                          )}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                    
                    {activity.metadata && (
                      <div className="text-xs text-muted-foreground">
                        {activity.metadata.email && (
                          <span>Email: {activity.metadata.email}</span>
                        )}
                        {activity.metadata.subject && activity.metadata.email && <span> • </span>}
                        {activity.metadata.subject && (
                          <span>Assunto: {activity.metadata.subject}</span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(activity.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Botão Marcar como Respondido apenas para mensagens de suporte */}
                {activity.action === 'support_contact' && activity.entityType === 'contact' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsRepliedMutation.mutate(activity.entityId)}
                    disabled={markAsRepliedMutation.isPending}
                    className="text-green-600 hover:text-green-700 shrink-0"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    {markAsRepliedMutation.isPending ? 'Processando...' : 'Marcar como Respondido'}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
        
        {activities.length > limit && (
          <div className="text-center pt-3">
            <Button variant="ghost" size="sm">
              Ver todas as atividades
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
