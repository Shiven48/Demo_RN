import { motion } from 'framer-motion';
import { Tag, Layers, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', damping: 20 }}
      className="bg-white rounded-3xl mb-6 shadow-lg shadow-gray-200/80 overflow-hidden border border-btn-active/10"
    >
      <button
        onClick={() => navigate(`/product/${product.id}`)}
        className="w-full text-left"
      >
        {/* Image Section */}
        <div className="h-56 bg-gray-50 relative overflow-hidden">
          {/* Artistic Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F0FDFA] via-[#FCFBF1] to-[#F0FDFA]" />

          {/* Product Image */}
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Product Image Placeholder (fallback) */}
          <div 
            className={`absolute inset-0 flex items-center justify-center ${product.imageUrl ? 'hidden' : ''}`}
          >
            <div className="w-3/4 h-3/4 bg-gradient-to-br from-white/80 to-white/40 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-6xl font-bold text-brand-primary/20">
                {product.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 bg-white">
          {/* General Information */}
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-3">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {product.name} | ({product.itemCode})
              </h3>

              <div className="flex gap-2 mt-2 flex-wrap">
                <div className="bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Tag size={12} className="text-brand-primary" />
                  <span className="text-brand-primary text-xs font-bold uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
                <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Layers size={12} className="text-gray-600" />
                  <span className="text-gray-600 text-xs font-bold uppercase tracking-wide">
                    {product.productFamily}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className="bg-gray-900 p-2.5 rounded-full shadow-lg shadow-gray-900/20 hover:scale-95 transition-transform"
            >
              <ArrowRight size={16} color="#FFF" />
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mt-2 font-medium line-clamp-2">
            {product.tagline.length > 0 ? product.tagline : 'No description available'}
          </p>

          {/* Sizing Notice */}
          <div className="mt-2 bg-amber-50 rounded-lg flex items-center px-3 py-1 border border-amber-100/50">
            <Info size={12} className="text-amber-600" />
            <span className="text-amber-800 text-[11px] font-semibold ml-2">
              View last image for sizing guide
            </span>
          </div>

          {/* Colors */}
          <div className="flex mt-4 gap-1">
            {product.customization?.colors?.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 border-brand-teal/15 shadow-sm"
                style={{
                  backgroundColor: color.toLowerCase() === 'white' ? '#F3F4F6' : color.toLowerCase(),
                }}
              />
            ))}
            {product.customization?.colors?.length > 4 && (
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center border-2 border-brand-teal/15">
                <span className="text-[8px] font-bold text-brand-teal">
                  +{product.customization.colors.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}

