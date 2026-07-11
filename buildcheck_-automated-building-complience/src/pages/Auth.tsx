import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Terminal,
  Zap,
  Activity,
  ShieldAlert,
  Command
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../services/localService';
import { motion, AnimatePresence } from 'motion/react';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await mockAuth.signIn(email, password);
      } else {
        await mockAuth.signUp(email, password, name);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("Google Sign-In is disabled in Local Mode. Please use Email/Password.");
  };

  return (
    <div className="min-h-screen bg-tech-bg text-foreground flex flex-col lg:flex-row overflow-hidden tech-grid">
      {/* Left Side: Technical Branding */}
      <div className="lg:w-1/2 relative flex flex-col justify-between p-12 lg:p-20 overflow-hidden bg-tech-bg border-r border-tech-line">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-tech-success/5 blur-[100px]" />
          
          {/* Technical Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-20"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck size={24} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">BuildCheck <span className="text-primary font-mono text-xs ml-1">v2.4</span></span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-10 uppercase">
              System <br />
              <span className="text-primary italic font-serif lowercase tracking-normal">Verification.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed font-medium border-l-2 border-primary/30 pl-6">
              Professional-grade structural compliance engine. Automated SANS verification and system-assisted defect detection.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-12 border-t border-tech-line pt-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1"
            >
              <p className="text-4xl font-mono font-bold text-white tracking-tighter">10,482</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Verified Units</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-1"
            >
              <p className="text-4xl font-mono font-bold text-tech-success tracking-tighter">99.98%</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">System Uptime</p>
            </motion.div>
          </div>
          
          <div className="mt-12 flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
              <Terminal className="w-3 h-3 text-primary" />
              <span>Auth_Procedure: Secure_Local</span>
            </div>
            <div className="w-1 h-1 bg-tech-line rounded-full" />
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
              <Activity className="w-3 h-3 text-tech-success" />
              <span>Core_Engine: Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Hardware-feel Auth Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-tech-bg relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[460px] bg-tech-card border border-tech-line rounded-[40px] p-10 lg:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Hardware Details */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
          <div className="absolute top-4 right-8 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-tech-success animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-tech-line" />
            <div className="w-1.5 h-1.5 rounded-full bg-tech-line" />
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-3 uppercase">
              {isLogin ? 'Access Portal' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground font-medium text-sm">
              {isLogin ? 'Enter credentials to authorize session.' : 'Register new inspector account.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-destructive/10 border border-destructive/20 p-4 rounded-2xl flex items-start gap-3 text-destructive text-xs font-bold"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Inspector Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Robert Smith"
                      className="w-full pl-12 pr-4 py-4 bg-tech-bg border border-tech-line rounded-2xl text-white font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Account ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@buildcheck.sys"
                  className="w-full pl-12 pr-4 py-4 bg-tech-bg border border-tech-line rounded-2xl text-white font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Access Key</label>
                {isLogin && (
                  <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
                    Recovery
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-tech-bg border border-tech-line rounded-2xl text-white font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative group overflow-hidden bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-primary/90 disabled:opacity-50 active:scale-[0.98] shadow-xl shadow-primary/20"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>{isLogin ? 'Authorize Session' : 'Register Account'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-tech-line flex flex-col items-center gap-6">
            <p className="text-xs text-muted-foreground font-medium">
              {isLogin ? "New inspector?" : "Already registered?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-black hover:underline uppercase tracking-widest ml-1"
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>

            <div className="flex items-center gap-6 opacity-30">
              <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-[0.2em]">
                <ShieldAlert size={12} />
                AES-256
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
              <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-[0.2em]">
                <Zap size={12} />
                Fast_Sync
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Decorative Corner Label */}
        <div className="absolute bottom-8 right-8 text-[10px] font-mono text-muted-foreground/20 uppercase tracking-[0.5em] vertical-rl rotate-180">
          BuildCheck_Systems_Core_v2.4
        </div>
      </div>
    </div>
  );
}

export default Auth;
