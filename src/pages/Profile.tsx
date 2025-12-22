import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Box, Calendar, ChevronRight, LogOut } from 'lucide-react';
import { mockUser } from '@/lib/store';
import { Colors } from '@/lib/colors';

const menuItems = [
  { icon: Box, label: 'My Orders', route: '/orders', description: 'Track and manage your orders' },
  { icon: Calendar, label: 'Recent Events', route: '/events', description: 'Workshops and clinical seminars' },
];

export default function Profile() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // In a real app, this would call supabase.auth.signOut()
    console.log('User logged out');
    navigate('/welcome');
  };

  const userInitial = mockUser.full_name?.charAt(0) || 'U';

  return (
    <div className="flex-1 bg-white min-h-screen relative">
      {/* Branded Header */}
      <div className="relative z-10">
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-btn-active">Profile</h1>
              <p className="text-gray-400 text-xs font-bold mt-0.5">Clinical account settings</p>
            </div>
            <div className="bg-gray-100 p-2.5 rounded-full border border-gray-200">
              <User size={18} color={Colors['btn-active']} />
            </div>
          </div>
        </div>
      </div>

      {/* Background Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFB 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-0 px-6 pb-10">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-black/5 border border-gray-100">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                <span className="text-2xl font-black text-brand-primary">{userInitial}</span>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-black text-gray-900 leading-tight">
                  {mockUser.full_name || 'Medical Professional'}
                </h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                  LivPrint® Authorized
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clinical Workspace Section */}
        <div className="mb-8">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">
            Clinical Workspace
          </p>

          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => navigate(item.route)}
                className="w-full flex items-center p-4 bg-white rounded-2xl mb-3 border border-gray-100 hover:scale-[0.98] transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mr-4 border border-gray-100">
                  <Icon size={22} color={Colors['brand-primary']} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                </div>
                <ChevronRight size={20} color="#D1D5DB" />
              </motion.button>
            );
          })}
        </div>

        {/* Sign Out Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <button
            onClick={handleSignOut}
            className="w-full bg-white rounded-2xl p-5 border border-red-100 hover:bg-red-50 flex items-center justify-center transition-colors"
          >
            <LogOut size={18} color="#EF4444" className="mr-2" />
            <span className="text-red-500 font-black uppercase tracking-widest text-xs">
              Sign Out
            </span>
          </button>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-300 text-xs font-medium">LivPrint® LABS v1.0.0</p>
          <p className="text-gray-300 text-xs mt-1">© 2024 LivPrint Medical Devices</p>
        </motion.div>
      </div>
    </div>
  );
}

