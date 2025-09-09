import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";

interface SellerPayout {
  id: number;
  sellerId: number;
  orderId: number;
  amount: string;
  pixKey: string;
  status: string;
  mercadoPagoTransferId?: string;
  failureReason?: string;
  processedAt?: string;
  createdAt: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-primary hover:bg-primary/90"><CheckCircle className="w-3 h-3 mr-1" />Pago</Badge>;
    case 'pending':
      return <Badge className="bg-accent hover:bg-accent/90"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
    case 'failed':
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Falhou</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function SellerPayouts() {
  const { data: payouts, isLoading } = useQuery<SellerPayout[]>({
    queryKey: ['/api/seller-payouts'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/seller-payouts');
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalPaid = payouts?.reduce((sum, payout) => 
    payout.status === 'completed' ? sum + parseFloat(payout.amount) : sum, 0) || 0;

  const totalPending = payouts?.reduce((sum, payout) => 
    payout.status === 'pending' ? sum + parseFloat(payout.amount) : sum, 0) || 0;

  const completedPayouts = payouts?.filter(p => p.status === 'completed').length || 0;
  const pendingPayouts = payouts?.filter(p => p.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-white">Pagamentos para Vendedores</h2>
          <p className="text-gray-400">Histórico de pagamentos automáticos realizados</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Pago</p>
                <p className="text-2xl font-bold text-primary">R${totalPaid.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pendente</p>
                <p className="text-2xl font-bold text-accent">R${totalPending.toFixed(2)}</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pagamentos Concluídos</p>
                <p className="text-2xl font-bold text-primary">{completedPayouts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pagamentos Pendentes</p>
                <p className="text-2xl font-bold text-accent">{pendingPayouts}</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pagamentos */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Histórico de Pagamentos</CardTitle>
          <CardDescription className="text-gray-400">
            Todos os pagamentos automáticos processados para vendedores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!payouts || payouts.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum pagamento processado ainda</p>
              <p className="text-sm text-gray-500 mt-2">
                Os pagamentos automáticos aparecerão aqui após as primeiras vendas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">
                          Vendedor ID: {payout.sellerId}
                        </h3>
                        {getStatusBadge(payout.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Valor</p>
                          <p className="text-primary font-bold">R${payout.amount}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-400">Chave PIX</p>
                          <p className="text-white font-mono text-xs">{payout.pixKey}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-400">Pedido</p>
                          <p className="text-white">#{payout.orderId}</p>
                        </div>
                      </div>

                      {payout.mercadoPagoTransferId && (
                        <div className="mt-2">
                          <p className="text-gray-400 text-xs">ID da Transferência</p>
                          <p className="text-blue-400 font-mono text-xs">{payout.mercadoPagoTransferId}</p>
                        </div>
                      )}

                      {payout.failureReason && (
                        <div className="mt-2">
                          <p className="text-red-400 text-sm">
                            <XCircle className="w-4 h-4 inline mr-1" />
                            {payout.failureReason}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Criado em</p>
                      <p className="text-white text-sm">
                        {new Date(payout.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      {payout.processedAt && (
                        <>
                          <p className="text-gray-400 text-xs mt-1">Processado em</p>
                          <p className="text-green-400 text-sm">
                            {new Date(payout.processedAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}