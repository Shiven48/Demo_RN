import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertCircle,
  Tag,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  Info,
  Edit3,
  Maximize,
} from 'lucide-react';
import ColorSelector from '@/components/ui/ColorSelector';
import Modal from '@/components/ui/Modal';
import { getProductById, addToCart, getCartItems, updateCartItemQuantity } from '@/lib/store';
import type { Product, ModalType } from '@/lib/types';
import { Colors } from '@/lib/colors';

const CUSTOM_PRODUCT_FAMILY = 'TURTLE ORTHO';
const baseImagePath = `/assets/official/jpeg/`;

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const cartItemId = searchParams.get('cart_item_id');
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [sizingInstructions, setSizingInstructions] = useState('');
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  const isSizingAvailable = product?.productFamily?.toUpperCase().includes(CUSTOM_PRODUCT_FAMILY);
  const isEditMode = !!cartItemId;

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setTimeout(() => {
      const foundProduct = getProductById(id);
      setProduct(foundProduct || null);

      // Load existing cart item data if editing
      if (cartItemId) {
        const cartItems = getCartItems();
        const existingItem = cartItems.find((item) => item.id === parseInt(cartItemId));
        if (existingItem) {
          setSelectedSize(existingItem.selected_size);
          setSelectedColor(existingItem.selected_color);
          setSelectedSide(existingItem.body_side || null);
          setSpecialInstructions(existingItem.notes || '');
          setSizingInstructions(existingItem.sizing_notes || '');
        }
      }

      setIsLoading(false);
    }, 300);
  }, [id, cartItemId]);

  const handleAddToBag = () => {
    if (!product) return;

    // Validation
    if (product.customization.sizes.length > 0 && !selectedSize) {
      setModalConfig({
        visible: true,
        type: 'warning',
        title: 'Size Required',
        message: 'Please select a size from the dropdown.',
      });
      return;
    }

    if (isSizingAvailable && !sizingInstructions.trim()) {
      setModalConfig({
        visible: true,
        type: 'warning',
        title: 'Sizing Required',
        message: 'Custom measurements are mandatory for this product family.',
      });
      return;
    }

    if (product.customization.colors.length > 0 && !selectedColor) {
      setModalConfig({
        visible: true,
        type: 'warning',
        title: 'Color Required',
        message: 'Please select a color before adding to cart.',
      });
      return;
    }

    if (!selectedSide) {
      setModalConfig({
        visible: true,
        type: 'warning',
        title: 'Side Required',
        message: 'Please select a side (Left/Right) before adding to cart.',
      });
      return;
    }

    setIsAddingToCart(true);

    setTimeout(() => {
      if (isEditMode && cartItemId) {
        updateCartItemQuantity(parseInt(cartItemId), 1);
        // In a real app, we'd also update other fields
      } else {
        addToCart({
          user_id: 'user-1',
          product_id: parseInt(product.id),
          product_name: product.name,
          quantity: 1,
          selected_size: selectedSize!,
          selected_color: selectedColor!,
          image_url: `/assets/official/jpeg/${product.itemCode}.jpeg`,
          features: product.features || [],
          notes: specialInstructions || undefined,
          sizing_notes: sizingInstructions || undefined,
          body_side: selectedSide!,
          item_code: product.itemCode,
        });
      }

      setIsAddingToCart(false);
      setModalConfig({
        visible: true,
        type: 'success',
        title: 'Success!',
        message: isEditMode
          ? 'Cart item updated successfully!'
          : 'Product added to cart successfully!',
        onConfirm: () => {
          setModalConfig((prev) => ({ ...prev, visible: false }));
          navigate('/cart');
        },
      });
    }, 500);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollLeft;
    const containerWidth = e.currentTarget.offsetWidth;
    const index = Math.round(scrollPosition / containerWidth);
    setActiveImageIndex(index); 
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white min-h-screen">
        <AlertCircle size={64} color="#EF4444" />
        <p className="text-red-500 mt-4 font-bold text-lg">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-brand-teal px-6 py-3 rounded-full text-white font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Mock images for carousel
  // const images = [`/assets/official/jpeg/${product.itemCode}.jpeg`, ...product.images.slice(0, 2)];
  const carouselImages = [`${baseImagePath}/${product?.itemCode}.jpeg`];
  return (
    <div className="flex-1 relative bg-white min-h-screen pb-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${Colors['brand-primary']}10 0%, transparent 50%)`,
        }}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-95 transition-transform"
      >
        <ArrowLeft size={20} color="#374151" />
      </button>

      {/* Image Carousel */}
      <div className="relative group">
        <div 
          className="overflow-x-auto snap-x snap-mandatory flex hide-scrollbar h-80"
          onScroll={handleScroll}
        >
          {carouselImages.map((src, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 snap-center h-full relative"
              style={{ minWidth: '100%' }}
            >
            <img
              src={src}
              alt={`${product.name} - view ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
          
              {/* Fallback Placeholder (Hidden if image loads) */}
              <div 
                style={{ display: 'none' }} 
                className="absolute inset-0 bg-gray-100 flex-col items-center justify-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-4xl font-bold text-brand-primary/20">
                    {product.name.charAt(0)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-4 font-medium">Image not available</p>
              </div>
            </div>
          ))}
        </div>

        {carouselImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {carouselImages.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeImageIndex 
                    ? 'bg-btn-active w-6' 
                    : 'bg-white/60 w-1.5'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 pointer-events-none">
          <div className="bg-gray-900/70 backdrop-blur-md rounded-full px-3 py-1 shadow-sm">
            <span className="text-white text-[10px] font-bold">
              {activeImageIndex + 1} / {carouselImages.length}
            </span>
          </div>
          <div className="bg-white/90 border border-amber-200 rounded-full px-3 py-1 shadow-sm flex items-center">
            <Maximize size={10} className="text-amber-600" />
            <span className="text-amber-700 text-[10px] font-bold ml-1.5">
              SWIPE FOR SIZING
            </span>
          </div>
        </div>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
            <span className="text-white text-xs font-semibold">
              {activeImageIndex + 1} / {carouselImages.length}
            </span>
          </div>
          <div className="bg-white/90 border border-gray-200 rounded-full px-3 py-1.5 shadow-md flex items-center">
            <Maximize size={10} color="#D97706" />
            <span className="text-amber-700 text-[10px] font-bold ml-1.5">SIZING IN LAST PHOTO</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-5 pt-6 pb-8">
        {/* Product Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <div className="flex items-center mt-1">
            <div className="bg-gray-100 px-2 py-0.5 rounded-md">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                ID: {product.itemCode}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-4 flex-wrap">
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

          {/* Description */}
          {product.description && (
            <button onClick={() => setShowDescription(!showDescription)} className="mt-4 text-left">
              <p className="text-gray-600 leading-relaxed text-base">
                {showDescription
                  ? product.description
                  : `${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}`}
                {product.description.length > 100 && (
                  <span className="text-brand-teal font-semibold">
                    {showDescription ? ' Show less' : ' Read more'}
                  </span>
                )}
              </p>
            </button>
          )}
        </motion.div>

        {/* Select Size */}
        {product.customization?.sizes && product.customization.sizes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Select Size <span className="text-red-500">*</span>
              </h3>
            </div>

            {/* Dropdown Trigger */}
            <button
              onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
              className="w-full bg-white/60 border border-gray-300 rounded-xl px-4 py-3 flex justify-between items-center"
            >
              <span className={`text-base ${selectedSize ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                {selectedSize
                  ? product.productFamily.toUpperCase().includes(CUSTOM_PRODUCT_FAMILY)
                    ? `Size ${selectedSize}`
                    : selectedSize
                  : 'Select a size'}
              </span>
              {isSizeDropdownOpen ? (
                <ChevronUp size={20} color="#6B7280" />
              ) : (
                <ChevronDown size={20} color="#6B7280" />
              )}
            </button>

            {/* Dropdown Options */}
            {isSizeDropdownOpen && (
              <div className="mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg max-h-52 overflow-y-auto">
                {(product.productFamily.toUpperCase().includes(CUSTOM_PRODUCT_FAMILY)
                  ? Array.from({ length: 12 }, (_, i) => (i + 1).toString())
                  : product.customization.sizes
                ).map((size, index) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setIsSizeDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex justify-between items-center text-left ${
                      index !== 0 ? 'border-t border-gray-100' : ''
                    } ${selectedSize === size ? 'bg-brand-teal/10' : 'hover:bg-gray-50'}`}
                  >
                    <span
                      className={`text-base ${
                        selectedSize === size ? 'text-brand-teal font-bold' : 'text-gray-900'
                      }`}
                    >
                      {product.productFamily.toUpperCase().includes(CUSTOM_PRODUCT_FAMILY)
                        ? `Size ${size}`
                        : size}
                    </span>
                    {selectedSize === size && <Check size={18} color="#00695C" />}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Select Color */}
        {product.customization?.colors && product.customization.colors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Select Color <span className="text-red-500">*</span>
            </h3>
            <div className="flex gap-2">
              {product.customization.colors.map((color) => (
                <ColorSelector
                  key={color}
                  color={color}
                  isSelected={selectedColor?.toUpperCase() === color.toUpperCase()}
                  onPress={() => setSelectedColor(color)}
                  size="large"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Select Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8"
        >
          <h3 className="text-base font-bold text-gray-900 mb-4">
            Select Side <span className="text-red-500">*</span>
          </h3>
          <div className="flex gap-3">
            {['Left', 'Right'].map((side) => (
              <button
                key={side}
                onClick={() => setSelectedSide(side)}
                className={`flex-1 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  selectedSide === side
                    ? 'bg-btn-active border-txt-active'
                    : 'bg-btn-inactive border-txt-inactive/40'
                }`}
              >
                <span
                  className={`font-bold text-base ${
                    selectedSide === side ? 'text-txt-active' : 'text-txt-inactive'
                  }`}
                >
                  {side}
                </span>
                <span
                  className={`text-xs ml-1 ${
                    selectedSide === side ? 'text-txt-active/80' : 'text-txt-inactive/40'
                  }`}
                >
                  (Body Side)
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Special Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex items-center mb-3">
            <Edit3 size={18} color="#00695C" />
            <h3 className="text-base font-bold text-gray-900 ml-2">Special Instructions</h3>
            <span className="text-xs text-gray-500 ml-2">(Optional)</span>
          </div>

          {/* Info Box */}
          <div className="mb-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Info size={18} color="#F59E0B" />
              <span className="text-sm font-bold text-amber-900 ml-2">Instruction Examples</span>
            </div>
            <p className="text-amber-800 text-xs">• Keep the wrist immobilised and the metacarpals free</p>
            <p className="text-amber-800 text-xs">• Keep the elbow locked. But keep provision of R.O.M angle</p>
            <p className="text-amber-800 text-xs">• Cover the entire forearm (Long Splint)</p>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 shadow-sm">
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Add any custom requirements or special instructions..."
              maxLength={500}
              className="w-full text-gray-900 text-sm min-h-[100px] bg-transparent outline-none resize-none"
            />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Example: Please add extra padding on the left side
              </span>
              <span className="text-xs text-gray-400">{specialInstructions.length}/500</span>
            </div>
          </div>
        </motion.div>

        {/* Sizing Instructions (for Turtle Ortho) */}
        {isSizingAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8"
          >
            <div className="flex items-center mb-3">
              <Maximize size={18} color="#00695C" />
              <h3 className="text-base font-bold text-gray-900 ml-2">Sizing & Measurements</h3>
              <span className="text-xs text-red-500 ml-2">(Required)</span>
            </div>

            {/* Info Box */}
            <div className="mb-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle size={18} color="#F59E0B" />
                <span className="text-sm font-bold text-amber-900 ml-2">Sizing Note</span>
              </div>
              <p className="text-amber-800 text-xs">
                Please view the size chart in the product carousel photos (The last image in the carousel).
              </p>
              <p className="text-red-800 mt-2 text-xs font-bold">
                Notice: Customized measurements are mandatory for Custom Turtle Range products.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 shadow-sm">
              <textarea
                value={sizingInstructions}
                onChange={(e) => setSizingInstructions(e.target.value)}
                placeholder="Enter mandatory measurements (Length, Circumference, etc.)..."
                maxLength={500}
                className="w-full text-gray-900 text-sm min-h-[100px] bg-transparent outline-none resize-none"
              />
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Example: View the chart and enter values here
                </span>
                <span className="text-xs text-gray-400">{sizingInstructions.length}/500</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed Add to Cart Button */}
      <div className="fixed bottom-24 left-0 right-0 px-4 bg-white pt-2 pb-4">
        <button
          onClick={handleAddToBag}
          disabled={isAddingToCart}
          className={`w-full h-14 rounded-full shadow-lg transition-all flex items-center justify-center ${
            isAddingToCart ? 'bg-gray-400' : 'bg-btn-active hover:bg-gray-800'
          }`}
        >
          <span className="text-white font-bold text-base">
            {isAddingToCart
              ? isEditMode
                ? 'Updating...'
                : 'Adding...'
              : isEditMode
              ? 'Update Cart'
              : 'Add to Cart'}
          </span>
        </button>
      </div>

      {/* Modal */}
      <Modal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalConfig((prev) => ({ ...prev, visible: false }))}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.onConfirm ? 'Go to Cart' : 'OK'}
        cancelText="Stay Here"
      />
    </div>
  );
}

