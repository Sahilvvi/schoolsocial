export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admission_forms: {
        Row: {
          created_at: string
          custom_fields: Json
          form_name: string
          id: string
          is_active: boolean
          school_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_fields?: Json
          form_name?: string
          id?: string
          is_active?: boolean
          school_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_fields?: Json
          form_name?: string
          id?: string
          is_active?: boolean
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admission_forms_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      admissions: {
        Row: {
          created_at: string
          email: string
          grade: string
          id: string
          parent_name: string
          phone: string
          school_id: string
          status: string
          student_name: string
        }
        Insert: {
          created_at?: string
          email: string
          grade: string
          id?: string
          parent_name: string
          phone: string
          school_id: string
          status?: string
          student_name: string
        }
        Update: {
          created_at?: string
          email?: string
          grade?: string
          id?: string
          parent_name?: string
          phone?: string
          school_id?: string
          status?: string
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "admissions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          attendance_date: string
          class_name: string | null
          created_at: string
          id: string
          person_name: string
          person_type: string
          remarks: string | null
          school_id: string
          status: string
        }
        Insert: {
          attendance_date?: string
          class_name?: string | null
          created_at?: string
          id?: string
          person_name: string
          person_type?: string
          remarks?: string | null
          school_id: string
          status?: string
        }
        Update: {
          attendance_date?: string
          class_name?: string | null
          created_at?: string
          id?: string
          person_name?: string
          person_type?: string
          remarks?: string | null
          school_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          module_name: string
          school_id: string
          started_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          module_name: string
          school_id: string
          started_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          module_name?: string
          school_id?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "erp_subscriptions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string
          event_date: string
          id: string
          image: string
          is_public: boolean
          location: string
          school_id: string | null
          school_name: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          image?: string
          is_public?: boolean
          location?: string
          school_id?: string | null
          school_name: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          image?: string
          is_public?: boolean
          location?: string
          school_id?: string | null
          school_name?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_records: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          fee_type: string
          id: string
          paid_date: string | null
          person_name: string
          person_type: string
          remarks: string | null
          school_id: string
          status: string
        }
        Insert: {
          amount?: number
          created_at?: string
          due_date?: string | null
          fee_type?: string
          id?: string
          paid_date?: string | null
          person_name: string
          person_type?: string
          remarks?: string | null
          school_id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          fee_type?: string
          id?: string
          paid_date?: string | null
          person_name?: string
          person_type?: string
          remarks?: string | null
          school_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_notes: {
        Row: {
          class_name: string
          created_at: string
          created_by: string
          description: string
          doc_type: string
          file_url: string | null
          id: string
          school_id: string
          subject: string
          title: string
        }
        Insert: {
          class_name?: string
          created_at?: string
          created_by?: string
          description?: string
          doc_type?: string
          file_url?: string | null
          id?: string
          school_id: string
          subject?: string
          title: string
        }
        Update: {
          class_name?: string
          created_at?: string
          created_by?: string
          description?: string
          doc_type?: string
          file_url?: string | null
          id?: string
          school_id?: string
          subject?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_notes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          created_at: string
          email: string
          experience: string
          id: string
          job_id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email: string
          experience: string
          id?: string
          job_id: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          email?: string
          experience?: string
          id?: string
          job_id?: string
          name?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string
          description: string
          id: string
          location: string
          posted_date: string
          salary: string
          school_id: string | null
          school_name: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          location?: string
          posted_date?: string
          salary?: string
          school_id?: string | null
          school_name: string
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          location?: string
          posted_date?: string
          salary?: string
          school_id?: string | null
          school_name?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string
          category: string
          created_at: string
          excerpt: string
          id: string
          image: string
          published_date: string
          title: string
        }
        Insert: {
          author?: string
          category?: string
          created_at?: string
          excerpt?: string
          id?: string
          image?: string
          published_date?: string
          title: string
        }
        Update: {
          author?: string
          category?: string
          created_at?: string
          excerpt?: string
          id?: string
          image?: string
          published_date?: string
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qr_orders: {
        Row: {
          contact_name: string
          contact_phone: string
          created_at: string
          id: string
          order_type: string
          school_id: string
          shipping_address: string
          status: string
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          order_type?: string
          school_id: string
          shipping_address?: string
          status?: string
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          order_type?: string
          school_id?: string
          shipping_address?: string
          status?: string
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_orders_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author: string
          comment: string
          created_at: string
          id: string
          rating: number
          school_id: string
          status: string
          user_id: string | null
        }
        Insert: {
          author: string
          comment: string
          created_at?: string
          id?: string
          rating: number
          school_id: string
          status?: string
          user_id?: string | null
        }
        Update: {
          author?: string
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          school_id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_schools: {
        Row: {
          created_at: string
          id: string
          school_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          school_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          school_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_schools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_owners: {
        Row: {
          created_at: string
          id: string
          role: string
          school_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          school_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          school_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_owners_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_plans: {
        Row: {
          can_post_events: boolean
          can_post_jobs: boolean
          created_at: string
          expires_at: string | null
          id: string
          is_featured: boolean
          max_admission_forms: number
          max_custom_fields: number
          max_photos: number
          physical_qr_count: number
          plan_tier: string
          priority_alerts: boolean
          school_id: string
          started_at: string
          updated_at: string
        }
        Insert: {
          can_post_events?: boolean
          can_post_jobs?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          is_featured?: boolean
          max_admission_forms?: number
          max_custom_fields?: number
          max_photos?: number
          physical_qr_count?: number
          plan_tier?: string
          priority_alerts?: boolean
          school_id: string
          started_at?: string
          updated_at?: string
        }
        Update: {
          can_post_events?: boolean
          can_post_jobs?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          is_featured?: boolean
          max_admission_forms?: number
          max_custom_fields?: number
          max_photos?: number
          physical_qr_count?: number
          plan_tier?: string
          priority_alerts?: boolean
          school_id?: string
          started_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_plans_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_views: {
        Row: {
          id: string
          school_id: string
          viewed_at: string
          viewer_ip: string | null
        }
        Insert: {
          id?: string
          school_id: string
          viewed_at?: string
          viewer_ip?: string | null
        }
        Update: {
          id?: string
          school_id?: string
          viewed_at?: string
          viewer_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_views_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          about: string
          achievements: string[]
          banner: string
          board: string
          class_fees: Json
          created_at: string
          description: string
          facilities: string[]
          fees: string
          gallery: string[]
          id: string
          is_featured: boolean
          is_verified: boolean
          lat: number
          lng: number
          location: string
          name: string
          rating: number
          review_count: number
          slug: string
          updated_at: string
        }
        Insert: {
          about?: string
          achievements?: string[]
          banner?: string
          board?: string
          class_fees?: Json
          created_at?: string
          description?: string
          facilities?: string[]
          fees?: string
          gallery?: string[]
          id?: string
          is_featured?: boolean
          is_verified?: boolean
          lat?: number
          lng?: number
          location: string
          name: string
          rating?: number
          review_count?: number
          slug: string
          updated_at?: string
        }
        Update: {
          about?: string
          achievements?: string[]
          banner?: string
          board?: string
          class_fees?: Json
          created_at?: string
          description?: string
          facilities?: string[]
          fees?: string
          gallery?: string[]
          id?: string
          is_featured?: boolean
          is_verified?: boolean
          lat?: number
          lng?: number
          location?: string
          name?: string
          rating?: number
          review_count?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      tuition_batches: {
        Row: {
          batch_name: string
          created_at: string
          current_students: number
          fee_per_month: number
          id: string
          is_active: boolean
          max_students: number
          schedule: string
          subject: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          batch_name: string
          created_at?: string
          current_students?: number
          fee_per_month?: number
          id?: string
          is_active?: boolean
          max_students?: number
          schedule?: string
          subject: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          batch_name?: string
          created_at?: string
          current_students?: number
          fee_per_month?: number
          id?: string
          is_active?: boolean
          max_students?: number
          schedule?: string
          subject?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tuition_batches_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      tuition_center_plans: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_tier: string
          started_at: string
          tutor_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_tier?: string
          started_at?: string
          tutor_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_tier?: string
          started_at?: string
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tuition_center_plans_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: true
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      tuition_enquiries: {
        Row: {
          area: string
          budget: string
          created_at: string
          email: string
          id: string
          message: string
          parent_name: string
          phone: string
          status: string
          student_class: string
          subject: string
        }
        Insert: {
          area?: string
          budget?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          parent_name: string
          phone: string
          status?: string
          student_class: string
          subject: string
        }
        Update: {
          area?: string
          budget?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          parent_name?: string
          phone?: string
          status?: string
          student_class?: string
          subject?: string
        }
        Relationships: []
      }
      tutor_bookings: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          status: string
          tutor_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          status?: string
          tutor_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          status?: string
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_bookings_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      tutors: {
        Row: {
          avatar: string
          bio: string
          created_at: string
          experience: string
          hourly_rate: string
          id: string
          location: string
          name: string
          rating: number
          subject: string
        }
        Insert: {
          avatar?: string
          bio?: string
          created_at?: string
          experience?: string
          hourly_rate?: string
          id?: string
          location?: string
          name: string
          rating?: number
          subject: string
        }
        Update: {
          avatar?: string
          bio?: string
          created_at?: string
          experience?: string
          hourly_rate?: string
          id?: string
          location?: string
          name?: string
          rating?: number
          subject?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_school_owner: {
        Args: { _school_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
