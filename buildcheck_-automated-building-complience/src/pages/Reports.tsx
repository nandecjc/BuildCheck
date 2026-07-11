import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  Loader2,
  Zap,
  Filter,
  History
} from 'lucide-react';
import { mockDb } from '../services/localService';
import { motion, AnimatePresence } from 'motion/react';

function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await mockDb.getReports();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      await mockDb.deleteReport(id);
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDownload = (report: any) => {
    const blob = new Blob([report.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${report.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.inspectionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Accessing Archive...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Inspection Archive</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">Generated Reports</h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Access and manage all technical compliance reports generated across your inspections.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent hover:bg-accent/80 font-bold transition-all text-xs">
            <History className="w-4 h-4" />
            Sync History
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-xl shadow-black/5">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search reports by title or inspection ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-accent/30 border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                key={report.id}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {report.type}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">ID: {report.id}</span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{report.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                        <Zap className="w-3 h-3" />
                        Inspection: {report.inspectionId}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDownload(report)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 rounded-xl text-xs font-bold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button 
                    onClick={() => handleDelete(report.id)}
                    className="p-2.5 hover:bg-destructive/10 rounded-xl text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 bg-card/50 border border-dashed border-border rounded-[40px]">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">No Reports Found</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
                {searchQuery ? `No results for "${searchQuery}"` : 'Generate your first report from the inspection details to see it here.'}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-8 text-xs font-bold text-primary hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Reports;
