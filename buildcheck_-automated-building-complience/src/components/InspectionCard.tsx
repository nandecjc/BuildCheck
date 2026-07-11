import React from 'react';
import { 
  Calendar, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle, 
  Clock,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Inspection } from '../types';
import { motion } from 'motion/react';

interface InspectionCardProps {
  inspection: Inspection;
}

export default function InspectionCard({ inspection }: InspectionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-tech-success bg-tech-success/10 border-tech-success/20';
      case 'in-progress': return 'text-primary bg-primary/10 border-primary/20';
      case 'scheduled': return 'text-tech-accent bg-tech-accent/10 border-tech-accent/20';
      default: return 'text-muted-foreground bg-accent border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'in-progress': return <Activity className="w-3.5 h-3.5" />;
      case 'scheduled': return <Clock className="w-3.5 h-3.5" />;
      default: return <Calendar className="w-3.5 h-3.5" />;
    }
  };

  const typeIcons: Record<string, string> = {
    'fire-safety': '🔥',
    'structural': '🏗️',
    'electrical': '⚡',
    'hvac': '❄️',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
    >
      <Link to={`/inspections/${inspection.id}`} className="block p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${getStatusColor(inspection.status)} flex items-center gap-1.5`}>
                {getStatusIcon(inspection.status)}
                {inspection.status.replace('-', ' ')}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">ID: {inspection.id.slice(0, 8)}</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors mt-2">{inspection.title}</h3>
          </div>
          <div className="p-2 rounded-full bg-accent text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-accent">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs truncate font-medium">{inspection.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-accent">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono">{new Date(inspection.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Footer / Data Section */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            {inspection.complianceScore !== undefined && (
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Compliance</span>
                <span className={`text-sm font-mono font-bold ${inspection.complianceScore >= 90 ? 'text-tech-success' : inspection.complianceScore >= 70 ? 'text-tech-accent' : 'text-destructive'}`}>
                  {inspection.complianceScore}%
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Type</span>
              <span className="text-xs font-bold capitalize flex items-center gap-1">
                <span className="text-sm">{typeIcons[inspection.type || 'structural']}</span>
                {inspection.type?.replace('-', ' ') || 'Structural'}
              </span>
            </div>
          </div>
          
          <div className="flex -space-x-2">
            {[1, 2].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-card bg-accent flex items-center justify-center overflow-hidden">
                <img src={`https://picsum.photos/seed/${inspection.id + i}/32/32`} alt="Inspector" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
      </Link>

      {/* Hover Decorative Line */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}
