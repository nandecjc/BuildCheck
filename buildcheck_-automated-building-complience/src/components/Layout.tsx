import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  ShieldAlert, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  Sun,
  Moon,
  Search,
  Bell,
  Command,
  Terminal,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { mockAuth } from '../services/localService';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Update', message: 'SANS 10400-XA standards updated.', time: '2h ago', read: false },
    { id: 2, title: 'Inspection Complete', message: 'Sandton City Fire Safety synced.', time: '5h ago', read: true },
    { id: 3, title: 'Critical Alert', message: 'Durban Port Electrical failed grounding.', time: '1d ago', read: false },
  ]);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthStateChanged((localUser) => {
      if (localUser) {
        setUser(localUser as User);
      } else {
        setUser(null);
        if (location.pathname !== '/auth') {
          navigate('/auth');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    await mockAuth.signOut();
    navigate('/auth');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, description: 'Overview & Stats' },
    { name: 'Inspections', path: '/inspections', icon: ClipboardCheck, description: 'Active Inspections' },
    { name: 'SANS Library', path: '/regulations', icon: ShieldAlert, description: 'Compliance Docs' },
    { name: 'Reports', path: '/reports', icon: FileText, description: 'Generated Data' },
    { name: 'Settings', path: '/settings', icon: Settings, description: 'Preferences' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden tech-grid transition-colors duration-300">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative z-50 flex flex-col border-r border-border bg-card/50 backdrop-blur-xl shrink-0"
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <AnimatePresence mode="wait">
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-lg tracking-tight whitespace-nowrap"
                >
                  BuildCheck <span className="text-primary text-xs font-mono ml-1">v2.4</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                {isSidebarOpen && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
                    <span className={`text-[10px] whitespace-nowrap opacity-60 ${isActive ? 'text-primary-foreground' : ''}`}>
                      {item.description}
                    </span>
                  </div>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Bottom Actions */}
        <div className="p-4 border-t border-border bg-accent/30">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden text-primary font-bold">
              {user?.name?.[0]?.toUpperCase() || <UserIcon className="w-5 h-5" />}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || 'Inspector'}</p>
                <p className="text-[10px] text-muted-foreground truncate font-mono uppercase tracking-wider">
                  {user?.role || 'Field Agent'}
                </p>
              </div>
            )}
          </div>
          
          <div className={`mt-4 flex flex-col gap-1 ${isSidebarOpen ? '' : 'items-center'}`}>
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isSidebarOpen && <span className="text-xs font-medium">Switch Theme</span>}
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {isSidebarOpen && <span className="text-xs font-medium">System Exit</span>}
            </button>
          </div>
        </div>

        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-md hover:bg-accent transition-colors z-50"
        >
          {isSidebarOpen ? <X className="w-3 h-3 text-muted-foreground" /> : <Menu className="w-3 h-3 text-muted-foreground" />}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Command Bar */}
        <header className="h-16 glass flex items-center justify-between px-8 sticky top-0 z-40 border-b border-border">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative max-w-md w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search inspections, regulations, or commands (Cmd+K)..."
                onFocus={() => setShowSearch(true)}
                className="w-full bg-accent/50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-mono text-muted-foreground">
                <Command className="w-2.5 h-2.5" /> K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-tech-success/10 border border-tech-success/20">
              <div className="w-1.5 h-1.5 rounded-full bg-tech-success animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-tech-success uppercase tracking-wider">System Online</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border flex items-center justify-between bg-accent/30">
                        <h3 className="text-xs font-bold uppercase tracking-widest">Notifications</h3>
                        <button 
                          onClick={markAllRead}
                          className="text-[10px] font-bold text-primary hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto divide-y divide-border">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold">{n.title}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{n.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-accent/30 border-t border-border text-center">
                        <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">
                          View All Activity
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-px bg-border mx-2" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">Johannesburg, ZA</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-1">26.2041° S, 28.0473° E</p>
              </div>
              <Activity className="w-5 h-5 text-primary opacity-50" />
            </div>
          </div>
        </header>

        {/* Search Overlay */}
        <AnimatePresence>
          {showSearch && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSearch(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-border flex items-center gap-4">
                  <Search className="w-6 h-6 text-primary" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Type to search inspections, codes, or help..."
                    className="flex-1 bg-transparent border-none outline-none text-lg font-medium"
                  />
                  <button 
                    onClick={() => setShowSearch(false)}
                    className="p-2 hover:bg-accent rounded-xl text-muted-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 bg-accent/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Quick Results</p>
                  <div className="space-y-1">
                    {[
                      { icon: ClipboardCheck, title: 'Sandton City Fire Safety', category: 'Inspection' },
                      { icon: ShieldAlert, title: 'SANS 10400-T', category: 'Regulation' },
                      { icon: FileText, title: 'April Compliance Report', category: 'Report' },
                    ].map((res, i) => (
                      <button key={i} className="w-full flex items-center gap-4 p-3 hover:bg-card rounded-xl transition-colors text-left group">
                        <div className="p-2 bg-accent rounded-lg group-hover:text-primary transition-colors">
                          <res.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{res.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{res.category}</p>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-border bg-accent/30 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Command size={10} /> + K to close</span>
                    <span className="flex items-center gap-1">↑↓ to navigate</span>
                  </div>
                  <span>BuildCheck Search Engine v1.0</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* System Status Bar */}
        <footer className="h-8 glass border-t border-border px-6 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3" />
              <span>Session: Local_Mode_Active</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <span>Latency: 12ms</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Data Persistence: LocalStorage</span>
            <div className="w-px h-3 bg-border" />
            <span>© 2026 BuildCheck Systems</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
