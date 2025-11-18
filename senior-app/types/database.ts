export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          birth_date: string | null
          phone: string | null
          blood_type: string | null
          address: string | null
          role: 'senior' | 'family'
          linked_senior_id: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          birth_date?: string | null
          phone?: string | null
          blood_type?: string | null
          address?: string | null
          role?: 'senior' | 'family'
          linked_senior_id?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          birth_date?: string | null
          phone?: string | null
          blood_type?: string | null
          address?: string | null
          role?: 'senior' | 'family'
          linked_senior_id?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          user_id: string
          name: string
          dosage: number
          unit: string
          frequency: string
          times: string[]
          start_date: string
          end_date: string | null
          initial_stock: number | null
          current_stock: number | null
          notes: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          dosage: number
          unit: string
          frequency: string
          times: string[]
          start_date: string
          end_date?: string | null
          initial_stock?: number | null
          current_stock?: number | null
          notes?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          dosage?: number
          unit?: string
          frequency?: string
          times?: string[]
          start_date?: string
          end_date?: string | null
          initial_stock?: number | null
          current_stock?: number | null
          notes?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      medication_logs: {
        Row: {
          id: string
          medication_id: string
          user_id: string
          scheduled_time: string
          taken_at: string | null
          status: 'pending' | 'taken' | 'skipped'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          medication_id: string
          user_id: string
          scheduled_time: string
          taken_at?: string | null
          status?: 'pending' | 'taken' | 'skipped'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          medication_id?: string
          user_id?: string
          scheduled_time?: string
          taken_at?: string | null
          status?: 'pending' | 'taken' | 'skipped'
          notes?: string | null
          created_at?: string
        }
      }
      health_records: {
        Row: {
          id: string
          user_id: string
          type: 'blood_pressure' | 'blood_sugar' | 'weight' | 'temperature' | 'heart_rate'
          value: Json
          unit: string
          notes: string | null
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'blood_pressure' | 'blood_sugar' | 'weight' | 'temperature' | 'heart_rate'
          value: Json
          unit: string
          notes?: string | null
          recorded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'blood_pressure' | 'blood_sugar' | 'weight' | 'temperature' | 'heart_rate'
          value?: Json
          unit?: string
          notes?: string | null
          recorded_at?: string
          created_at?: string
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          relation: string
          phone: string
          priority: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          relation: string
          phone: string
          priority?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          relation?: string
          phone?: string
          priority?: number
          created_at?: string
          updated_at?: string
        }
      }
      sos_alerts: {
        Row: {
          id: string
          user_id: string
          location: Json | null
          status: 'active' | 'resolved' | 'false_alarm'
          notes: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          location?: Json | null
          status?: 'active' | 'resolved' | 'false_alarm'
          notes?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          location?: Json | null
          status?: 'active' | 'resolved' | 'false_alarm'
          notes?: string | null
          created_at?: string
          resolved_at?: string | null
        }
      }
      family_links: {
        Row: {
          id: string
          senior_id: string
          family_id: string
          relation: string
          can_view_health: boolean
          can_view_location: boolean
          can_book_services: boolean
          created_at: string
        }
        Insert: {
          id?: string
          senior_id: string
          family_id: string
          relation: string
          can_view_health?: boolean
          can_view_location?: boolean
          can_book_services?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          senior_id?: string
          family_id?: string
          relation?: string
          can_view_health?: boolean
          can_view_location?: boolean
          can_book_services?: boolean
          created_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          messages: Json
          summary: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages: Json
          summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: Json
          summary?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
