import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, ThumbsUp, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  user: {
    displayName: string;
    email: string;
    photoURL?: string;
  };
}

interface ReviewSystemProps {
  productId: number;
  userHasPurchased?: boolean;
}

// Helper function to format bytes into a human-readable string
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function ReviewSystem({ productId, userHasPurchased = false }: ReviewSystemProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); // State to control edit form visibility
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // State for the review modal
  // REMOVIDO: Estados dos modais de termos que causavam problemas


  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ['/api/reviews/product', productId],
  });

  // Check if user has purchased this product
  const { data: userOrders = [] } = useQuery({
    queryKey: ['/api/orders/user', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const response = await fetch(`/api/orders/user/${user.uid}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!user?.uid
  });

  const hasPurchased = userOrders.some((order: any) => 
    order.productId === productId && order.status === 'completed'
  ) || userHasPurchased;

  // Check if user already reviewed this product
  const userReview = reviews.find(review => 
    review.user?.email === user?.email // Compare by email
  );

  // Mutation to create a new review
  const createReviewMutation = useMutation({
    mutationFn: async (data: { productId: number; userEmail: string; rating: number; comment: string }) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar avaliação');
      }

      return response.json();
    },
    onSuccess: (newReview) => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/product', productId] });
      // Invalidate user's notifications to update the count and content
      queryClient.invalidateQueries({ queryKey: ['/api/notifications', user?.uid] });
      setRating(0);
      setComment('');
      setShowForm(false);
      toast({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi registrada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar avaliação",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Mutation to update an existing review
  const updateReviewMutation = useMutation({
    mutationFn: async (data: { reviewId: number; rating: number; comment: string }) => {
      const response = await fetch(`/api/reviews/${data.reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar avaliação');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/product', productId] });
      setShowEditForm(false);
      toast({
        title: "Avaliação atualizada!",
        description: "Sua avaliação foi modificada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar avaliação",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete a review
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete review');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/product', productId] });
      toast({
        title: "Avaliação excluída",
        description: "Sua avaliação foi removida com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir avaliação",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });


  // Mutation to mark a review as helpful
  const markHelpfulMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark as helpful');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/product', productId] });
    },
  });

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para avaliar produtos.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      productId,
      userEmail: user.email || '',
      rating,
      comment,
    });
  };

  const handleUpdateReview = () => {
    if (!userReview) return;

    updateReviewMutation.mutate({
      reviewId: userReview.id,
      rating,
      comment,
    });
  };

  const handleDeleteReview = (productId: number, userId: number) => {
    const reviewToDelete = reviews.find(r => r.userId === userId && r.productId === productId);
    if (!reviewToDelete) return;

    if (confirm('Tem certeza que deseja excluir sua avaliação?')) {
      deleteReviewMutation.mutate(reviewToDelete.id);
    }
  };


  const renderStars = (currentRating: number, interactive: boolean = false) => {
    const stars = [];
    const displayRating = interactive ? (hoveredRating || rating) : currentRating;
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = !interactive && displayRating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      let starClass = 'text-gray-400';
      if (interactive) {
        starClass = i <= displayRating ? 'text-yellow-400 fill-current' : 'text-gray-400';
      } else {
        if (i <= fullStars) {
          starClass = 'star-filled';
        } else if (i === fullStars + 1 && hasHalfStar) {
          starClass = 'star-half';
        } else {
          starClass = 'star-empty';
        }
      }

      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 transition-colors ${interactive ? 'cursor-pointer' : ''} ${starClass}`}
          onClick={interactive ? () => setRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        />
      );
    }

    return (
      <>
        {!interactive && (
          <div className="star-gradient-defs">
            <svg width="0" height="0">
              <defs>
                <linearGradient id="half-star-gradient">
                  <stop offset="50%" stopColor="#FCD34D" />
                  <stop offset="50%" stopColor="#374151" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
        {stars}
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Avaliações dos Usuários</span>
          {hasPurchased && !showForm && !userReview && (
            <Button onClick={() => setShowForm(true)} variant="outline" className="border-2 border-primary/50">
              <MessageCircle className="h-4 w-4 mr-1" />
              Avaliar Produto
            </Button>
          )}
          {userReview && (
            <Badge variant="outline" className="text-xs">
              ⭐ Avaliação enviada
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasPurchased && (
          <div className="text-center py-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              Você precisa comprar este produto para poder avaliá-lo.
            </p>
          </div>
        )}

        {userReview && hasPurchased && !showEditForm && (
          <div className="text-center py-4 bg-muted rounded-lg border border-primary">
            <p className="text-muted-foreground">
              Você já avaliou este produto com {userReview.rating} estrelas.
            </p>
            <Button onClick={() => setShowEditForm(true)} variant="outline" className="mt-2">
              Editar Avaliação
            </Button>
          </div>
        )}

        {showForm && hasPurchased && !userReview && (
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Sua Avaliação</h4>
              <div className="flex items-center space-x-1">
                {renderStars(rating, true)}
              </div>
            </div>
            <div>
              <Textarea
                placeholder="Compartilhe sua experiência com este produto..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleSubmitReview}
                disabled={createReviewMutation.isPending || rating === 0}
                className="border-2 border-primary/50"
              >
                {createReviewMutation.isPending ? 'Enviando...' : 'Enviar Avaliação'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setRating(0);
                  setComment('');
                }}
                className="border-2 border-border"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {userReview && hasPurchased && showEditForm && (
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Editar sua Avaliação</h4>
              <div className="flex items-center space-x-1">
                {renderStars(rating, true)}
              </div>
            </div>
            <div>
              <Textarea
                placeholder="Compartilhe sua experiência com este produto..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleUpdateReview}
                disabled={updateReviewMutation.isPending || rating === 0}
                className="border-2 border-primary/50"
              >
                {updateReviewMutation.isPending ? 'Atualizando...' : 'Atualizar Avaliação'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowEditForm(false);
                  setRating(0); // Reset rating when canceling edit
                  setComment(''); // Reset comment when canceling edit
                }}
                className="border-2 border-border"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* REMOVIDO: Modais de termos que estavam aparecendo no lugar das avaliações */}

        <div className="space-y-4">
          {isLoadingReviews ? (
             <div className="text-center py-8 text-muted-foreground">Carregando avaliações...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Sem avaliações ainda</p>
              <p>Você precisa comprar este produto para poder avaliá-lo.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user?.photoURL} />
                      <AvatarFallback>
                        {review.user?.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium">{review.user?.displayName || 'Usuário Anônimo'}</h5>
                        {review.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Compra Verificada
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-muted-foreground mb-3">{review.comment}</p>
                )}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markHelpfulMutation.mutate(review.id)}
                    disabled={markHelpfulMutation.isPending}
                    className="border border-border/50"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Útil ({review.helpfulCount})
                  </Button>

                  {review.userId === user?.uid && ( // User can edit/delete their own review
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setRating(review.rating);
                          setComment(review.comment || '');
                          setShowEditForm(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="border border-gray-300 hover:border-gray-400"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteReview(review.productId, review.userId)}
                        size="sm"
                        variant="destructive"
                        className="border border-red-600"
                      >
                        Excluir
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}