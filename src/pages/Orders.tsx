import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Calendar, Lock, ArrowRight } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { getOrders, cancelOrder } from '@/lib/store';
import type { Order } from '@/lib/types';
import { Colors } from '@/lib/colors';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setOrders(getOrders());
      setIsLoading(false);
    }, 300);
  }, []);

  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelModalVisible(true);
  };

  const confirmCancelOrder = () => {
    if (!selectedOrderId) return;

    setIsCancelling(true);
    setTimeout(() => {
      cancelOrder(selectedOrderId);
      setOrders(getOrders());
      setCancelModalVisible(false);
      setSelectedOrderId(null);
      setIsCancelling(false);
    }, 1000);
  };

  const isEmpty = orders.length === 0;

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'cancelled':
        return {
          bg: 'bg-red-50',
          dot: 'bg-red-500',
          text: 'text-red-700',
        };
      case 'completed':
        return {
          bg: 'bg-emerald-50',
          dot: 'bg-emerald-500',
          text: 'text-emerald-700',
        };
      default:
        return {
          bg: 'bg-amber-50',
          dot: 'bg-amber-500',
          text: 'text-amber-700',
        };
    }
  };

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
              <h1 className="text-2xl font-black text-white">My Orders</h1>
              {!isEmpty && (
                <p className="text-white/60 text-xs font-bold mt-0.5">
                  Tracking your medical procurement history
                </p>
              )}
            </div>
            <div className="bg-white/10 p-2.5 rounded-full border border-white/20">
              <Package size={18} color="#FFFFFF" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-0">
        {isLoading ? (
          // Loading State
          <div className="px-5 pt-6 pb-40 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl shadow-sm">
                <div className="px-5 py-4 border-b border-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                      <div className="h-4 bg-gray-200 rounded w-24 ml-3" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded-full w-28" />
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
            <h2 className="text-gray-900 font-bold text-2xl text-center">No Orders Yet</h2>
            <p className="text-gray-500 mt-3 text-center leading-relaxed">
              Your medical device procurement history will be logged here once you place an order.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-10 bg-btn-active px-10 py-4 rounded-full shadow-lg hover:scale-95 transition-transform flex items-center"
            >
              <span className="text-white font-extrabold tracking-wide uppercase mr-2">
                Start Browsing
              </span>
              <ArrowRight size={18} color="white" />
            </button>
          </motion.div>
        ) : (
          <div className="px-5 pt-6 pb-40">
            {orders.map((order, index) => {
              const statusStyles = getStatusStyles(order.order_status);
              const isLocked = order.order_status === 'completed' || order.order_status === 'cancelled';

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl mb-2 shadow-sm shadow-gray-200 border border-txt-inactive/20 overflow-hidden"
                >
                  {/* Status & ID Header */}
                  <div className="px-5 py-4 flex justify-between items-center border-b border-gray-50">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Order Information
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        LP_{order.id.slice(0, 8)}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full flex items-center ${statusStyles.bg}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${statusStyles.dot}`} />
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${statusStyles.text}`}>
                        {order.order_status || 'In Review'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Date & Actions */}
                  <div className="p-5 flex justify-between items-center bg-gray-50/30">
                    <div className="flex items-center">
                      <div className="bg-gray-200/50 p-1.5 rounded-lg mr-3">
                        <Calendar size={14} color={Colors['btn-active']} />
                      </div>
                      <span className="text-xs font-bold text-gray-500">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Scheduled'}
                      </span>
                    </div>

                    {isLocked ? (
                      <div className="flex items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">
                          Locked
                        </span>
                        <Lock size={12} color="#D1D5DB" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-50 px-4 py-2 rounded-full border border-red-100 flex items-center hover:scale-95 transition-transform"
                      >
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">
                          Cancel Order
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Browse Button */}
            <div className="flex justify-center py-12 border-t border-gray-100 mt-8">
              <button
                onClick={() => navigate('/')}
                className="bg-btn-active px-10 py-4 rounded-full shadow-lg hover:scale-95 transition-transform flex items-center"
              >
                <span className="text-white font-extrabold tracking-wide uppercase mr-2">
                  Explore the world of LivPrint®
                </span>
                <ArrowRight size={18} color="white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      <Modal
        visible={cancelModalVisible}
        type="warning"
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        onClose={() => {
          setCancelModalVisible(false);
          setSelectedOrderId(null);
        }}
        onConfirm={confirmCancelOrder}
        confirmText={isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
        cancelText="Keep Order"
      />
    </div>
  );
}

