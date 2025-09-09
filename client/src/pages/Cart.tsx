import { useState } from 'react';
import { Link } from 'wouter';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import CheckoutPix from '@/components/CheckoutPix';

export default function Cart() {
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const {
    cartItems,
    cartTotal,
    itemCount,
    isLoading,
    updateCart,
    removeFromCart,
    clearCart,
    isUpdating,
    isRemoving,
    isClearing
  } = useCart();

  const checkoutProducts = cartItems.map(item => ({
    id: item.product?.id || 0,
    name: item.product?.name || '',
    price: item.product?.price || '0',
    quantity: item.quantity
  }));

  // TEMPORÁRIO: Remover verificação para análise da IA
  // if (!user) {
  //   return (
  //     <div className="min-h-screen bg-background">
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="max-w-2xl mx-auto text-center">
  //           <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
  //           <h1 className="text-2xl font-bold mb-4">Acesso Necessário</h1>
  //           <p className="text-muted-foreground mb-6">
  //             Você precisa estar logado para acessar seu carrinho.
  //           </p>
  //           <div className="space-x-4">
  //             <Link href="/auth">
  //               <Button>Fazer Login</Button>
  //             </Link>
  //             <Link href="/">
  //               <Button variant="outline">Voltar ao Início</Button>
  //             </Link>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-6">
              Adicione alguns produtos incríveis do MineCart Store ao seu carrinho!
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Meu Carrinho</h1>
              <p className="text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'itens'} no seu carrinho
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => clearCart()}
              disabled={isClearing}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isClearing ? 'Limpando...' : 'Limpar Carrinho'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <img
                          src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.product?.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {item.product?.discount && item.product.discount > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-destructive text-white text-xs">
                            -{item.product.discount}%
                          </Badge>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          <Link href={`/product/${item.product?.id}`} className="hover:text-primary">
                            {item.product?.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.product?.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.product?.originalPrice && item.product.discount > 0 ? (
                            <>
                              <span className="text-lg font-bold text-primary">
                                R$ {parseFloat(item.product.price).toFixed(2)}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                R$ {parseFloat(item.product.originalPrice).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold">
                              R$ {parseFloat(item.product?.price || '0').toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCart({ cartItemId: item.id, quantity: item.quantity - 1 })}
                          disabled={item.quantity <= 1 || isUpdating}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCart({ cartItemId: item.id, quantity: item.quantity + 1 })}
                          disabled={isUpdating}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        disabled={isRemoving}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                      <span>R$ {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa de entrega</span>
                      <span className="text-green-600">Grátis</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    size="lg"
                    onClick={() => setShowCheckout(true)}
                  >
                    Finalizar Compra
                  </Button>

                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continuar Comprando
                    </Button>
                  </Link>

                  <div className="text-xs text-muted-foreground text-center pt-4">
                    <p>🔒 Compra 100% segura</p>
                    <p>Acesso imediato após pagamento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Checkout Modal */}
      <CheckoutPix
        products={checkoutProducts}
        total={cartTotal}
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={() => {
          clearCart();
          setShowCheckout(false);
        }}
      />
    </div>
  );
}