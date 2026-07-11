import React, { useState } from 'react';
import { X, Plus, MapPin, ClipboardCheck, Zap, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Inspection, InspectionType } from '../types';

interface NewInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inspection: Partial<Inspection>) => Promise<void>;
}

export default function NewInspectionModal({ isOpen, onClose, onSubmit }: NewInspectionModalProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<InspectionType>('structural');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        location,
        type,
        date: new Date().toISOString(),
        status: 'scheduled',
        inspectorId: 'user1',
        items: []
      });
      onClose();
    } catch (error) {
      console.error("Error creating inspection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inspectionTypes: { value: InspectionType; label: string; icon: any }[] = [
    { value: 'structural', label: 'Structural', icon: Zap },
    { value: 'fire-safety', label: 'Fire Safety', icon: Zap },
    { value: 'electrical', label: 'Electrical', icon: Zap },
    { value: 'hvac', label: 'HVAC', icon: Zap },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">New Inspection</h2>
                    <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Initialize Procedure</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Inspection Title</label>
                  <div className="relative group">
                    <ClipboardCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      autoFocus
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Sandton City Structural Audit"
                      className="w-full pl-12 pr-4 py-4 bg-accent/30 border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Inspection Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Johannesburg, South Africa"
                      className="w-full pl-12 pr-4 py-4 bg-accent/30 border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Inspection Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {inspectionTypes.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setType(t.value)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                          type === t.value 
                            ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5' 
                            : 'bg-accent/30 border-border text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        <t.icon className={`w-4 h-4 ${type === t.value ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-xs font-bold">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !title || !location}
                    className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    )}
                    {isSubmitting ? 'Initializing...' : 'Create Inspection'}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-accent/30 border-t border-border flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Auto-Scheduled: Today</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>System Ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
