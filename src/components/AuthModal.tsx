
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Lock, Eye, EyeOff, Upload, Camera, Check, X, Loader2 } from 'lucide-react';
import { signInWithGoogle } from '@/lib/firebase';

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AuthModal({ show, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    displayName: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [displayNameStatus, setDisplayNameStatus] = useState<'available' | 'taken' | 'checking' | null>(null);
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
      console.error('Erro ao verificar nome de exibição:', error);
      setDisplayNameStatus(null);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem.');
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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      // Check if Firebase is configured
      if (!auth) {
        alert('🔧 Firebase não configurado no ambiente de produção. Por favor, configure as variáveis de ambiente no Vercel para habilitar o login com Google.');
        setLoading(false);
        return;
      }
      
      const result = await signInWithGoogle();
      if (result?.user) {
        onClose();
      }
    } catch (error: any) {
      console.error('Erro no login Google:', error);
      let errorMessage = 'Erro ao fazer login com Google. Tente novamente.';
      
      if (error.message?.includes('não configurado')) {
        errorMessage = '🔧 Sistema de autenticação não configurado. Entre em contato com o suporte.';
      } else if (error.message?.includes('popup')) {
        errorMessage = '❌ Popup bloqueado pelo navegador. Permita popups e tente novamente.';
      }
      
      alert(errorMessage);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if Firebase is configured
      if (!auth) {
        alert('🔧 Firebase não configurado. Por favor, configure as variáveis de ambiente.');
        setLoading(false);
        return;
      }
      
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert('As senhas não coincidem');
          return;
        }

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          alert('Nome e sobrenome são obrigatórios');
          return;
        }

        if (!formData.displayName.trim()) {
          alert('Nome de exibição é obrigatório');
          return;
        }

        if (displayNameStatus === 'taken') {
          alert('Nome de exibição já está em uso');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        let photoURL = '';
        if (avatarFile) {
          const formDataUpload = new FormData();
          formDataUpload.append('avatar', avatarFile);

          try {
            const uploadResponse = await fetch('/api/upload/avatar', {
              method: 'POST',
              body: formDataUpload
            });
            const uploadResult = await uploadResponse.json();
            photoURL = uploadResult.url;
          } catch (uploadError) {
            console.warn('Erro no upload da imagem:', uploadError);
          }
        }

        const userData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName,
          photoURL: photoURL || undefined
        };

        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar usuário');
          }
        } catch (dbError) {
          console.error('Erro ao salvar no banco:', dbError);
        }

        onClose();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? 'Este email já está em uso'
        : error.code === 'auth/weak-password'
        ? 'A senha deve ter pelo menos 6 caracteres'
        : error.code === 'auth/user-not-found'
        ? 'Usuário não encontrado'
        : error.code === 'auth/wrong-password'
        ? 'Senha incorreta'
        : 'Erro ao fazer login. Tente novamente.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/5 to-accent-yellow/5 opacity-50"></div>
        
        <CardHeader className="space-y-4 text-center relative z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-all"
          >
            ×
          </button>
          
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-orange to-accent-yellow rounded-lg flex items-center justify-center">
              <img 
                src="https://i.imgur.com/5OKEMhN.png" 
                alt="MineCart Store" 
                className="w-8 h-8 rounded-md"
              />
            </div>
            <span className="text-2xl font-bold text-white">MineCart Store</span>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-white">
              {isLogin ? "Entrar na sua conta" : "Criar conta"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin 
                ? "Digite suas credenciais para acessar sua conta" 
                : "Crie sua conta e comece a explorar"}
            </CardDescription>
          </div>
          
          {/* Firebase Status Indicator */}
          {!auth && (
            <div className="bg-amber-900/50 border border-amber-600/50 rounded-lg p-3 text-amber-200 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span>⚠️ Sistema em modo de desenvolvimento</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            variant="outline"
            className="w-full h-12 border-gray-300 hover:bg-gray-50 transition-smooth text-dark-safe"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLogin ? 'Entrar com Google' : 'Registrar-se com Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white-safe px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground">Foto de Perfil (opcional)</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div>
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="avatar"
                        className="cursor-pointer inline-flex items-center px-3 py-2 bg-primary-orange hover:bg-accent-yellow text-primary-foreground rounded-md text-sm transition-smooth"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Escolher Foto
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Máximo 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">Nome *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-background border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">Sobrenome *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Seu sobrenome"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-background border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-foreground">Nome de exibição *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      name="displayName"
                      type="text"
                      placeholder="Como outros verão você"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-background border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                    {displayNameStatus && (
                      <div className="absolute right-3 top-3">
                        {displayNameStatus === 'checking' && (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary-orange"></div>
                        )}
                        {displayNameStatus === 'available' && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {displayNameStatus === 'taken' && (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {displayNameStatus === 'taken' && (
                    <p className="text-red-400 text-xs">Este nome já está em uso</p>
                  )}
                  {displayNameStatus === 'available' && (
                    <p className="text-green-400 text-xs">Nome disponível!</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-background border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-background border text-foreground placeholder:text-muted-foreground"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 bg-background border text-foreground placeholder:text-muted-foreground"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-orange to-accent-yellow hover:from-laranja-alternativo hover:to-primary-orange text-white font-semibold py-3 transition-all transform hover:scale-105"
              disabled={loading || (!auth && !isLogin)}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          {isLogin && (
            <div className="text-center">
              <Button variant="link" className="text-primary-orange hover:text-accent-yellow transition-smooth text-sm">
                Esqueceu a senha?
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center relative z-10">
          <p className="text-sm text-gray-300">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary-orange hover:text-accent-yellow transition-all font-semibold"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Criar conta" : "Fazer login"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
