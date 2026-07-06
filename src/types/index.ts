import type { Database } from '../lib/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Lawyer = Database['public']['Tables']['lawyers']['Row'];
export type Case = Database['public']['Tables']['cases']['Row'];
export type CaseLawyerRecommendation = Database['public']['Tables']['case_lawyer_recommendations']['Row'];
export type Consultation = Database['public']['Tables']['consultations']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type SavedLawyer = Database['public']['Tables']['saved_lawyers']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];

export type LawyerWithProfile = Lawyer & {
  profiles: Profile;
  reviews: Review[];
  avg_rating?: number;
};

export type CaseWithLawyerRecommendations = Case & {
  recommendations: (CaseLawyerRecommendation & {
    lawyer: LawyerWithProfile;
  })[];
};

export type ConsultationWithLawyer = Consultation & {
  lawyer: LawyerWithProfile;
  case: Case | null;
};

export type ConsultationWithUser = Consultation & {
  profiles: Profile;
  lawyer: LawyerWithProfile;
  case: Case | null;
};

export const CASE_TYPES = [
  'Criminal',
  'Civil',
  'Family',
  'Divorce',
  'Property',
  'Corporate',
  'Consumer',
  'Employment',
  'Tax',
  'Cyber Crime',
  'Intellectual Property',
  'Immigration',
  'Banking',
  'Insurance',
  'Other',
] as const;

export const COURT_TYPES = [
  'District Court',
  'High Court',
  'Supreme Court',
  'Tribunal',
  'Consumer Court',
  'Family Court',
] as const;

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
] as const;

export const LANGUAGES = [
  'English',
  'Hindi',
  'Bengali',
  'Telugu',
  'Marathi',
  'Tamil',
  'Urdu',
  'Gujarati',
  'Kannada',
  'Malayalam',
  'Punjabi',
  'Odia',
  'Assamese',
] as const;

export type CaseType = (typeof CASE_TYPES)[number];
export type CourtType = (typeof COURT_TYPES)[number];
export type IndianState = (typeof INDIAN_STATES)[number];
export type Language = (typeof LANGUAGES)[number];

export interface CasePreferences {
  female_lawyer_preferred?: boolean;
  senior_advocate?: boolean;
  local_lawyer?: boolean;
  virtual_consultation?: boolean;
  urgent_case?: boolean;
  language_preference?: string;
  availability?: string;
}

export interface AIAnalysis {
  summary?: string;
  category?: string;
  complexity?: 'low' | 'medium' | 'high';
  suggested_strategy?: string;
  estimated_timeline?: string;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  confidence_score?: number;
  key_legal_points?: string[];
  recommended_actions?: string[];
}

export interface LawyerAvailability {
  monday?: { start: string; end: string };
  tuesday?: { start: string; end: string };
  wednesday?: { start: string; end: string };
  thursday?: { start: string; end: string };
  friday?: { start: string; end: string };
  saturday?: { start: string; end: string };
  sunday?: { start: string; end: string };
}
