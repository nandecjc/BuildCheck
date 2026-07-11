import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardCheck,
  ShieldAlert,
  Zap,
  BarChart3,
  Target,
  History,
  ChevronRight,
  Activity,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import InspectionCard from '../components/InspectionCard';
import NewInspectionModal from '../components/NewInspectionModal';
import { Inspection } from '../types';
import { mockDb } from '../services/localService';

export default function Dashboard() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const data = await mockDb.getInspections();
        if (data.length === 0) {
          const initialData: Inspection[] = [
            {
              id: 'ins-7721',
              title: 'Sandton City Fire Safety',
              type: 'fire-safety',
              location: 'Sandton, Johannesburg',
              date: new Date().toISOString(),
              inspectorId: 'user1',
              status: 'in-progress',
              complianceScore: 75,
              items: []
            },
            {
              id: 'ins-8832',
              title: 'Cape Town Stadium Structural',
              type: 'structural',
              location: 'Green Point, Cape Town',
              date: new Date(Date.now() - 86400000).toISOString(),
              inspectorId: 'user1',
              status: 'completed',
              complianceScore: 92,
              items: []
            },
            {
              id: 'ins-9943',
              title: 'Durban Port Electrical',
              type: 'electrical',
              location: 'Point, Durban',
              date: new Date(Date.now() + 86400000).toISOString(),
              inspectorId: 'user1',
              status: 'scheduled',
              items: []
            }
          ];
          setInspections(initialData);
          for (const item of initialData) {
            await mockDb.saveInspection(item);
          }
        } else {
          setInspections(data);
        }
      } catch (error) {
        console.error("Error fetching inspections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, []);

  const handleCreateInspection = async (data: Partial<Inspection>) => {
    const newId = `ins-${Math.random().toString(36).substr(2, 4)}`;
    const newInspection: Inspection = {
      id: newId,
      title: data.title || 'New Site Inspection',
      type: data.type || 'structural',
      location: data.location || 'Pending Location',
      date: data.date || new Date().toISOString(),
      inspectorId: data.inspectorId || 'user1',
      status: data.status || 'scheduled',
      items: []
    };
    
    await mockDb.saveInspection(newInspection);
    navigate(`/inspections/${newId}`);
  };

  const filteredInspections = inspections.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Inspections', value: '124', change: '+12%', trend: 'up', icon: ClipboardCheck, color: 'primary' },
    { label: 'Compliance Rate', value: '88%', change: '+3%', trend: 'up', icon: TrendingUp, color: 'tech-success' },
    { label: 'Critical Fail', value: '7', change: '-2', trend: 'down', icon: AlertTriangle, color: 'destructive' },
    { label: 'Pending Queue', value: '12', change: '+4', trend: 'up', icon: Clock, color: 'tech-accent' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section / Bento Grid Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Action Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/20 group"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2 py-1 bg-white/20 rounded text-[10px] font-mono font-bold uppercase tracking-widest">Active Status</div>
                <div className="w-2 h-2 rounded-full bg-tech-success animate-pulse" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-none">
                Ready for the next <br />
                <span className="text-white/80 italic font-serif">Site Verification?</span>
              </h1>
              <p className="text-primary-foreground/70 max-w-md text-sm mb-8 leading-relaxed">
                Launch a new inspection to verify structural compliance and safety standards in real-time.
              </p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 w-fit shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Initialize New Inspection
            </button>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
            <Zap className="w-48 h-48" />
          </div>
        </motion.div>

        {/* System Health / Stats Bento */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-6 rounded-3xl flex flex-col justify-between hover:border-primary/50 transition-colors group"
            >
              <div className={`p-2 bg-${stat.color}/10 rounded-xl w-fit group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-mono font-bold">{stat.value}</p>
                  <div className={`flex items-center gap-0.5 text-[10px] font-bold ${stat.trend === 'up' ? 'text-tech-success' : 'text-destructive'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Recent Activity List */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">Recent Inspections</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter inspections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-accent/50 border-none rounded-full pl-9 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 transition-all outline-none w-48"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-accent rounded-full text-muted-foreground"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <button 
                onClick={() => navigate('/reports')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View Archive <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-card/50 border border-border animate-pulse rounded-3xl" />
              ))
            ) : filteredInspections.length > 0 ? (
              filteredInspections.slice(0, 6).map((inspection) => (
                <motion.div key={inspection.id} variants={item}>
                  <InspectionCard inspection={inspection} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-card/50 border border-dashed border-border rounded-3xl">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold">No Inspections Found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? `No results for "${searchQuery}"` : 'Initialize your first inspection to begin tracking.'}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-xs font-bold text-primary hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Target Progress */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Monthly Target</h3>
              </div>
              <span className="text-xs font-mono font-bold text-primary">78%</span>
            </div>
            
            <div className="space-y-4">
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                You have completed <span className="text-foreground font-bold">34 of 45</span> scheduled inspections for April 2026.
              </p>
            </div>
          </motion.div>

          {/* Quick Compliance Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-3xl p-6"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Compliance Feed</h3>
            <div className="space-y-4">
              {[
                { label: 'SANS 10400-T', status: 'Updated', time: '2h ago' },
                { label: 'Fire Safety Regs', status: 'Review', time: '5h ago' },
                { label: 'Structural Code', status: 'Stable', time: '1d ago' },
              ].map((feed, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold group-hover:text-primary transition-colors">{feed.label}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{feed.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-accent rounded uppercase">{feed.status}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Alert */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-tech-accent/10 border border-tech-accent/20 rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-tech-accent" />
                <h3 className="text-sm font-bold text-tech-accent uppercase tracking-wider">Tech Advisory</h3>
              </div>
              <p className="text-[10px] text-tech-accent/80 leading-relaxed">
                New SANS 10400-XA energy efficiency requirements take effect in 14 days. Ensure all active inspections account for the new glazing standards.
              </p>
            </div>
            <ShieldAlert className="absolute -right-4 -bottom-4 text-tech-accent/10 w-24 h-24" />
          </motion.div>

          {/* Real-time Activity */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-tech-success" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Live Activity</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-tech-success mt-1.5" />
                <p className="text-[10px] text-muted-foreground">
                  <span className="text-foreground font-bold">System</span> synchronized with local storage.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                <p className="text-[10px] text-muted-foreground">
                  <span className="text-foreground font-bold">Analysis Engine</span> ready for defect analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewInspectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateInspection}
      />
    </div>
  );
}
