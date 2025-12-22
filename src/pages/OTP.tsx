import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function OTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 1500);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      // Logic to resend OTP
    }
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
          onClick={() => navigate('/signup')}
          className="flex items-center mb-8"
        >
          <ArrowLeft size={24} color="#066F73" />
          <span className="text-brand-teal-deep font-semibold text-base ml-2">Back</span>
        </motion.button>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-1 bg-gray-200 rounded-full mb-8 overflow-hidden"
        >
          <div className="h-full w-full bg-brand-primary rounded-full" />
        </motion.div>

        {/* Logo */}
        <Logo />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-black text-gray-900">Verify Email</h1>
          <p className="text-gray-500 mt-2">
            Enter the 6-digit code we sent to your email address.
          </p>
        </motion.div>

        {/* OTP Input Form */}
        <form onSubmit={handleVerify}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between mb-10"
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold text-brand-primary focus:border-brand-primary outline-none bg-white shadow-sm transition-all"
              />
            ))}
          </motion.div>

          {/* Verify Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            type="submit"
            disabled={otp.join('').length < 6 || isSubmitting}
            className={`w-full px-6 py-4 rounded-full shadow-md transition-all ${
              otp.join('').length === 6 && !isSubmitting
                ? 'bg-brand-primary hover:bg-brand-primary-dark'
                : 'bg-btn-inactive cursor-not-allowed'
            }`}
          >
            <span
              className={`font-semibold text-base ${
                otp.join('').length === 6 ? 'text-txt-active' : 'text-txt-inactive'
              }`}
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
            </span>
          </motion.button>
        </form>

        {/* Resend Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className={`font-bold ${
                timer === 0 ? 'text-brand-primary hover:underline' : 'text-gray-400'
              }`}
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
