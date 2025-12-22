import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, Shield, ChevronRight } from 'lucide-react';
import CartItemCard from '@/components/ui/CartItemCard';
import Modal from '@/components/ui/Modal';
import { getCartItems, removeFromCart, updateCartItemQuantity, checkout } from '@/lib/store';
import type { CartItem, ModalType } from '@/lib/types';
import { Colors } from '@/lib/colors';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  // Load cart items
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCartItems(getCartItems());
      setIsLoading(false);
    }, 300);
  }, []);

  const handleRemoveItem = (cartItemId: number) => {
    setRemovingItemId(cartItemId);
    setTimeout(() => {
      removeFromCart(cartItemId);
      setCartItems(getCartItems());
      setRemovingItemId(null);
    }, 300);
  };

  const handleUpdateQuantity = (cartItemId: number, newQuantity: number) => {
    updateCartItemQuantity(cartItemId, newQuantity);
    setCartItems(getCartItems());
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setModalConfig({
        visible: true,
        type: 'warning',
        title: 'Cart Empty',
        message: 'Your cart is empty. Add some products to checkout.',
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCheckout = () => {
    setIsCheckingOut(true);
    setShowConfirmModal(false);

    setTimeout(() => {
      const orderId = checkout();
      setCartItems([]);
      setIsCheckingOut(false);
      setModalConfig({
        visible: true,
        type: 'success',
        title: 'Order Placed!',
        message: `Your order has been placed successfully! Order ID: LP_${orderId.slice(0, 8)}`,
        onConfirm: () => {
          setModalConfig((prev) => ({ ...prev, visible: false }));
          navigate('/orders');
        },
      });
    }, 1500);
  };

  const isEmpty = cartItems.length === 0;
  const totalUnits = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex-1 bg-white min-h-screen relative">
      {/* Header with Brand Gradient */}
      <div className="relative z-10 shadow-xl">
        <div
          className="rounded-b-[32px] px-6 pt-8 pb-6"
          style={{
            background: `linear-gradient(180deg, ${Colors['brand-gradient-end']} 0%, #018A9E 50%, ${Colors['brand-gradient-start']} 100%)`,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-btn-inactive">My Cart</h1>
            </div>
            <div className="bg-btn-inactive p-2.5 rounded-full border border-white/20">
              <ShoppingCart size={18} color={Colors['btn-active']} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-0">
        {isLoading ? (
          // Loading State
          <div className="px-5 pt-6 pb-40 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-5 shadow-lg">
                <div className="flex">
                  <div className="w-32 h-32 bg-gray-200 rounded-2xl" />
                  <div className="flex-1 ml-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <div className="w-12 h-6 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center px-8 py-20"
          >
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-8 shadow-sm">
              <ShoppingBag size={64} color="#D1D5DB" />
            </div>
            <h2 className="text-gray-900 font-bold text-2xl text-center">Your Cart is Empty</h2>
            <p className="text-gray-500 mt-3 text-center leading-relaxed">
              Add medical devices to your bag to proceed with your clinical order.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-10 bg-btn-active px-10 py-4 rounded-full shadow-lg hover:scale-95 transition-transform"
            >
              <span className="text-white font-extrabold tracking-wide uppercase">
                Explore the world of LivPrint®
              </span>
            </button>
          </motion.div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="px-5 pt-6 pb-48">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemoveItem(item.id)}
                  onUpdateQuantity={(qty) => handleUpdateQuantity(item.id, qty)}
                  isRemoving={removingItemId === item.id}
                />
              ))}

              {/* Order Summary Card */}
              <div className="bg-white rounded-3xl p-4 mt-4 border border-txt-inactive/20 shadow-sm">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-900 font-bold text-lg">Total Supply Units</span>
                  <span className="text-btn-active font-black text-2xl">{totalUnits}</span>
                </div>
              </div>

              {/* Clinical Assurance Box */}
              <div className="mt-8 bg-amber-50 rounded-2xl p-5 flex border border-amber-100/50">
                <div className="bg-amber-100/50 p-2 rounded-xl h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <Shield size={18} color="#D97706" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-amber-950 font-bold text-sm">Medical Order Verified</h4>
                  <p className="text-amber-800 text-xs mt-1.5 leading-relaxed font-medium">
                    Devices will be manufactured strictly following the clinical notes and sizing
                    data provided above.
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-24 left-0 right-0 bg-white/95 backdrop-blur-sm px-6 py-5 border-t border-gray-100 shadow-2xl rounded-t-3xl z-50">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full h-12 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  isCheckingOut ? 'bg-btn-inactive' : 'bg-btn-active hover:bg-gray-800'
                }`}
              >
                <span className="text-txt-active font-black text-lg tracking-widest uppercase mr-3">
                  {isCheckingOut ? 'Validating Order' : 'Checkout'}
                </span>
                {!isCheckingOut && <ChevronRight size={20} color={Colors['txt-active']} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Checkout Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        type="warning"
        title="Confirm Order"
        message={`You are about to place an order for ${totalUnits} item(s). This action cannot be undone.`}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmCheckout}
        confirmText="Place Order"
        cancelText="Cancel"
      />

      {/* Result Modal */}
      <Modal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalConfig((prev) => ({ ...prev, visible: false }))}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.onConfirm ? 'View Orders' : 'OK'}
        cancelText="Stay Here"
      />
    </div>
  );
}

