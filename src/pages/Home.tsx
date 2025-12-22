import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import PillSwitch from '@/components/ui/PillSwitch';
import SearchBar from '@/components/ui/SearchBar';
import CategoryTabs from '@/components/ui/CategoryTabs';
import ProductCard from '@/components/ui/ProductCard';
import Pagination from '@/components/ui/Pagination';
import { getProducts, getCategoriesForFamily, productFamilies } from '@/lib/store';
import type { Product, PaginatedResponse } from '@/lib/types';
import { Colors } from '@/lib/colors';

export default function Home() {
  const [selectedType, setSelectedType] = useState<string>('Exo Range');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);

  // Get categories for the selected product family
  const categories = useMemo(() => getCategoriesForFamily(selectedType), [selectedType]);

  // Reset category when product family changes (if current category not in new list)
  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  // Fetch products
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    const timer = setTimeout(() => {
      try {
        const result = getProducts(currentPage, 10, selectedCategory, selectedType);
        setData(result);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, selectedCategory, selectedType]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedType]);

  const products = useMemo(() => data?.docs ?? [], [data]);

  return (
    <div className="flex-1 bg-white min-h-screen relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: 'url(/images/home-bg.jpg)',
          filter: 'blur(2px)',
        }}
      />

      {/* Header with Brand Gradient */}
      <div className="relative z-10 shadow-xl">
        <div
          className="rounded-b-[32px]"
          style={{
            background: `linear-gradient(180deg, ${Colors['brand-gradient-end']} 0%, #018A9E 50%, ${Colors['brand-gradient-start']} 100%)`,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="pt-12 pb-1">
            {/* Pill Switch */}
            <PillSwitch
              options={productFamilies}
              selected={selectedType}
              onChange={setSelectedType}
            />

            {/* Search Bar */}
            <SearchBar />

            {/* Category Tabs */}
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="relative z-0 px-5 pb-10 pt-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h2 className="text-[22px] text-btn-active">
            {selectedCategory}{' '}
            <span className="font-normal">Products</span>
          </h2>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center py-20">
            <AlertCircle size={48} color={Colors['brand-primary']} />
            <p className="mt-4 text-red-500 font-semibold">Failed to load catalog</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded-full w-24" />
                      <div className="h-6 bg-gray-200 rounded-full w-20" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="w-5 h-5 bg-gray-200 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products List */}
        {!isLoading && !error && (
          <>
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}

            {/* Pagination */}
            {products.length > 0 && data && (
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                onPageChange={setCurrentPage}
                hasNextPage={data.hasNextPage}
                hasPrevPage={data.hasPrevPage}
                totalDocs={data.totalDocs}
                itemsPerPage={10}
              />
            )}

            {/* Empty State */}
            {products.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-20"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">No Products Found</h3>
                <p className="text-gray-500 mt-2 text-center">
                  Try adjusting your filters or search terms
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

