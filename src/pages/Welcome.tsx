import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';


export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video Placeholder (Gradient) */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, #026B73 0%, #00A9CE 50%, #025B63 100%)`,
        }}
      />

      {/* Dark Overlay Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Animated Circles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-brand-primary/30"
        />
        <motion.div
          initial={{ scale: 1, opacity: 0.2 }}
          animate={{ scale: 1.2, opacity: 0.4 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-brand-gradient-start/20"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0.15 }}
          animate={{ scale: 1.1, opacity: 0.3 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-20 -left-16 w-48 h-48 rounded-full bg-brand-highlight/25"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* Logo */}
        <Logo variant="welcome" />

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-1 flex flex-col justify-end px-8 pb-40"
        >
          <p className='text-5xl font-extrabold text-white/90 '>Hello, Welcome to</p>
          <h1
            className="text-5xl font-extrabold text-white/90 tracking-tight leading-tight"
            style={{ textShadow: '0 0 20px rgba(0,0,0,0.3)' }}
          >
            LivPrint<sup>®</sup> LABS
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mt-4">
            Your new-age orthotic partner.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-8 pb-10 flex gap-4 mb-12"
        >
          {/* Sign Up Button */}
          <button
            onClick={() => navigate('/signup')}
            className="flex-1 rounded-full overflow-hidden shadow-xl bg-brand-primary/80 backdrop-blur-md border border-white/30 hover:scale-95 transition-transform"
          >
            <div className="px-8 py-4 bg-brand-primary/20">
              <span className="text-white font-bold text-lg text-center block">Sign up</span>
            </div>
          </button>

          {/* Sign In Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex-1 rounded-full overflow-hidden border border-white/70 shadow-lg backdrop-blur-sm hover:scale-95 transition-transform"
          >
            <div className="px-8 py-4 bg-white/10">
              <span className="text-white font-bold text-lg text-center block">Sign In</span>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

