import React, { useState } from 'react';
import { Lock, Mail, User, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  onLogin: (email: string) => void;
}

type AuthView = 'login' | 'register' | 'forgot';

export default function Login({ onLogin }: LoginProps) {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (view === 'login') {
        onLogin(email);
      } else if (view === 'register') {
        alert('Account created successfully! Please login.');
        setView('login');
      } else if (view === 'forgot') {
        alert('Password reset successful! Please login with your new password.');
        setView('login');
      }
      setIsLoading(false);
    }, 1000);
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        return (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white tracking-tight">Login</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-1 relative group">
                <label className="text-sm font-medium text-white/80 ml-1">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 py-2.5 text-white focus:border-white outline-none transition-all placeholder:text-white/20 text-sm"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="space-y-1 relative group">
                <label className="text-sm font-medium text-white/80 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 py-2.5 text-white focus:border-white outline-none transition-all placeholder:text-white/20 text-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <Lock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-white uppercase tracking-wider">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded bg-transparent border-white/30 checked:bg-white transition-colors" />
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setView('forgot')}
                  className="opacity-70 hover:opacity-100 transition-opacity hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-bold py-3.5 rounded-full transition-all hover:bg-gray-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-white/50">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setView('register')}
                    className="font-bold text-white hover:underline ml-1"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          </>
        );

      case 'register':
        return (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
              <p className="text-white/50 text-sm mt-2">Join our sales analysis platform</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1 relative group">
                <label className="text-sm font-medium text-white/80 ml-1">Username</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 py-2.5 text-white focus:border-white outline-none transition-all placeholder:text-white/20 text-sm"
                    placeholder="Choose a username"
                    required
                  />
                  <User className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="space-y-1 relative group">
                <label className="text-sm font-medium text-white/80 ml-1">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 py-2.5 text-white focus:border-white outline-none transition-all placeholder:text-white/20 text-sm"
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="space-y-1 relative group">
                <label className="text-sm font-medium text-white/80 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 py-2.5 text-white focus:border-white outline-none transition-all placeholder:text-white/20 text-sm"
                    placeholder="Create a password"
                    required
                  />
                  <Lock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black font-bold py-3.5 rounded-full transition-all hover:bg-gray-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Register Now
                    </span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-white/50">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setView('login')}
                    className="font-bold text-white hover:underline ml-1"
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          </>
        );

      case 'forgot':
        return (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white tracking-tight">Reset Password</h1>
              <p className="text-white/50 text-sm mt-2">Enter your email and choose a new password</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1 relative group">
                <label className="text-sm font-medium text-white/80 ml-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 py-2.5 text-white focus:border-white outline-none transition-all placeholder:text-white/20 text-sm"
                    placeholder="Enter registered email"
                    required
                  />
                  <Mail className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="space-y-1 relative group">
                <label className="text-sm font-medium text-white/80 ml-1">New Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 py-2.5 text-white focus:border-white outline-none transition-all placeholder:text-white/20 text-sm"
                    placeholder="Enter new password"
                    required
                  />
                  <Lock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="space-y-1 relative group">
                <label className="text-sm font-medium text-white/80 ml-1">Confirm Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/30 py-2.5 text-white focus:border-white outline-none transition-all placeholder:text-white/20 text-sm"
                    placeholder="Confirm new password"
                    required
                  />
                  <Lock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  type="submit"
                  disabled={isLoading || !newPassword || newPassword !== confirmPassword}
                  className="w-full bg-white text-black font-bold py-3.5 rounded-full transition-all hover:bg-gray-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    "Save & Login"
                  )}
                </button>
                {newPassword !== confirmPassword && newPassword && confirmPassword && (
                  <p className="text-xs text-red-400 text-center font-medium">Passwords do not match</p>
                )}
                <button 
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full text-center text-xs font-bold text-white/60 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Background Neon Swirls */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] bg-emerald-600/20 blur-[100px] rounded-full animate-pulse delay-1500" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/40 rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden px-8 pt-10 pb-8 min-h-[500px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
          <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          <a href="#" className="hover:text-white/60 transition-colors">Help</a>
        </div>
      </motion.div>
    </div>
  );
}
