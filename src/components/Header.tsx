import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, User, ShoppingCart, Settings, LogOut, Heart, ShoppingBag, Download, Package, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge'; // Import Badge component
import NotificationSystem from '@/components/NotificationSystem'; // Assuming NotificationSystem is in this path
import { cn } from '@/lib/utils'; // Assuming cn utility is available

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation(); // Destructure setLocation
  const { user, userProfile, login, logout, isAdmin, getDisplayName, needsProfileSetup, setShowAuthModal } = useAuth();
  const { itemCount } = useCart();

  const navigation = [
    { name: 'Catálogo', href: '/' },
    { name: 'Inventário', href: '/orders' },
    { name: 'Suporte', href: '/contact' },
  ];

  const isProfileIncomplete = location === '/complete-profile';

  console.log('🔍 Header - needsProfileSetup:', needsProfileSetup, 'userProfile:', userProfile);

  const [avatarKey, setAvatarKey] = useState(0);

  // Listen for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = () => {
      setAvatarKey(prev => prev + 1);
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, []);


  return (
    <header className="sticky top-0 z-50 border-b header-dark w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between w-full">
        {/* Logo */}
        <div
          className={cn(
            "flex items-center space-x-2 cursor-pointer",
            isProfileIncomplete && "cursor-not-allowed opacity-50"
          )}
          onClick={() => {
            if (!isProfileIncomplete) {
              setLocation('/');
            }
          }}
        >
          <img
            src="https://i.imgur.com/5OKEMhN.png"
            alt="MineCart Store Logo"
            className="w-10 h-10 rounded-lg"
          />
          <h1 className="minecraftia text-primary text-xl">MineCart Store</h1>
        </div>

        {/* Navigation */}
        {!needsProfileSetup && (
          <nav className="hidden md:flex space-x-6">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                location === '/' && "text-foreground bg-accent"
              )}
            >
              Catálogo
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/about')}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                location === '/about' && "text-foreground bg-accent"
              )}
            >
              Sobre
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/contact')}
              className={cn(
                "text-muted-foreground hover:text-foreground",
                location === '/contact' && "text-foreground bg-accent"
              )}
            >
              Contato
            </Button>
          </nav>
        )}

        {/* Profile completion message */}
        {user && needsProfileSetup && (
          <div className="hidden md:flex items-center">
            <p className="text-sm text-muted-foreground">
              Complete seu perfil para continuar
            </p>
          </div>
        )}

        {/* Auth Buttons - Hidden on mobile */}
        {!user && (
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="btn-secondary"
              onClick={() => setShowAuthModal(true)}
            >
              <User className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          </div>
        )}


        {/* User Menu */}
        {user && !needsProfileSetup && (
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setLocation('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Notifications Button */}
            <NotificationSystem />

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar key={avatarKey} className="h-8 w-8">
                    <AvatarImage src={userProfile?.avatarUrl || userProfile?.photoURL} alt={getDisplayName()} />
                    <AvatarFallback>{getDisplayName().charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/80 backdrop-blur-sm border border-border/50">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile?.displayName || user.displayName || 'Usuário'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation('/profile')} className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/orders')} className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Inventário</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/favorites')} className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favoritos</span>
                </DropdownMenuItem>
                {isAdmin() && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLocation('/admin')} className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Administração</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Perfil incompleto - apenas botão de logout */}
        {user && needsProfileSetup && (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        )}

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden ml-2">
            <Button variant="ghost" size="icon" className="text-light-safe hover:text-accent-yellow">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="flex flex-col space-y-4 mt-8">
              <h2 className="minecraftia text-primary text-lg mb-4">Menu</h2>

              {navigation.map((item) => (
                <div
                  key={item.name}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md transition-colors cursor-pointer",
                    location === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:text-primary hover:bg-muted",
                    isProfileIncomplete && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={(e) => {
                    if (!isProfileIncomplete) {
                      setLocation(item.href);
                      setIsOpen(false);
                    }
                  }}
                >
                  {item.name}
                </div>
              ))}

              {isAdmin() && (
                <Link href="/admin">
                  <span
                    className="block py-3 px-4 hover:bg-muted rounded-lg transition-colors minecraft-orange font-medium cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </span>
                </Link>
              )}

              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 py-3 px-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || undefined} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.displayName || user.email}</span>
                  </div>

                  <div className="space-y-2">
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-light-safe sidebar-menu-button mobile-menu-button ripple-effect"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Meu Perfil</span>
                      </Button>
                    </Link>

                    {isAdmin() && (
                      <>
                        <Link href="/admin">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-light-safe sidebar-menu-button mobile-menu-button ripple-effect"
                            onClick={() => setIsOpen(false)}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Button>
                        </Link>

                        <Link href="/admin/support">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-light-safe sidebar-menu-button mobile-menu-button ripple-effect"
                            onClick={() => setIsOpen(false)}
                          >
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Admin Suporte</span>
                          </Button>
                        </Link>

                        <Link href="/admin/settings">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-light-safe sidebar-menu-button mobile-menu-button ripple-effect"
                            onClick={() => setIsOpen(false)}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Configurações</span>
                          </Button>
                        </Link>
                      </>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full bg-primary-orange hover:bg-accent-yellow text-white font-medium mt-4"
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}