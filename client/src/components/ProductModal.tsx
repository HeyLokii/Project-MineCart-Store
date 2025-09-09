import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product, Review } from '@/types';
import ThreeViewer from './ThreeViewer';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  reviews?: Review[];
}

export default function ProductModal({ product, isOpen, onClose, reviews = [] }: ProductModalProps) {
  if (!product) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'text-accent fill-current' : 'text-gray-400'
          }`}
        />
      );
    }
    return stars;
  };

  const handlePurchase = () => {
    console.log('Purchase product:', product.id);
    // TODO: Implement purchase functionality
  };

  const handleAddToWishlist = () => {
    console.log('Add to wishlist:', product.id);
    // TODO: Implement wishlist functionality
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="minecraftia text-primary text-2xl">{product.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {product.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 3D Viewer Section */}
          <div className="space-y-4">
            <ThreeViewer modelUrl={product.modelUrl} />
            
            {/* Gallery */}
            {product.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="rounded-lg cursor-pointer hover:opacity-80 h-20 object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <div className="star-rating mr-2 flex">
                  {renderStars(Math.round(parseFloat(product.rating)))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} avaliações)
                </span>
              </div>
              <p className="text-3xl font-bold text-primary">
                R$ {parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Descrição</h4>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Categoria</h4>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm capitalize">
                {product.category}
              </span>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handlePurchase}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!product.isActive}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Comprar Agora
              </Button>
              <Button 
                onClick={handleAddToWishlist}
                variant="outline"
                className="w-full"
              >
                <Heart className="mr-2 h-4 w-4" />
                Adicionar aos Favoritos
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-8 border-t pt-8">
            <h4 className="font-semibold text-lg mb-4">Avaliações dos Usuários</h4>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-muted rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="star-rating mr-2 flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="font-medium mr-2">
                      {review.user?.displayName || 'Usuário Anônimo'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
