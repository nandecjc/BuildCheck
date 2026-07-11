import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  BookOpen, 
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  FileText,
  Bookmark,
  History,
  ArrowUpRight,
  Command,
  Zap
} from 'lucide-react';
import { Regulation } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Regulations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const regulations: Regulation[] = [
    { id: '1', category: 'Fire Safety', ruleText: 'All fire doors must be self-closing and self-latching. Clearances must not exceed 10mm.', severity: 'critical', code: 'SANS 10400-T' },
    { id: '2', category: 'Structural', ruleText: 'Foundations must be inspected for settlement cracks exceeding 2mm in width.', severity: 'high', code: 'SANS 10400-H' },
    { id: '3', category: 'Electrical', ruleText: 'Distribution boards must be clearly labeled and accessible at all times.', severity: 'medium', code: 'SANS 10142-1' },
    { id: '4', category: 'HVAC', ruleText: 'Ventilation systems must provide a minimum of 7.5 liters per second per person.', severity: 'medium', code: 'SANS 10400-O' },
    { id: '5', category: 'Fire Safety', ruleText: 'Fire extinguishers must be mounted at a height between 1m and 1.5m from the floor.', severity: 'high', code: 'SANS 10105-1' },
    { id: '6', category: 'Structural', ruleText: 'Reinforcement steel must have a minimum concrete cover of 25mm in coastal areas.', severity: 'critical', code: 'SANS 10100-1' },
  ];

  const categories = ['All', ...new Set(regulations.map(r => r.category))];

  const filteredRegulations = regulations.filter(reg => {
    const matchesSearch = reg.ruleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reg.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reg.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || reg.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'high': return 'text-tech-accent bg-tech-accent/10 border-tech-accent/20';
      case 'medium': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-accent border-border';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Compliance Archive</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">SANS Library</h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Technical reference for South African National Standards. Search and verify building codes in real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('Checking for recent SANS updates... System is up to date.')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent/80 text-xs font-bold transition-all"
          >
            <History className="w-4 h-4" />
            Recent Updates
          </button>
          <button 
            onClick={() => alert('Accessing your bookmarked building codes...')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Bookmark className="w-4 h-4" />
            Saved Codes
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/5">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by code, category, or rule text..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-accent/30 border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded border border-border bg-card text-[10px] font-mono text-muted-foreground">
              <Command className="w-3 h-3" /> F
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRegulations.map((reg, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={reg.id} 
              className="group relative bg-card border border-border rounded-3xl p-8 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {reg.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Ref: {reg.id}</span>
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors mt-2">
                    {reg.code}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border uppercase tracking-widest ${getSeverityStyles(reg.severity)}`}>
                  {reg.severity}
                </span>
              </div>
              
              <div className="relative">
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 italic font-serif">
                  "{reg.ruleText}"
                </p>
                <div className="absolute -left-4 top-0 w-1 h-full bg-primary/20 rounded-full" />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-muted-foreground">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Compliance Level</span>
                    <span className="text-xs font-bold">Mandatory Verification</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                  Full Documentation
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                <Zap className="w-12 h-12" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredRegulations.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-32 bg-card/50 border border-dashed border-border rounded-[40px]"
        >
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">No Regulations Found</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            Your search query did not match any active SANS regulations in our archive.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-8 text-xs font-bold text-primary hover:underline"
          >
            Reset All Filters
          </button>
        </motion.div>
      )}

      {/* Technical Advisory Footer */}
      <div className="mt-12 p-8 bg-tech-accent/5 border border-tech-accent/20 rounded-[40px] flex flex-col md:flex-row items-center gap-8">
        <div className="p-4 bg-tech-accent/10 rounded-2xl">
          <AlertTriangle className="w-8 h-8 text-tech-accent" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-lg font-bold text-tech-accent mb-1">Regulatory Update Advisory</h4>
          <p className="text-sm text-tech-accent/70 leading-relaxed">
            The SANS 10400 series is subject to periodic amendments. Always verify that you are using the latest version of the standard as published by the SABS.
          </p>
        </div>
        <button 
          onClick={() => alert('Scanning SABS database for regulatory amendments... No new updates found.')}
          className="px-8 py-4 bg-tech-accent text-white font-bold rounded-2xl hover:bg-tech-accent/90 transition-all shrink-0"
        >
          Check for Updates
        </button>
      </div>
    </div>
  );
}
