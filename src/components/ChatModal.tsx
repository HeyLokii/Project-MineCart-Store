import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

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

interface ChatMessage {
  id: number;
  contactMessageId: number;
  senderId: number;
  senderType: 'admin' | 'user';
  message: string;
  createdAt: string;
}

interface ChatSession {
  id: number;
  contactMessageId: number;
  userId: number;
  adminId?: number;
  status: 'waiting' | 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface ChatModalProps {
  contactMessage: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ contactMessage, isOpen, onClose }: ChatModalProps) {
  const [newMessage, setNewMessage] = useState('');
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get chat session
  const { data: session } = useQuery<ChatSession>({
    queryKey: [`/api/chat/session/${contactMessage?.id}`],
    enabled: !!contactMessage?.id && isOpen,
  });

  // Get chat messages
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: [`/api/chat/messages/${contactMessage?.id}`],
    enabled: !!contactMessage?.id && isOpen,
    refetchInterval: 2000, // Polling para mensagens em tempo real
  });

  // Create chat session mutation
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      if (!contactMessage || !user) return;
      
      const response = await apiRequest('POST', '/api/chat/session', {
        contactMessageId: contactMessage.id,
        userId: getUserIdFromEmail(contactMessage.email),
        adminId: user.id
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setChatSession(data);
      queryClient.invalidateQueries({ queryKey: [`/api/chat/session/${contactMessage?.id}`] });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!contactMessage || !user) return;
      
      const response = await apiRequest('POST', '/api/chat/messages', {
        contactMessageId: contactMessage.id,
        senderId: user.id,
        senderType: 'admin',
        message: messageText
      });
      return await response.json();
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: [`/api/chat/messages/${contactMessage?.id}`] });
      
      // Ativar sessão se ainda não estiver ativa
      if (session && session.status === 'waiting') {
        updateSessionMutation.mutate({ status: 'active' });
      }
    },
    onError: () => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<ChatSession>) => {
      if (!session) return;
      
      const response = await apiRequest('PUT', `/api/chat/session/${session.id}`, updates);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/session/${contactMessage?.id}`] });
    }
  });

  // Helper function to get user ID from email (simplified)
  const getUserIdFromEmail = (email: string): number => {
    // Em um sistema real, você buscaria pelo email na API
    // Por simplicidade, vamos usar um ID fixo baseado no email
    if (email === 'heylokibr333@gmail.com') return 3;
    return 1; // ID padrão para usuários
  };

  // Initialize chat session when modal opens
  useEffect(() => {
    if (isOpen && contactMessage && !session && user) {
      createSessionMutation.mutate();
    }
  }, [isOpen, contactMessage, session, user]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!contactMessage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col" aria-describedby="chat-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chat com {contactMessage.name}
            {contactMessage.isUrgent && (
              <Badge variant="destructive" className="ml-2">Urgente</Badge>
            )}
          </DialogTitle>
          <div id="chat-description" className="text-sm text-muted-foreground">
            <p><strong>Assunto:</strong> {contactMessage.subject}</p>
            <p><strong>Email:</strong> {contactMessage.email}</p>
          </div>
        </DialogHeader>

        {/* Original Message */}
        <div className="bg-muted p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{contactMessage.name}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(contactMessage.createdAt).toLocaleString('pt-BR')}
            </span>
          </div>
          <p className="text-sm">{contactMessage.message}</p>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 h-64 border rounded-lg p-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.senderType === 'admin'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.senderType === 'admin' ? (
                      <Shield className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">
                      {msg.senderType === 'admin' ? 'Admin' : contactMessage.name}
                    </span>
                    <span className="text-xs opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex gap-2 mt-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua resposta..."
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Session Status */}
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>
            Status: {session?.status === 'active' ? 'Ativo' : session?.status === 'waiting' ? 'Aguardando' : 'Fechado'}
          </span>
          {session?.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSessionMutation.mutate({ status: 'closed' })}
            >
              Fechar Chat
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}