import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2; // Número de páginas ao redor da página atual
    const pages: (number | string)[] = [];
    
    // Sempre mostrar primeira página
    pages.push(1);
    
    // Adicionar ... se necessário
    if (currentPage - delta > 2) {
      pages.push('...');
    }
    
    // Páginas ao redor da atual
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Adicionar ... se necessário
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }
    
    // Sempre mostrar última página (se não for a primeira)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} role="navigation">
      {/* Botão Anterior */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Anterior
      </Button>

      {/* Números das páginas */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="flex items-center justify-center w-8 h-8 text-light-safe">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={
                currentPage === page
                  ? 'bg-primary-orange hover:bg-laranja-alternativo text-white border-highlight min-w-[2rem]'
                  : 'border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe min-w-[2rem]'
              }
            >
              {page}
            </Button>
          )
        ))}
      </div>

      {/* Botão Próximo */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="border-accent text-accent-yellow hover:bg-accent hover:text-dark-safe disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próximo
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </nav>
  );
}