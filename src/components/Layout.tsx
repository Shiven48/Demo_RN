import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Package, User } from 'lucide-react';
import { Colors } from '@/lib/colors';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'home', title: 'Home', icon: Home, path: '/' },
  { name: 'cart', title: 'Cart', icon: ShoppingCart, path: '/cart' },
  { name: 'orders', title: 'Orders', icon: Package, path: '/orders' },
  { name: 'profile', title: 'Profile', icon: User, path: '/profile' },
];

const INDICATOR_WIDTH = 44;

export default function Layout() {
  const location = useLocation();

  const activeIndex = navItems.findIndex((item) => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#EDF4F5] flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="relative h-16 flex items-center max-w-lg mx-auto">
          {/* Animated Indicator */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute top-0 h-[5px] bg-brand-teal-deep rounded-b-md"
              style={{ width: INDICATOR_WIDTH }}
              initial={false}
              animate={{
                left: `calc(${(activeIndex + 0.5) * (100 / navItems.length)}% - ${INDICATOR_WIDTH / 2}px)`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className="flex-1 flex flex-col items-center justify-center py-2 transition-all"
              >
                <Icon
                  size={24}
                  color={isActive ? Colors['brand-primary'] : Colors['btn-active']}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs mt-1 font-medium ${
                    isActive ? 'text-brand-primary' : 'text-btn-active'
                  }`}
                >
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </div>
        {/* Safe area padding for mobile */}
        <div className="h-8 bg-white" />
      </nav>
    </div>
  );
}

