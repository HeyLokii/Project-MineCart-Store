import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Settings, DollarSign, Clock, Zap } from "lucide-react";

interface PlatformSettings {
  id: number;
  masterPixKey: string;
  platformFeePercentage: string;
  autoPayoutEnabled: boolean;
  payoutSchedule: string;
  minimumPayoutAmount: string;
  createdAt: string;
  updatedAt: string;
}

export function PaymentSettings() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    masterPixKey: '',
    platformFeePercentage: '',
    autoPayoutEnabled: true,
    payoutSchedule: 'immediate',
    minimumPayoutAmount: ''
  });

  const { data: settings, isLoading } = useQuery<PlatformSettings>({
    queryKey: ['/api/platform/settings'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/platform/settings');
      return res.json();
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest('PATCH', '/api/platform/settings', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Configurações Salvas",
        description: "As configurações de pagamento foram atualizadas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/platform/settings'] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Erro ao Salvar",
        description: error.message || "Erro ao atualizar configurações",
        variant: "destructive",
      });
    }
  });

  // Atualizar formulário quando settings carregarem
  useEffect(() => {
    if (settings) {
      setFormData({
        masterPixKey: settings.masterPixKey || '',
        platformFeePercentage: settings.platformFeePercentage || '',
        autoPayoutEnabled: settings.autoPayoutEnabled || true,
        payoutSchedule: settings.payoutSchedule || 'immediate',
        minimumPayoutAmount: settings.minimumPayoutAmount || ''
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-white">Configurações de Pagamento</h2>
          <p className="text-gray-400">Configure a distribuição automática de pagamentos para vendedores</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chave PIX Master da Plataforma */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Chave PIX da Plataforma
            </CardTitle>
            <CardDescription className="text-gray-400">
              Chave PIX onde os clientes fazem os pagamentos iniciais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="masterPixKey" className="text-white">Chave PIX Master</Label>
              <Input
                id="masterPixKey"
                type="email"
                placeholder="admin@minecartstore.com"
                value={formData.masterPixKey}
                onChange={(e) => handleInputChange('masterPixKey', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
              <p className="text-sm text-gray-400">
                Esta é a chave PIX para onde todos os pagamentos dos clientes são enviados inicialmente
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Taxa da Plataforma */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              Taxa da Plataforma
            </CardTitle>
            <CardDescription className="text-gray-400">
              Porcentagem que a plataforma retém de cada venda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="platformFeePercentage" className="text-white">Taxa (%)</Label>
              <Input
                id="platformFeePercentage"
                type="number"
                step="0.01"
                min="0"
                max="50"
                placeholder="10.00"
                value={formData.platformFeePercentage}
                onChange={(e) => handleInputChange('platformFeePercentage', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
              <p className="text-sm text-gray-400">
                Ex: 10% = R$10 ficam na plataforma e R$90 vão para o vendedor em uma venda de R$100
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pagamento Automático */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Pagamento Automático
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configure quando e como os vendedores recebem automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoPayoutEnabled" className="text-white">Ativar Pagamento Automático</Label>
                <p className="text-sm text-gray-400">
                  Vendedores recebem automaticamente após confirmação do pagamento
                </p>
              </div>
              <Switch
                id="autoPayoutEnabled"
                checked={formData.autoPayoutEnabled}
                onCheckedChange={(checked) => handleInputChange('autoPayoutEnabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumPayoutAmount" className="text-white">Valor Mínimo para Saque (R$)</Label>
              <Input
                id="minimumPayoutAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="1.00"
                value={formData.minimumPayoutAmount}
                onChange={(e) => handleInputChange('minimumPayoutAmount', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
              <p className="text-sm text-gray-400">
                Vendedores só recebem automaticamente se o valor for maior que este limite
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timing */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Cronograma de Pagamentos
            </CardTitle>
            <CardDescription className="text-gray-400">
              Quando os pagamentos são processados automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="payoutSchedule" className="text-white">Cronograma</Label>
              <select 
                id="payoutSchedule"
                value={formData.payoutSchedule}
                onChange={(e) => handleInputChange('payoutSchedule', e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
              >
                <option value="immediate">Imediato (após confirmação)</option>
                <option value="daily">Diário (1x por dia)</option>
                <option value="weekly">Semanal (1x por semana)</option>
              </select>
              <p className="text-sm text-gray-400">
                Em desenvolvimento, sempre processa imediatamente para demonstração
              </p>
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={updateSettingsMutation.isPending}
        >
          {updateSettingsMutation.isPending ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </form>
    </div>
  );
}