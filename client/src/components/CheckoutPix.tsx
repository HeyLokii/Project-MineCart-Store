import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Check, QrCode, Clock, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useCallback } from 'react';

interface CheckoutPixProps {
  products: Array<{
    id: number;
    name: string;
    price: string;
    quantity: number;
  }>;
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface PaymentData {
  orderId: string;
  pixCode: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
  amount: string;
  expiresAt: string;
  paymentId: string;
}

export default function CheckoutPix({ products, total, isOpen, onClose, onSuccess }: CheckoutPixProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'timeout' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Aguardando pagamento PIX...');
  const [verificationCount, setVerificationCount] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/orders/create-pix', {
        products,
        total: total.toFixed(2)
      });
      return response.json();
    },
    onSuccess: (data) => {
      setPaymentData(data);
      setOrderId(data.paymentId); // Define o orderId para a verificação
      startPaymentCheck(data.paymentId);
    },
    onError: () => {
      toast({
        title: "Erro ao criar pedido",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  });

  const checkPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await apiRequest('GET', `/api/orders/${paymentId}/status`);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('📊 Status do pagamento:', data);

      if (data.status === 'approved' && checkingPayment) {
        setCheckingPayment(false);
        setPaymentData(null);

        toast({
          title: "🎉 Pagamento confirmado!",
          description: "Seus produtos foram adicionados à sua conta. Redirecionando para pedidos...",
          duration: 5000,
        });

        // Invalidar cache e limpar dados
        queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        queryClient.invalidateQueries({ queryKey: ['/api/cart'] });

        // Aguardar um pouco antes de fechar para mostrar mensagem
        setTimeout(() => {
          onSuccess?.();
          onClose();
          // Redirecionar para página de pedidos
          window.location.href = '/orders';
        }, 2000);

      } else if (data.status === 'processing') {
        // Continuar verificando se está processando
        console.log('🔄 Pagamento em processamento...');

      } else if (data.status === 'rejected' || data.status === 'cancelled') {
        setCheckingPayment(false);
        toast({
          title: "❌ Pagamento não confirmado",
          description: "O pagamento foi rejeitado ou cancelado.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('❌ Erro ao verificar status:', error);
      toast({
        title: "Erro na verificação",
        description: "Erro ao verificar status do pagamento. Tente recarregar a página.",
        variant: "destructive",
      });
    }
  });

  const startPaymentCheck = (paymentId: string) => {
    setCheckingPayment(true);

    let attempts = 0;
    const maxAttempts = 60; // 60 tentativas = 5 minutos
    let currentInterval: NodeJS.Timeout;

    const checkStatus = () => {
      attempts++;
      console.log(`🔍 Verificação ${attempts}/${maxAttempts} para pagamento ${paymentId}`);
      checkPaymentMutation.mutate(paymentId);

      // Para após 60 tentativas
      if (attempts >= maxAttempts) {
        clearInterval(currentInterval);
        setCheckingPayment(false);
        toast({
          title: "⏰ Tempo limite esgotado",
          description: "Verifique na página 'Meus Pedidos' se o pagamento foi processado.",
          variant: "destructive",
        });
      }
    };

    // Primeira verificação imediata
    checkStatus();

    // Continuar verificando a cada 5 segundos
    currentInterval = setInterval(checkStatus, 5000);

    // Limpar intervalo quando componente desmonta
    return () => {
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };
  };

  const copyPixCode = async () => {
    if (paymentData?.pixCode) {
      await navigator.clipboard.writeText(paymentData.pixCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Cole no seu app de pagamentos para finalizar a compra.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartPayment = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para finalizar a compra.",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate();
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Pagamento PIX
          </DialogTitle>
          <DialogDescription>
            Finalize sua compra com PIX de forma rápida e segura
          </DialogDescription>
        </DialogHeader>

        {!paymentData ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {product.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        R$ {(parseFloat(product.price) * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleStartPayment} 
              className="w-full" 
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? "Gerando PIX..." : "Gerar PIX"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentData.qrCodeBase64 ? (
              <div className="text-center space-y-2">
                <div className="mx-auto w-48 h-48 bg-white p-4 rounded-lg border-2 border-gray-200">
                  <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 mx-auto text-gray-600 mb-2" />
                      <p className="text-xs text-gray-600">QR Code PIX</p>
                      <p className="text-xs text-gray-500">Valor: R$ {paymentData.amount}</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold">QR Code PIX</h3>
                <p className="text-sm text-muted-foreground">
                  Escaneie com o app do seu banco ou use o código abaixo
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <QrCode className="h-16 w-16 mx-auto text-primary" />
                <h3 className="font-semibold">PIX Copia e Cola</h3>
                <p className="text-sm text-muted-foreground">
                  Copie o código abaixo e cole no seu app de pagamentos
                </p>
              </div>
            )}

            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor a pagar</p>
                    <p className="text-2xl font-bold text-primary">R$ {paymentData.amount}</p>
                  </div>

                  {paymentData.pixCode && (
                    <div>
                      <p className="text-sm text-muted-foreground">Código PIX (Copia e Cola)</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-muted p-2 rounded text-xs break-all">
                          {paymentData.pixCode}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyPixCode}
                          className="flex-shrink-0"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {paymentData.ticketUrl && (
                    <div>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full"
                      >
                        <a 
                          href={paymentData.ticketUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Abrir link de pagamento
                        </a>
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Código expira em {formatTimeRemaining(paymentData.expiresAt)}</span>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">💡 Sistema de Demonstração</p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                      Pagamento será aprovado automaticamente em 30 segundos para demonstração.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {checkingPayment && (
              <Badge variant="secondary" className="w-full justify-center py-2">
                <div className="animate-pulse">{statusMessage}</div>
              </Badge>
            )}

            <div className="text-center text-xs text-muted-foreground space-y-2">
              <p>Após o pagamento, seus produtos serão liberados automaticamente.</p>
              <p>O download estará disponível em "Minhas Compras".</p>
              <div className="bg-yellow-50 dark:bg-yellow-950 p-2 rounded text-yellow-800 dark:text-yellow-200">
                <p className="font-medium text-xs">⚠️ Demonstração: Pagamento aprovado em 30 segundos</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}