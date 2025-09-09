import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Twitter, Youtube, Linkedin, Save, Settings, Globe } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SiteSetting {
  id: number;
  key: string;
  value: string;
  category: string;
  updatedAt: string;
}

export default function AdminSettings() {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // TEMPORÁRIO: Acesso liberado para análise da IA

  const { data: settings = [], isLoading } = useQuery<SiteSetting[]>({
    queryKey: ['/api/settings'],
    onSuccess: (data) => {
      const initialFormData: { [key: string]: string } = {};
      data.forEach(setting => {
        initialFormData[setting.key] = setting.value;
      });
      setFormData(initialFormData);
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await apiRequest('PUT', `/api/settings/${key}`, { value });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Configuração atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar configuração",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = (key: string) => {
    updateSettingMutation.mutate({ key, value: formData[key] });
  };

  const socialSettings = settings.filter(s => s.category === 'social');
  const supportSettings = settings.filter(s => s.category === 'support');

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurações do Site</h1>
          <p className="text-muted-foreground">
            Gerencie configurações globais do site, incluindo redes sociais e informações de contato
          </p>
        </div>

        <Tabs defaultValue="social" className="space-y-6">
          <TabsList>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
            <TabsTrigger value="general">Geral</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Redes Sociais
                </CardTitle>
                <CardDescription>
                  Configure os links das redes sociais que aparecerão no rodapé do site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="social_discord" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Discord
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="social_discord"
                      value={formData.social_discord || ''}
                      onChange={(e) => handleInputChange('social_discord', e.target.value)}
                      placeholder="https://discord.gg/minecart"
                    />
                    <Button 
                      onClick={() => handleSave('social_discord')}
                      disabled={updateSettingMutation.isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter/X
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="social_twitter"
                      value={formData.social_twitter || ''}
                      onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                      placeholder="https://twitter.com/minecart"
                    />
                    <Button 
                      onClick={() => handleSave('social_twitter')}
                      disabled={updateSettingMutation.isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_youtube" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="social_youtube"
                      value={formData.social_youtube || ''}
                      onChange={(e) => handleInputChange('social_youtube', e.target.value)}
                      placeholder="https://youtube.com/minecart"
                    />
                    <Button 
                      onClick={() => handleSave('social_youtube')}
                      disabled={updateSettingMutation.isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social_linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="social_linkedin"
                      value={formData.social_linkedin || ''}
                      onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/minecart"
                    />
                    <Button 
                      onClick={() => handleSave('social_linkedin')}
                      disabled={updateSettingMutation.isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Informações de Suporte
                </CardTitle>
                <CardDescription>
                  Configure as informações de contato para suporte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="support_email">Email de Suporte</Label>
                  <div className="flex gap-2">
                    <Input
                      id="support_email"
                      value={formData.support_email || ''}
                      onChange={(e) => handleInputChange('support_email', e.target.value)}
                      placeholder="minecartstore.help@gmail.com"
                      type="email"
                    />
                    <Button 
                      onClick={() => handleSave('support_email')}
                      disabled={updateSettingMutation.isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Este email receberá todas as mensagens de contato enviadas através do site.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configurações gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Nome do Site</Label>
                  <div className="flex gap-2">
                    <Input
                      id="site_name"
                      value={formData.site_name || 'MineCart Store'}
                      onChange={(e) => handleInputChange('site_name', e.target.value)}
                      placeholder="Nome do seu site"
                    />
                    <Button 
                      onClick={() => handleSave('site_name')}
                      disabled={updateSettingMutation.isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site_description">Descrição do Site</Label>
                  <div className="flex gap-2">
                    <Input
                      id="site_description"
                      value={formData.site_description || 'A melhor loja de recursos para Minecraft'}
                      onChange={(e) => handleInputChange('site_description', e.target.value)}
                      placeholder="Descrição do seu site"
                    />
                    <Button 
                      onClick={() => handleSave('site_description')}
                      disabled={updateSettingMutation.isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
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