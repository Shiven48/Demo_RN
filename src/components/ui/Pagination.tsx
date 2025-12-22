import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Colors } from '@/lib/colors';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalDocs: number;
  itemsPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  totalDocs,
  itemsPerPage,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalDocs);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-6 mb-4"
    >
      {/* Items count info */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 px-4 py-2 rounded-full border border-brand-teal/20">
          <span className="text-xs font-semibold text-gray-600">
            Showing {startItem}-{endItem} of {totalDocs} products
          </span>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Previous Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
            hasPrevPage
              ? 'bg-white border border-btn-active hover:bg-gray-50'
              : 'bg-gray-100 border border-btn-inactive cursor-not-allowed'
          }`}
        >
          <ChevronLeft
            size={20}
            color={hasPrevPage ? Colors['btn-active'] : Colors['btn-inactive']}
          />
        </motion.button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <div key={`ellipsis-${index}`} className="w-8 h-10 flex items-center justify-center">
                  <span className="text-gray-400 font-bold">...</span>
                </div>
              );
            }

            const isCurrentPage = page === currentPage;

            return (
              <motion.button
                key={page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => onPageChange(page as number)}
                className="relative overflow-hidden rounded-full shadow-sm"
              >
                {isCurrentPage ? (
                  <div className="w-10 h-10 flex items-center justify-center bg-btn-active">
                    <span className="text-white font-bold text-sm">{page}</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50">
                    <span className="text-gray-600 font-semibold text-sm">{page}</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Next Button */}
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
            hasNextPage
              ? 'bg-white border border-btn-active hover:bg-gray-50'
              : 'bg-gray-100 border border-btn-inactive cursor-not-allowed'
          }`}
        >
          <ChevronRight
            size={20}
            color={hasNextPage ? Colors['btn-active'] : Colors['btn-inactive']}
          />
        </motion.button>
      </div>

      {/* Quick Jump Info */}
      {totalPages > 5 && (
        <div className="flex justify-center mt-3">
          <span className="text-xs text-gray-400 font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </motion.div>
  );
}

