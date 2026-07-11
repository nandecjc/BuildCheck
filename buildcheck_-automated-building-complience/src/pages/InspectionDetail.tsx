import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Save, 
  FileText,
  Loader2,
  Info,
  ChevronRight,
  Plus,
  ShieldCheck,
  Activity,
  MapPin,
  Calendar,
  Zap,
  Maximize2,
  Minimize2,
  Trash2,
  MessageSquare,
  Terminal,
  ClipboardCheck
} from 'lucide-react';
import { mockDb } from '../services/localService';
import { Inspection, ChecklistItem, ChecklistStatus } from '../types';
import { analyzeVisuals } from '../services/analysisService';
import { motion, AnimatePresence } from 'motion/react';

export default function InspectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analysisProcessingId, setAnalysisProcessingId] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const inspections = await mockDb.getInspections();
        let found = inspections.find((i: any) => i.id === id);
        
        if (!found) {
          found = {
            id: id,
            title: 'New Site Inspection',
            type: 'structural',
            location: 'Pending Location',
            date: new Date().toISOString(),
            inspectorId: 'user1',
            status: 'in-progress',
            complianceScore: 0,
            items: []
          } as Inspection;
        }

        setInspection(found);

        // Initialize checklist if empty
        if (!found.items || found.items.length === 0) {
          const defaultItems: ChecklistItem[] = [];
          
          if (found.type === 'fire-safety') {
            defaultItems.push(
              { id: 'fs-1', inspectionId: id, description: 'Fire doors self-closing and latching', status: 'na', regulationRef: 'SANS 10400-T' },
              { id: 'fs-2', inspectionId: id, description: 'Fire extinguisher pressure and mounting', status: 'na', regulationRef: 'SANS 10105-1' },
              { id: 'fs-3', inspectionId: id, description: 'Emergency exit signage visibility', status: 'na', regulationRef: 'SANS 10400-T' }
            );
          } else if (found.type === 'structural') {
            defaultItems.push(
              { id: 'st-1', inspectionId: id, description: 'Load-bearing wall integrity', status: 'na', regulationRef: 'SANS 10400-H' },
              { id: 'st-2', inspectionId: id, description: 'Foundation settlement analysis', status: 'na', regulationRef: 'SANS 10400-H' },
              { id: 'st-3', inspectionId: id, description: 'Concrete cover for reinforcement', status: 'na', regulationRef: 'SANS 10100-1' }
            );
          } else if (found.type === 'electrical') {
            defaultItems.push(
              { id: 'el-1', inspectionId: id, description: 'Distribution board labeling', status: 'na', regulationRef: 'SANS 10142-1' },
              { id: 'el-2', inspectionId: id, description: 'Grounding and bonding verification', status: 'na', regulationRef: 'SANS 10142-1' },
              { id: 'el-3', inspectionId: id, description: 'Circuit breaker ratings and safety', status: 'na', regulationRef: 'SANS 10142-1' }
            );
          } else {
            defaultItems.push(
              { id: 'hv-1', inspectionId: id, description: 'Ventilation flow rate verification', status: 'na', regulationRef: 'SANS 10400-O' },
              { id: 'hv-2', inspectionId: id, description: 'Air filtration system integrity', status: 'na', regulationRef: 'SANS 10400-O' }
            );
          }
          
          setChecklist(defaultItems);
          setActiveItemId(defaultItems[0].id);
          // Save the initialized items back to the DB
          await mockDb.saveInspection({ ...found, items: defaultItems });
        } else {
          setChecklist(found.items);
          setActiveItemId(found.items[0].id);
        }
      } catch (error) {
        console.error("Error fetching inspection details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleStatusChange = (itemId: string, status: ChecklistStatus) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, status } : item
    ));
  };

  const handleNoteChange = (itemId: string, notes: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const handlePhotoUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalysisProcessingId(itemId);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      const analysisResult = await analyzeVisuals(base64, file.type);
      
      setChecklist(prev => prev.map(item => 
        item.id === itemId ? { 
          ...item, 
          photoUrl: URL.createObjectURL(file),
          defectAnalysis: analysisResult,
          status: analysisResult.toLowerCase().includes('defect') || analysisResult.toLowerCase().includes('crack') ? 'fail' : item.status
        } : item
      ));
      setAnalysisProcessingId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    if (inspection) {
      await mockDb.saveInspection({ ...inspection, items: checklist });
    }
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!inspection) return;
    if (window.confirm('Are you sure you want to delete this inspection? This action cannot be undone.')) {
      const inspections = await mockDb.getInspections();
      const filtered = inspections.filter((i: any) => i.id !== id);
      localStorage.setItem('buildcheck_inspections', JSON.stringify(filtered));
      navigate('/');
    }
  };

  const handleGenerateReport = async () => {
    const reportContent = `
BUILDCHECK INSPECTION REPORT
-------------------------
Inspection ID: ${inspection?.id}
Title: ${inspection?.title}
Location: ${inspection?.location}
Date: ${new Date(inspection?.date || '').toLocaleString()}
Status: ${inspection?.status}

COMPLIANCE SUMMARY
------------------
Total Items: ${checklist.length}
Passed: ${checklist.filter(i => i.status === 'pass').length}
Failed: ${checklist.filter(i => i.status === 'fail').length}
N/A: ${checklist.filter(i => i.status === 'na').length}

DETAILED FINDINGS
-----------------
${checklist.map(item => `
[${item.status.toUpperCase()}] ${item.description}
Ref: ${item.regulationRef}
Notes: ${item.notes || 'No notes provided'}
System Insight: ${item.defectAnalysis || 'No analysis performed'}
`).join('\n')}

Generated by BuildCheck OS v2.4
    `;

    // Save to DB
    await mockDb.saveReport({
      title: `${inspection?.title} - Compliance Report`,
      inspectionId: inspection?.id,
      content: reportContent,
      type: 'compliance',
      status: 'final'
    });

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${inspection?.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddCustomItem = () => {
    const description = window.prompt('Enter custom checklist item description:');
    if (!description) return;

    const newItem: ChecklistItem = {
      id: `custom-${Math.random().toString(36).substring(2, 6)}`,
      inspectionId: id!,
      description,
      status: 'na',
      regulationRef: 'CUSTOM'
    };

    setChecklist(prev => [...prev, newItem]);
    setActiveItemId(newItem.id);
  };

  const activeItem = checklist.find(i => i.id === activeItemId);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">Loading Inspection Data...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-6 ${isFullScreen ? 'fixed inset-0 z-[100] bg-background p-8' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-accent rounded-xl text-muted-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-mono font-bold uppercase tracking-widest rounded border border-primary/20">
                Inspection: {inspection?.id.slice(0, 8)}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                {inspection?.type?.replace('-', ' ')}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">{inspection?.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDelete}
            className="p-2.5 hover:bg-destructive/10 rounded-xl text-muted-foreground hover:text-destructive transition-colors"
            title="Delete Inspection"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2.5 hover:bg-accent rounded-xl text-muted-foreground transition-colors hidden md:block"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? 'Syncing...' : 'Sync Inspection'}
          </button>
        </div>
      </div>

      {/* Split View Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Panel: Checklist */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Checklist
            </h2>
            <button 
              onClick={handleAddCustomItem}
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Custom
            </button>
          </div>
          
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {checklist.map((item) => (
              <motion.div 
                key={item.id}
                onClick={() => setActiveItemId(item.id)}
                className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                  activeItemId === item.id 
                    ? 'bg-card border-primary shadow-lg shadow-primary/5' 
                    : 'bg-card/50 border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    item.status === 'pass' ? 'bg-tech-success/10 border-tech-success/20 text-tech-success' :
                    item.status === 'fail' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                    'bg-accent border-border text-muted-foreground'
                  }`}>
                    {item.status === 'pass' ? <ShieldCheck size={20} /> : 
                     item.status === 'fail' ? <XCircle size={20} /> : <Info size={20} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                        {item.regulationRef}
                      </span>
                      {item.photoUrl && <Camera className="w-3 h-3 text-tech-success" />}
                    </div>
                    <p className={`text-sm font-bold leading-tight truncate ${activeItemId === item.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {item.description}
                    </p>
                  </div>
                  
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${activeItemId === item.id ? 'translate-x-1 text-primary' : ''}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel: Inspection Details */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.div 
                key={activeItem.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full bg-card border border-border rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/5"
              >
                {/* Details Header */}
                <div className="p-6 border-b border-border bg-accent/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Terminal className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest">Details: {activeItem.regulationRef}</h3>
                      <p className="text-[10px] text-muted-foreground font-mono">Active Analysis Procedure</p>
                    </div>
                  </div>
                  
                  <div className="flex bg-accent p-1 rounded-xl border border-border">
                    {(['pass', 'fail', 'na'] as ChecklistStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(activeItem.id, s)}
                        className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest ${
                          activeItem.status === s 
                            ? s === 'pass' ? 'bg-tech-success text-white shadow-lg shadow-tech-success/20' :
                              s === 'fail' ? 'bg-destructive text-white shadow-lg shadow-destructive/20' :
                              'bg-muted-foreground text-white shadow-lg shadow-muted-foreground/20'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details Content */}
                <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold tracking-tight">{activeItem.description}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Verify compliance according to the South African National Standard {activeItem.regulationRef}. 
                      Ensure all visual evidence is documented for automated defect detection.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Notes Section */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Inspector Notes
                      </label>
                      <textarea 
                        value={activeItem.notes || ''}
                        onChange={(e) => handleNoteChange(activeItem.id, e.target.value)}
                        placeholder="Enter detailed observations..."
                        className="w-full h-48 p-4 bg-accent/30 border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none font-sans"
                      />
                    </div>

                    {/* Evidence Section */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Camera className="w-3 h-3" /> Visual Evidence
                      </label>
                      
                      <div className="relative h-48 border-2 border-dashed border-border rounded-2xl bg-accent/30 flex flex-col items-center justify-center group hover:border-primary/50 transition-all overflow-hidden">
                        {activeItem.photoUrl ? (
                          <div className="absolute inset-0 group">
                            <img src={activeItem.photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40">
                                <Maximize2 className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => setChecklist(prev => prev.map(i => i.id === activeItem.id ? { ...i, photoUrl: undefined, defectAnalysis: undefined } : i))}
                                className="p-2 bg-destructive/20 backdrop-blur-md rounded-full text-white hover:bg-destructive/40"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="p-4 bg-background rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                              <Camera className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Capture Evidence</p>
                            <input 
                              type="file" 
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => handlePhotoUpload(activeItem.id, e)}
                            />
                          </>
                        )}

                        {analysisProcessingId === activeItem.id && (
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                            <Loader2 className="animate-spin text-primary mb-3" size={32} />
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">System Technical Analysis...</p>
                          </div>
                        )}
                      </div>

                      {/* Analysis Insight Panel */}
                      <AnimatePresence>
                        {activeItem.defectAnalysis && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-2xl border flex gap-4 ${
                              activeItem.defectAnalysis.toLowerCase().includes('no significant defects') 
                                ? 'bg-tech-success/5 border-tech-success/20 text-tech-success' 
                                : 'bg-destructive/5 border-destructive/20 text-destructive'
                            }`}
                          >
                            <Zap className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">System Diagnostic Result</p>
                              <p className="text-xs font-medium leading-relaxed">{activeItem.defectAnalysis}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 border-t border-border bg-accent/10 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                    <span>Regulation: {activeItem.regulationRef}</span>
                    <div className="w-px h-3 bg-border" />
                    <span>Status: {activeItem.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tech-success animate-pulse" />
                    <span>Real-time Sync Active</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-card/50 border border-dashed border-border rounded-3xl">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold">No Item Selected</h3>
                <p className="text-sm text-muted-foreground">Select a checklist item from the rail to begin analysis.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Inspection Summary */}
      <div className="bg-slate-950 border border-white/10 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-xl">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Inspection Compliance Summary</h2>
            </div>
            <p className="text-sm text-white/60 max-w-xl leading-relaxed">
              Current analysis indicates a <span className="text-white font-bold">
                {Math.round((checklist.filter(i => i.status === 'pass').length / checklist.filter(i => i.status !== 'na').length) * 100)}%
              </span> pass rate. Review all failed items and system insights before generating the final certification report.
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0">
            <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Failed</p>
              <p className="text-2xl font-mono font-bold text-destructive">{checklist.filter(i => i.status === 'fail').length}</p>
            </div>
            <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">System Flags</p>
              <p className="text-2xl font-mono font-bold text-tech-accent">
                {checklist.filter(i => i.defectAnalysis && !i.defectAnalysis.toLowerCase().includes('no significant defects')).length}
              </p>
            </div>
            <button 
              onClick={handleGenerateReport}
              className="flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <FileText className="w-5 h-5" />
              Generate Report
            </button>
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl" />
      </div>
    </div>
  );
}
