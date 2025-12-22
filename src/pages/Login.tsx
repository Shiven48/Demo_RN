import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = email.length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      // For demo, always succeed and navigate to home
      setIsSubmitting(false);
      navigate('/');
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    // Simulate Google sign-in
    navigate('/');
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #EDF4F5 100%)',
      }}
    >
      <div className="max-w-md mx-auto px-6 pt-12 pb-20">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/welcome')}
          className="flex items-center mb-8"
        >
          <ArrowLeft size={24} color="#066F73" />
          <span className="text-brand-teal-deep font-semibold text-base ml-2">Back</span>
        </motion.button>

        {/* Progress Bar (mock) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-1 bg-gray-200 rounded-full mb-8 overflow-hidden"
        >
          <div className="h-full w-1/3 bg-brand-primary rounded-full" />
        </motion.div>

        {/* Logo */}
        <Logo />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-gray-900">Welcome back!</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </motion.div>

        {/* Social Sign-In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-black border border-gray-300 px-6 py-3 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-900 transition-colors"
          >
            <span className="text-white font-semibold text-base mr-4">Continue with Google</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 text-sm mx-4">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <div
              className={`relative border rounded-lg h-14 flex items-center ${
                focusedField === 'email'
                  ? 'border-brand-primary border-2'
                  : 'border-gray-200'
              }`}
            >
              <label className="absolute -top-2.5 left-3 px-1 bg-white text-xs text-gray-500">
                Email*
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="your.email@example.com"
                className="w-full px-4 text-base text-gray-900 outline-none bg-transparent"
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div
              className={`relative border rounded-lg h-14 flex items-center ${
                focusedField === 'password'
                  ? 'border-brand-primary border-2'
                  : 'border-gray-300'
              }`}
            >
              <label className="absolute -top-2.5 left-3 px-1 bg-white text-xs text-gray-500">
                Password*
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 text-base text-gray-900 outline-none bg-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4"
              >
                {showPassword ? (
                  <EyeOff size={20} color="gray" />
                ) : (
                  <Eye size={20} color="gray" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Sign In Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={`w-full px-6 py-4 rounded-full shadow-sm transition-all ${
              canSubmit && !isSubmitting
                ? 'bg-brand-primary hover:bg-brand-primary-dark'
                : 'bg-btn-inactive cursor-not-allowed'
            }`}
          >
            <span
              className={`font-semibold text-base ${
                canSubmit ? 'text-txt-active' : 'text-txt-inactive'
              }`}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </span>
          </motion.button>
        </form>

        {/* Forgot Password */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => {}}
          className="w-full mt-4"
        >
          <span className="text-brand-primary font-semibold">Forgot password?</span>
        </motion.button>

        {/* Signup Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full text-center mt-6"
        >
          <p className="text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-brand-primary font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

