
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Star, Calendar, HardDrive, FileType, Globe } from 'lucide-react';
import { useState } from 'react';

interface ProductAnalysisModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (productId: number) => void;
  onReject: (productId: number) => void;
}

export default function ProductAnalysisModal({ product, isOpen, onClose, onApprove, onReject }: ProductAnalysisModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const handleApprove = () => {
    onApprove(product.id);
    onClose();
  };

  const handleReject = () => {
    const reason = prompt("Digite o motivo da rejeição:");
    if (!reason) return;
    
    onReject(product.id);
    onClose();
  };

  const extractYouTubeId = (url: string): string => {
    if (!url) return '';
    if (url.length === 11 && !/[\/\?\&\=]/.test(url)) {
      return url;
    }
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Análise do Produto</DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Imagens e Vídeo */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="relative">
              <img
                src={product.images?.[selectedImageIndex] || product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg"
              />
              {product.discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            {/* Galeria de Imagens */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-full h-16 object-cover rounded-md cursor-pointer transition-all ${
                      selectedImageIndex === index
                        ? 'ring-2 ring-primary opacity-100'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}

            {/* Vídeo do YouTube */}
            {product.youtubeVideoId && (
              <div className="space-y-2">
                <h4 className="font-semibold">Vídeo Demonstrativo</h4>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(product.youtubeVideoId)}`}
                    title="Product Video"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Detalhes do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground capitalize">{product.category}</p>
            </div>

            {/* Preço */}
            <div className="space-y-2">
              {product.originalPrice && product.discount > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {parseFloat(product.originalPrice).toFixed(2)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    R$ {parseFloat(product.price).toFixed(2)}
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-primary">
                  R$ {parseFloat(product.price).toFixed(2)}
                </div>
              )}
            </div>

            <Tabs defaultValue="details" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="info">Informações</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Descrição</h4>
                      <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
                    </div>

                    {product.compatibility && product.compatibility.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Compatibilidade</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.compatibility.map((version: string, index: number) => (
                            <Badge key={index} variant="secondary">{version}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.features && product.features.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Características</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {product.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.tags && product.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Criado em</p>
                          <p className="font-medium">{new Date(product.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>

                      {product.fileSize && (
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Tamanho</p>
                            <p className="font-medium">{product.fileSize}</p>
                          </div>
                        </div>
                      )}

                      {product.fileType && (
                        <div className="flex items-center gap-2">
                          <FileType className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Tipo</p>
                            <p className="font-medium">{product.fileType}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Status: {product.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReject}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Rejeitar
          </Button>
          <Button 
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Aprovar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
