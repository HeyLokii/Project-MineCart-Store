
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, MessageCircle, Mail } from 'lucide-react';

interface SuspensionBlockerProps {
  suspensionType: 'suspended' | 'banned';
  reason: string;
  expiresAt?: string;
  onLogout: () => void;
}

export default function SuspensionBlocker({ 
  suspensionType, 
  reason, 
  expiresAt, 
  onLogout 
}: SuspensionBlockerProps) {
  useEffect(() => {
    // Prevenir navegação
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const isPermanent = suspensionType === 'banned' || !expiresAt;
  const timeRemaining = expiresAt ? new Date(expiresAt).getTime() - Date.now() : 0;
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-destructive">
            {suspensionType === 'banned' ? 'Conta Banida' : 'Conta Suspensa'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Sua conta foi {suspensionType === 'banned' ? 'banida' : 'suspensa'} 
              {!isPermanent ? ` por ${daysRemaining} dias` : ' permanentemente'}.
            </p>
            
            {!isPermanent && expiresAt && (
              <p className="text-sm text-muted-foreground">
                Suspensão expira em: {new Date(expiresAt).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Motivo:</h4>
            <p className="text-sm text-muted-foreground">{reason}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-center">Quer recorrer desta decisão?</h4>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://discord.gg/suporte', '_blank')}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Entrar em contato via Discord
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('mailto:suporte@minecartstore.com?subject=Recurso de Suspensão/Ban', '_blank')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Enviar email para suporte
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={onLogout}
            >
              Sair da Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
