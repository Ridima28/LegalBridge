import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          city: string | null;
          state: string | null;
          avatar_url: string | null;
          role: 'user' | 'lawyer' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          city?: string | null;
          state?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'lawyer' | 'admin';
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          city?: string | null;
          state?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'lawyer' | 'admin';
        };
      };
      lawyers: {
        Row: {
          id: string;
          profile_id: string;
          bar_registration_number: string | null;
          specialization: string[];
          years_experience: number;
          courts_served: string[];
          languages_spoken: string[];
          biography: string | null;
          education: string[];
          certification_urls: string[];
          office_address: string | null;
          consultation_fee: number;
          average_case_fee_min: number;
          average_case_fee_max: number;
          success_rate: number;
          is_verified: boolean;
          verification_status: 'pending' | 'verified' | 'rejected';
          availability: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          bar_registration_number?: string | null;
          specialization?: string[];
          years_experience?: number;
          courts_served?: string[];
          languages_spoken?: string[];
          biography?: string | null;
          education?: string[];
          certification_urls?: string[];
          office_address?: string | null;
          consultation_fee?: number;
          average_case_fee_min?: number;
          average_case_fee_max?: number;
          success_rate?: number;
          is_verified?: boolean;
          verification_status?: 'pending' | 'verified' | 'rejected';
          availability?: Json;
        };
        Update: {
          bar_registration_number?: string | null;
          specialization?: string[];
          years_experience?: number;
          courts_served?: string[];
          languages_spoken?: string[];
          biography?: string | null;
          education?: string[];
          certification_urls?: string[];
          office_address?: string | null;
          consultation_fee?: number;
          average_case_fee_min?: number;
          average_case_fee_max?: number;
          success_rate?: number;
          is_verified?: boolean;
          verification_status?: 'pending' | 'verified' | 'rejected';
          availability?: Json;
        };
      };
      cases: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          case_type: string;
          court_type: string | null;
          state: string | null;
          city: string | null;
          hearing_location: string | null;
          budget_min: number;
          budget_max: number;
          budget_type: string;
          preferences: Json;
          document_urls: string[];
          ai_analysis: Json;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string;
          title: string;
          description: string;
          case_type: string;
          court_type?: string | null;
          state?: string | null;
          city?: string | null;
          hearing_location?: string | null;
          budget_min?: number;
          budget_max?: number;
          budget_type?: string;
          preferences?: Json;
          document_urls?: string[];
          ai_analysis?: Json;
          status?: string;
        };
        Update: {
          title?: string;
          description?: string;
          case_type?: string;
          court_type?: string | null;
          state?: string | null;
          city?: string | null;
          hearing_location?: string | null;
          budget_min?: number;
          budget_max?: number;
          budget_type?: string;
          preferences?: Json;
          document_urls?: string[];
          ai_analysis?: Json;
          status?: string;
        };
      };
      case_lawyer_recommendations: {
        Row: {
          id: string;
          case_id: string;
          lawyer_id: string;
          recommendation_score: number;
          recommendation_reason: string | null;
          estimated_fee: number;
          created_at: string;
        };
        Insert: {
          case_id: string;
          lawyer_id: string;
          recommendation_score?: number;
          recommendation_reason?: string | null;
          estimated_fee?: number;
        };
        Update: {
          recommendation_score?: number;
          recommendation_reason?: string | null;
          estimated_fee?: number;
        };
      };
      consultations: {
        Row: {
          id: string;
          case_id: string | null;
          user_id: string;
          lawyer_id: string;
          scheduled_at: string | null;
          consultation_type: 'in-person' | 'video' | 'chat';
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
          notes: string | null;
          meeting_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          case_id?: string | null;
          user_id?: string;
          lawyer_id: string;
          scheduled_at?: string | null;
          consultation_type?: 'in-person' | 'video' | 'chat';
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
          notes?: string | null;
          meeting_url?: string | null;
        };
        Update: {
          scheduled_at?: string | null;
          consultation_type?: 'in-person' | 'video' | 'chat';
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
          notes?: string | null;
          meeting_url?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          lawyer_id: string;
          user_id: string;
          consultation_id: string | null;
          rating: number;
          review_text: string | null;
          created_at: string;
        };
        Insert: {
          lawyer_id: string;
          user_id?: string;
          consultation_id?: string | null;
          rating: number;
          review_text?: string | null;
        };
        Update: {
          rating?: number;
          review_text?: string | null;
        };
      };
      saved_lawyers: {
        Row: {
          id: string;
          user_id: string;
          lawyer_id: string;
          created_at: string;
        };
        Insert: {
          user_id?: string;
          lawyer_id: string;
        };
        Update: {};
      };
      messages: {
        Row: {
          id: string;
          consultation_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          consultation_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
        };
        Update: {
          content?: string;
          read_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          user_id?: string;
          title: string;
          message: string;
          type?: string;
          read?: boolean;
        };
        Update: {
          title?: string;
          message?: string;
          type?: string;
          read?: boolean;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
