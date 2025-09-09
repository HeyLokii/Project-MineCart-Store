import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, X, Check, Package, ShoppingCart, AlertCircle, CheckCircle, Filter, Trash2, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: number;
  userId: number;
  type: 'product_created' | 'product_approved' | 'product_rejected' | 'product_purchased' | 'purchase_completed' | 'order_completed' | 'new_sale' | 'product_review' | 'support_replied' | 'support_message' | 'announcement';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  productId?: number;
  orderId?: number;
  contactMessageId?: number;
}

export default function NotificationSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // State for unread count

  const { data: userNotifications = [], refetch } = useQuery<Notification[]>({
    queryKey: ['/api/notifications', user?.uid],
    queryFn: async () => {
      if (!user?.uid) {
        console.log('❌ Sem UID do usuário');
        return [];
      }

      console.log('🔔 Buscando notificações para UID:', user.uid);
      const response = await fetch(`/api/notifications/${user.uid}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('❌ Usuário não encontrado para notificações, retornando array vazio');
          return [];
        }
        console.log('❌ Erro ao buscar notificações:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notifications = await response.json();
      console.log(`📬 Recebidas ${notifications.length} notificações`);
      return notifications;
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 30, // 30 seconds (more frequent updates)
    refetchInterval: 1000 * 5, // Auto refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when window gets focus
    retry: false
  });


  // Effect to fetch notifications on mount and set up polling
  useEffect(() => {
    if (user?.uid) {
      // Clear any existing state first
      setNotifications([]);
      setUnreadCount(0);

      const interval = setInterval(() => {
        refetch(); // Use react-query refetch instead of manual fetch
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user?.uid, refetch]);

  // Effect to update local notifications state when userNotifications from useQuery changes
  useEffect(() => {
    if (userNotifications && userNotifications.length >= 0) {
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter((n: Notification) => !n.isRead).length);
    }
  }, [userNotifications]);

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.uid) throw new Error('Usuário não autenticado');

      const response = await fetch(`/api/notifications/${user.uid}/mark-all-read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha ao marcar notificações');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications', user?.uid] });
      toast({
        title: "✅ Todas as notificações foram marcadas como lida",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha ao marcar notificação');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the specific query key to refetch notifications
      queryClient.invalidateQueries({ queryKey: ['/api/notifications', user?.uid] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'product_created':
        return <Package className="h-4 w-4 text-secondary" />;
      case 'product_approved':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'product_rejected':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'product_purchased':
      case 'purchase_completed':
      case 'order_completed':
        return <ShoppingCart className="h-4 w-4 text-accent" />;
      case 'new_sale':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'product_review':
        return <MessageCircle className="h-4 w-4 text-secondary" />;
      case 'support_replied':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'support_message':
        return <MessageCircle className="h-4 w-4 text-orange-500" />;
      case 'announcement':
        return <Bell className="h-4 w-4 text-secondary" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'product_created':
        return 'border-l-secondary';
      case 'product_approved':
        return 'border-l-primary';
      case 'product_rejected':
        return 'border-l-destructive';
      case 'product_purchased':
      case 'purchase_completed':
        return 'border-l-accent';
      case 'support_replied':
        return 'border-l-blue-500';
      case 'support_message':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
      // Update local state immediately to remove red badge
      setNotifications(prev => prev.map(n =>
        n.id === notification.id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => prev - 1); // Decrement unread count
    }

    // Navigate based on notification type
    if (notification.productId) {
      window.location.href = `/product/${notification.productId}`;
    } else if (notification.orderId) {
      window.location.href = '/orders';
    } else if (notification.contactMessageId) {
      window.location.href = '/admin/support';
    }
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificações</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-1" />
                  {markAllAsReadMutation.isPending ? 'Marcando...' : 'Marcar todas como lida'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-l-4 cursor-pointer hover:bg-muted/30 transition-colors ${
                        getNotificationColor(notification.type)
                      } ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium truncate ${
                              !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}