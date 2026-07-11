
// Local Storage Service for Auth and Data
// This replaces Firebase for a "No-Setup" experience

const STORAGE_KEYS = {
  USERS: 'buildcheck_users',
  CURRENT_USER: 'buildcheck_current_user',
  INSPECTIONS: 'buildcheck_inspections',
  REGULATIONS: 'buildcheck_regulations',
  REPORTS: 'buildcheck_reports'
};

// Helper to get data from localStorage
const get = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const set = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const mockAuth = {
  currentUser: JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'),
  
  signIn: async (email: string, pass: string) => {
    const users = get(STORAGE_KEYS.USERS);
    const user = users.find((u: any) => u.email === email && u.password === pass);
    if (!user) throw new Error('Invalid email or password');
    
    const sessionUser = { uid: user.uid, email: user.email, displayName: user.displayName };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    return sessionUser;
  },
  
  signUp: async (email: string, pass: string, name: string) => {
    const users = get(STORAGE_KEYS.USERS);
    if (users.find((u: any) => u.email === email)) throw new Error('Email already exists');
    
    const newUser = { uid: Math.random().toString(36).substr(2, 9), email, password: pass, displayName: name };
    users.push(newUser);
    set(STORAGE_KEYS.USERS, users);
    
    const sessionUser = { uid: newUser.uid, email: newUser.email, displayName: newUser.displayName };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    return sessionUser;
  },
  
  signOut: async () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  onAuthStateChanged: (callback: (user: any) => void) => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    callback(user);
    return () => {}; // Unsubscribe mock
  }
};

export const mockDb = {
  getInspections: async () => {
    const data = get(STORAGE_KEYS.INSPECTIONS);
    if (data.length === 0) {
      const initial = [
        { 
          id: 'ins-7721', 
          title: 'Sandton City Fire Safety', 
          type: 'fire-safety', 
          location: 'Sandton, Johannesburg', 
          date: new Date().toISOString(), 
          status: 'in-progress', 
          complianceScore: 75 
        },
        { 
          id: 'ins-8832', 
          title: 'Cape Town Port Structural', 
          type: 'structural', 
          location: 'Table Bay, Cape Town', 
          date: new Date(Date.now() - 86400000).toISOString(), 
          status: 'completed', 
          complianceScore: 92 
        },
        { 
          id: 'ins-9943', 
          title: 'Durban North Electrical Grid', 
          type: 'electrical', 
          location: 'Umhlanga, Durban', 
          date: new Date(Date.now() - 172800000).toISOString(), 
          status: 'critical', 
          complianceScore: 45 
        }
      ];
      set(STORAGE_KEYS.INSPECTIONS, initial);
      return initial;
    }
    return data;
  },
  
  saveInspection: async (inspection: any) => {
    const inspections = get(STORAGE_KEYS.INSPECTIONS);
    const index = inspections.findIndex((i: any) => i.id === inspection.id);
    if (index > -1) {
      inspections[index] = inspection;
    } else {
      inspections.push({ ...inspection, id: inspection.id || `ins-${Math.random().toString(36).substr(2, 4)}` });
    }
    set(STORAGE_KEYS.INSPECTIONS, inspections);
    return inspection;
  },

  getRegulations: async () => {
    const regs = get(STORAGE_KEYS.REGULATIONS);
    if (regs.length === 0) {
      const initialRegs = [
        { id: '1', category: 'Fire Safety', ruleText: 'All fire doors must be self-closing and self-latching. Clearances must not exceed 10mm.', severity: 'critical', code: 'SANS 10400-T' },
        { id: '2', category: 'Structural', ruleText: 'Foundations must be inspected for settlement cracks exceeding 2mm in width.', severity: 'high', code: 'SANS 10400-H' },
        { id: '3', category: 'Electrical', ruleText: 'Distribution boards must be clearly labeled and accessible at all times.', severity: 'medium', code: 'SANS 10142-1' }
      ];
      set(STORAGE_KEYS.REGULATIONS, initialRegs);
      return initialRegs;
    }
    return regs;
  },

  getReports: async () => {
    return get(STORAGE_KEYS.REPORTS);
  },

  saveReport: async (report: any) => {
    const reports = get(STORAGE_KEYS.REPORTS);
    const newReport = { 
      ...report, 
      id: `rep-${Math.random().toString(36).substr(2, 4)}`, 
      createdAt: new Date().toISOString() 
    };
    reports.unshift(newReport);
    set(STORAGE_KEYS.REPORTS, reports);
    return newReport;
  },

  deleteReport: async (id: string) => {
    const reports = get(STORAGE_KEYS.REPORTS);
    const filtered = reports.filter((r: any) => r.id !== id);
    set(STORAGE_KEYS.REPORTS, filtered);
  }
};
