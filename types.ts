export type UserRole = 'admin' | 'inspector' | 'viewer';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type InspectionType = 'fire-safety' | 'structural' | 'electrical' | 'hvac';
export type InspectionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'critical';

export interface Inspection {
  id: string;
  title: string;
  type: InspectionType;
  location: string;
  date: string;
  inspectorId: string;
  status: InspectionStatus;
  summary?: string;
  complianceScore?: number;
  items?: ChecklistItem[];
}

export type ChecklistStatus = 'pass' | 'fail' | 'na';

export interface ChecklistItem {
  id: string;
  inspectionId: string;
  description: string;
  status: ChecklistStatus;
  notes?: string;
  photoUrl?: string;
  defectAnalysis?: string;
  regulationRef?: string;
}

export interface Regulation {
  id: string;
  category: string;
  ruleText: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  code: string;
}
