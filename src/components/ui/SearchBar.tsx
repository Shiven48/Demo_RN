import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '@/lib/store';
import type { Product } from '@/lib/types';
import { Colors } from '@/lib/colors';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
          setResults(searchProducts(query));
          setIsLoading(false);
        }, 300);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (product: Product) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    navigate(`/product/${product.id}`);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <div className="mx-4 mb-2 z-50 relative">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full"
        >
          <div className="flex items-center bg-btn-inactive backdrop-blur-xl border border-btn-active rounded-full px-4 py-1">
            <Search size={18} color={Colors['btn-active']} />
            <span className="flex-1 ml-3 text-txt-inactive/80 font-medium text-sm py-2.5 text-left">
              Search for a product
            </span>
          </div>
        </button>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center px-4 py-3 border-b border-gray-100">
              <button onClick={closeSearch} className="pr-2 mr-2">
                <ArrowLeft size={24} color="#374151" />
              </button>
              <div className="flex-1 flex items-center rounded-full px-4 py-2 border border-brand-teal/80">
                <Search size={18} color="#9CA3AF" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for a product"
                  className="flex-1 ml-3 text-gray-800 font-medium text-base h-10 outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query.length > 0 && !isLoading && (
                  <button onClick={() => setQuery('')}>
                    <X size={16} color="#9CA3AF" />
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-auto px-4 py-5">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center p-4 bg-gray-50 rounded-2xl">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((item) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center p-4 bg-white rounded-2xl border border-brand-teal/15 shadow-lg shadow-brand-teal/10 hover:scale-[0.99] transition-transform text-left"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 flex items-center justify-center">
                          <span className="text-2xl font-bold text-brand-primary/30">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {item.productFamily} • {item.category}
                        </p>
                      </div>
                      <ChevronRight size={20} color="#D1D5DB" />
                    </motion.button>
                  ))}
                </div>
              ) : query.length > 2 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Search size={48} color="#E5E7EB" />
                  <p className="text-gray-400 text-sm mt-4">No results found for "{query}"</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

