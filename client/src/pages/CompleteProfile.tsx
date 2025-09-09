import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Upload, Camera, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import TermsModal from '@/components/TermsModal';
import PrivacyModal from '@/components/PrivacyModal';

export default function CompleteProfile() {
  const [, setLocation] = useLocation();
  const { user, logout, refreshProfile, setShowProfileModal, syncUserAvatar } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [displayNameStatus, setDisplayNameStatus] = useState<'available' | 'taken' | 'checking' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Bloqueia navegação até completar o perfil
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      toast({
        title: "Complete seu perfil primeiro",
        description: "Você precisa completar seu perfil antes de usar o MineCart Store.",
        variant: "destructive"
      });
      setLocation('/complete-profile');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [toast, setLocation]);

  // Fechar modal se não estiver logado
  if (!user) {
    setShowProfileModal(false);
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Verificar nome de usuário em tempo real
    if (name === 'displayName' && value.trim()) {
      checkDisplayName(value.trim());
    }
  };

  const checkDisplayName = async (displayName: string) => {
    if (displayName.length < 3) {
      setDisplayNameStatus(null);
      return;
    }

    setDisplayNameStatus('checking');
    try {
      const response = await fetch(`/api/users/check-display-name/${encodeURIComponent(displayName)}`);
      const { available } = await response.json();
      setDisplayNameStatus(available ? 'available' : 'taken');
    } catch (error) {
      console.error('Erro ao verificar nome de usuário:', error);
      setDisplayNameStatus(null);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Arquivo muito grande",
          description: "Por favor, selecione uma imagem de até 5MB.",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione uma imagem válida.",
          variant: "destructive"
        });
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.displayName.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: "Aceite os termos",
        description: "Você deve aceitar os Termos de Serviço e Política de Privacidade.",
        variant: "destructive"
      });
      return;
    }

    if (displayNameStatus !== 'available') {
      toast({
        title: "Nome de usuário inválido",
        description: "Por favor, escolha um nome de usuário disponível.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Fechar modal imediatamente para dar feedback visual
    setShowProfileModal(false);

    try {
      // Upload da foto se fornecida
      let photoURL = user.photoURL || '';
      if (avatarFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('avatar', avatarFile);

        const uploadResponse = await fetch('/api/upload/avatar', {
          method: 'POST',
          body: formDataUpload,
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          photoURL = url;
          console.log('✅ Avatar upload bem-sucedido:', url);

          // Sincronizar avatar em toda aplicação
          await syncUserAvatar(url);
          
          // Forçar atualização do perfil para garantir sincronização
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.error('❌ Erro no upload do avatar:', uploadResponse.status);
          toast({
            title: "Erro no upload da foto",
            description: "A foto não pôde ser salva, mas o perfil foi criado.",
            variant: "destructive"
          });
        }
      }

      // Criar perfil completo
      const response = await fetch('/api/users/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          displayName: formData.displayName.trim(),
          photoURL,
          firebaseUid: user.uid,
          termsAccepted: true,
          privacyPolicyAccepted: true
        }),
      });

      if (response.ok) {
        const userData = await response.json();

        toast({
          title: "Perfil criado com sucesso!",
          description: "Bem-vindo ao MineCart Store!",
        });

        // Forçar atualização do perfil para sincronizar todas as informações
        await refreshProfile();

        // Limpar formulário
        setFormData({
          firstName: '',
          lastName: '',
          displayName: ''
        });
        setAcceptedTerms(false);
        setAvatarFile(null);
        setAvatarPreview('');
        setDisplayNameStatus(null);

        // Perfil completado com sucesso
        console.log('🚀 Perfil completado! Redirecionando...');

        // Pequeno delay para garantir sincronização antes do redirecionamento
        setTimeout(() => {
          window.location.href = '/catalog';
        }, 500);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar perfil');
      }
    } catch (error: any) {
      console.error('Erro ao completar perfil:', error);
      toast({
        title: "Erro ao criar perfil",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDisplayNameIcon = () => {
    switch (displayNameStatus) {
      case 'checking':
        return <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />;
      case 'available':
        return <Check className="h-4 w-4 text-primary" />;
      case 'taken':
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8">
      {/* Botão de fechar modal */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
        onClick={() => {
          logout(); // Fazer logout ao fechar
          setShowProfileModal(false);
        }}
      >
        <X className="h-5 w-5" />
      </Button>

      <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="minecraftia text-2xl text-primary mb-2">
            Complete seu Perfil
          </CardTitle>
          <CardDescription>
            Para usar o MineCart Store, precisamos de algumas informações básicas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : user.photoURL ? (
                    <img src={user.photoURL} alt="Google Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/80">
                  <Camera className="h-4 w-4" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Clique na câmera para alterar sua foto (opcional)
              </p>
            </div>

            {/* Nome */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Sobrenome *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Seu sobrenome"
                  required
                />
              </div>
            </div>

            {/* Nome de Usuário */}
            <div>
              <Label htmlFor="displayName">Nome de Usuário *</Label>
              <div className="relative">
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Como outros usuários vão te ver"
                  className="pr-10"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {getDisplayNameIcon()}
                </div>
              </div>
              {displayNameStatus === 'available' && (
                <p className="text-sm text-green-600 mt-1">Nome de usuário disponível!</p>
              )}
              {displayNameStatus === 'taken' && (
                <p className="text-sm text-red-600 mt-1">Este nome de usuário já está em uso.</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Este será o nome exibido publicamente no site.
              </p>
            </div>

            {/* Aceite de Termos */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="acceptTerms" className="text-sm text-muted-foreground leading-relaxed">
                  Eu li e aceito os{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary hover:underline underline"
                  >
                    Termos de Serviço
                  </button>
                  {' '}e a{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-primary hover:underline underline"
                  >
                    Política de Privacidade
                  </button>
                  {' '}da MineCart Store.
                </label>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || displayNameStatus !== 'available' || !acceptedTerms}
              >
                {loading ? 'Criando perfil...' : 'Completar Perfil'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  logout();
                  setLocation('/auth');
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modais dos Termos e Política */}
      <TermsModal open={showTermsModal} onOpenChange={setShowTermsModal} />
      <PrivacyModal open={showPrivacyModal} onOpenChange={setShowPrivacyModal} />
    </div>
  );
}