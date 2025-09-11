import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Sparkles, Heart } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import AdvertisementBanner from '@/components/AdvertisementBanner';
import Pagination from '@/components/Pagination';
import { useProducts } from '@/hooks/useProducts';
import { useStatistics } from '@/hooks/useStatistics';
import { Product } from '@/types';

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: products = [], isLoading, error } = useProducts();
  const { data: stats } = useStatistics();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'skins', name: 'Skins' },
    { id: 'maps', name: 'Mapas' },
    { id: 'mods', name: 'Mods' },
    { id: 'textures', name: 'Texturas' },
    { id: 'worlds', name: 'Mundos' },
  ];

  const filteredProducts = useMemo(() => {
    return products?.filter(product => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.uniqueId?.toLowerCase().includes(searchLower) ||
        product.id.toString().includes(searchQuery);

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      return matchesSearch && matchesCategory && product.isActive;
    }) || [];
  }, [products, searchQuery, selectedCategory]);

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  // Reset page quando filtros mudarem
  const handleFilterChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-destructive text-lg">Erro ao carregar produtos. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-dark-safe py-20 border-b border-highlight">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="container relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-accent bg-medium-gray text-sm text-accent-yellow backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary-orange" />
              Milhares de conteúdos únicos disponíveis
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-accent-yellow via-primary-orange to-accent-yellow bg-clip-text text-transparent">
                MineCart Store
              </span>
            </h1>

            <p className="text-lg md:text-xl text-light-safe max-w-2xl mx-auto">
              Encontre os melhores conteúdos para Minecraft: skins exclusivas, mapas épicos,
              mods incríveis e muito mais. Criado por uma comunidade apaixonada, para uma comunidade apaixonada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-orange hover:bg-laranja-alternativo text-white font-semibold border-highlight">
                <Search className="mr-2 h-5 w-5" />
                Explorar Catálogo
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation('/about')}
                     className="border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe transition-smooth">
                <Heart className="mr-2 h-5 w-5" />
                Conheça Nossa História
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-medium-gray border-t border-b border-highlight">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2 p-4 rounded-lg bg-light-gray border border-accent">
              <h3 className="text-3xl font-bold text-accent-yellow">
                {stats?.activeProducts || filteredProducts?.length || 0}
              </h3>
              <p className="text-light-safe">Produtos Ativos</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-light-gray border border-accent">
              <h3 className="text-3xl font-bold text-primary-orange">
                {stats?.totalUsers || 3}
              </h3>
              <p className="text-light-safe">Usuários</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-light-gray border border-accent">
              <h3 className="text-3xl font-bold text-accent-yellow">
                {stats?.satisfactionRate ? `${stats.satisfactionRate}%` : '0.0%'}
              </h3>
              <p className="text-light-safe">Satisfação</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-light-gray border border-accent">
              <h3 className="text-3xl font-bold text-primary-orange">
                {stats?.totalDownloads || 0}
              </h3>
              <p className="text-light-safe">Downloads Total</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-medium-gray py-6 border-b border-light-gray">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Buscar por nome, descrição ou ID..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-light-gray border-accent text-light-safe focus:border-primary-orange"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-accent-yellow" />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => handleFilterChange(category.id)}
                  className={selectedCategory === category.id
                    ? 'bg-primary-orange hover:bg-laranja-alternativo text-white border-highlight'
                    : 'border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe'
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="container mx-auto px-4 py-8 bg-dark-safe">
        <div className="mb-6 p-4 rounded-lg border-accent bg-medium-gray">
          <h3 className="text-2xl font-bold mb-2 text-accent-yellow">Produtos em Destaque</h3>
          <p className="text-light-safe">
            Descubra os melhores conteúdos para Minecraft
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-xl h-48 mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou termo de busca
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product, index) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                  {/* Show ad every 8 products */}
                  {(index + 1) % 8 === 0 && index < paginatedProducts.length - 1 && (
                    <div className="col-span-full my-6">
                      <AdvertisementBanner position="between-products" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Informações de paginação */}
            {filteredProducts.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <div className="text-sm text-light-safe">
                  Mostrando {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} produtos
                </div>
                
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}