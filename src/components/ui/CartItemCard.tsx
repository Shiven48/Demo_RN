import { useState } from 'react';
import { MoreVertical, Minus, Plus, Edit2, Trash2, Maximize, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '@/lib/types';
import { Colors } from '@/lib/colors';
import ColorSelector from './ColorSelector';

interface CartItemCardProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (newQuantity: number) => void;
  isRemoving?: boolean;
}

export default function CartItemCard({
  item,
  onRemove,
  onUpdateQuantity,
  isRemoving = false,
}: CartItemCardProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onUpdateQuantity(newQty);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onUpdateQuantity(newQty);
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    navigate(`/product/${item.product_id}?cart_item_id=${item.id}`);
  };

  const handleDelete = () => {
    setShowMenu(false);
    onRemove();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isRemoving ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white rounded-3xl mb-6 shadow-lg shadow-gray-200/80 overflow-hidden border border-txt-inactive/40"
    >
      <div className="flex p-5">
        {/* Product Image */}
        <div className="w-32 h-32 bg-gray-50 rounded-2xl relative overflow-hidden mr-4 border border-brand-primary/10 flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 flex items-center justify-center">
            <span className="text-4xl font-bold text-brand-primary/30">
              {item.product_name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2 mt-2">
              <h3 className="text-base font-bold text-gray-900 leading-tight truncate">
                {item.product_name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {item.features.length === 0
                  ? 'Orthotic Device'
                  : item.features.length > 1
                  ? `${item.features[0]} + ${item.features.length - 1} more...`
                  : item.features[0]}
              </p>
            </div>

            {/* Three-dot Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isRemoving}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical
                  size={20}
                  color={isRemoving ? '#D1D5DB' : '#6B7280'}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-10 bg-white rounded-xl shadow-2xl border border-gray-200 min-w-[140px] z-50"
                    >
                      <button
                        onClick={handleEdit}
                        className="flex items-center w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <Edit2 size={16} color="#149296" />
                        <span className="ml-3 text-sm font-medium text-gray-900">Edit</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-50"
                      >
                        <Trash2 size={16} color="#EF4444" />
                        <span className="ml-3 text-sm font-medium text-red-500">Delete</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Color, Size, and Side */}
          <div className="flex items-center gap-x-2 mt-2">
            <ColorSelector color={item.selected_color} size="medium" disabled />

            {item.selected_size && (
              <div className="bg-gray-100 px-2 py-1 rounded-md flex items-center border border-brand-primary/10">
                <span className="text-sm font-bold text-brand-primary">{item.selected_size}</span>
              </div>
            )}

            {item.body_side && (
              <div className="bg-gray-100 px-2 py-1 rounded-md flex items-center border border-brand-primary/10">
                <span className="text-sm font-bold text-brand-primary">{item.body_side}</span>
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="bg-btn-active/10 rounded-lg flex items-center gap-x-2 mt-2 w-fit">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="px-3 py-2 hover:bg-brand-teal/20 rounded-l-lg"
            >
              <Minus
                size={16}
                color={quantity <= 1 ? '#D1D5DB' : Colors['brand-primary']}
              />
            </button>

            <div className="px-2">
              <span className="text-sm font-bold text-brand-primary">{quantity}</span>
            </div>

            <button
              onClick={handleIncrement}
              className="px-3 py-2 hover:bg-brand-primary/10 rounded-r-lg"
            >
              <Plus size={16} color={Colors['brand-primary']} />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {(item.notes || item.sizing_notes) && (
        <div className="px-5 pb-5 pt-3 border-t border-txt-inactive/10 bg-gray-50/30">
          <div className="flex gap-4">
            {item.notes && (
              <div className={`flex-1 ${item.sizing_notes ? 'pr-4' : ''}`}>
                <div className="flex items-center mb-1.5">
                  <div className="bg-gray-200/50 p-1 rounded-md">
                    <Edit3 size={10} color={Colors['btn-active']} />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-tighter">
                    Special Instructions
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic leading-4 pl-1 line-clamp-2">
                  {item.notes}
                </p>
              </div>
            )}

            {item.notes && item.sizing_notes && (
              <div className="w-[1px] bg-gray-200 self-center h-8" />
            )}

            {item.sizing_notes && (
              <div className={`flex-1 ${item.notes ? 'pl-4' : ''}`}>
                <div className="flex items-center mb-1.5">
                  <div className="bg-amber-100/50 p-1 rounded-md">
                    <Maximize size={10} color="#D97706" />
                  </div>
                  <span className="text-[10px] font-black text-amber-700/60 uppercase ml-2 tracking-tighter">
                    Sizing Details
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic leading-4 pl-1 line-clamp-2">
                  {item.sizing_notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

