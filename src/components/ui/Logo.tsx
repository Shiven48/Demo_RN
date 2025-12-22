import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'welcome' | 'brand';
  className?: string;
}

export default function Logo({ variant = 'brand', className = '' }: LogoProps) {
  // Logo path from public folder
  const logoPath = '/assets/official/logo/welcome-logo.png';
  
  if (variant === 'welcome') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`pt-16 ${className}`}
      >
        <div className="flex items-center justify-center">
          <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1">
            <img src={logoPath} className="w-full h-full object-contain" alt="LivPrint Logo" />
          </div>
        </div>
      </motion.div>
    );
  } else {
    return (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`pb-8 ${className}`}
      >
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1">
            <img src={logoPath} className="w-full h-full object-contain" alt="LivPrint Logo" />
          </div>
        </div>
      </motion.div>
    );
  }
}