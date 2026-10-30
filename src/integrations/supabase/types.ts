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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      franchise_applications: {
        Row: {
          applicant: string
          code: string
          created_at: string
          id: string
          investment_cents: number
          status: string
          submitted_at: string
          territory: string
          updated_at: string
        }
        Insert: {
          applicant: string
          code: string
          created_at?: string
          id?: string
          investment_cents?: number
          status?: string
          submitted_at?: string
          territory: string
          updated_at?: string
        }
        Update: {
          applicant?: string
          code?: string
          created_at?: string
          id?: string
          investment_cents?: number
          status?: string
          submitted_at?: string
          territory?: string
          updated_at?: string
        }
        Relationships: []
      }
      franchise_escalations: {
        Row: {
          created_at: string
          franchise_id: string | null
          id: string
          issue: string
          opened_at: string
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          franchise_id?: string | null
          id?: string
          issue: string
          opened_at?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          franchise_id?: string | null
          id?: string
          issue?: string
          opened_at?: string
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_escalations_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_royalties: {
        Row: {
          created_at: string
          due_date: string
          franchise_id: string | null
          gross_cents: number
          id: string
          period: string
          royalty_cents: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_date?: string
          franchise_id?: string | null
          gross_cents?: number
          id?: string
          period: string
          royalty_cents?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_date?: string
          franchise_id?: string | null
          gross_cents?: number
          id?: string
          period?: string
          royalty_cents?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_royalties_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_staff: {
        Row: {
          created_at: string
          franchise_id: string | null
          id: string
          joined_at: string
          name: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          franchise_id?: string | null
          id?: string
          joined_at?: string
          name: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          franchise_id?: string | null
          id?: string
          joined_at?: string
          name?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_staff_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_territories: {
        Row: {
          country: string
          created_at: string
          exclusivity: string
          franchise_id: string | null
          id: string
          name: string
          population: number
          region: string
          status: string
          updated_at: string
        }
        Insert: {
          country?: string
          created_at?: string
          exclusivity?: string
          franchise_id?: string | null
          id?: string
          name: string
          population?: number
          region: string
          status?: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          exclusivity?: string
          franchise_id?: string | null
          id?: string
          name?: string
          population?: number
          region?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_territories_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchises: {
        Row: {
          city: string
          code: string
          country: string
          created_at: string
          id: string
          locations: number
          mrr_cents: number
          name: string
          opened_at: string
          owner_email: string
          owner_name: string
          region: string
          royalty_pct: number
          status: string
          updated_at: string
        }
        Insert: {
          city?: string
          code: string
          country?: string
          created_at?: string
          id?: string
          locations?: number
          mrr_cents?: number
          name: string
          opened_at?: string
          owner_email?: string
          owner_name?: string
          region: string
          royalty_pct?: number
          status?: string
          updated_at?: string
        }
        Update: {
          city?: string
          code?: string
          country?: string
          created_at?: string
          id?: string
          locations?: number
          mrr_cents?: number
          name?: string
          opened_at?: string
          owner_email?: string
          owner_name?: string
          region?: string
          royalty_pct?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      reseller_applications: {
        Row: {
          code: string
          company: string
          created_at: string
          id: string
          region: string
          reviewer_notes: string
          status: string
          submitted_at: string
          tier_requested: string
          updated_at: string
        }
        Insert: {
          code: string
          company: string
          created_at?: string
          id?: string
          region: string
          reviewer_notes?: string
          status?: string
          submitted_at?: string
          tier_requested?: string
          updated_at?: string
        }
        Update: {
          code?: string
          company?: string
          created_at?: string
          id?: string
          region?: string
          reviewer_notes?: string
          status?: string
          submitted_at?: string
          tier_requested?: string
          updated_at?: string
        }
        Relationships: []
      }
      reseller_compliance: {
        Row: {
          checked_at: string
          created_at: string
          id: string
          notes: string
          reseller_id: string | null
          rule: string
          state: string
          updated_at: string
        }
        Insert: {
          checked_at?: string
          created_at?: string
          id?: string
          notes?: string
          reseller_id?: string | null
          rule: string
          state?: string
          updated_at?: string
        }
        Update: {
          checked_at?: string
          created_at?: string
          id?: string
          notes?: string
          reseller_id?: string | null
          rule?: string
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_compliance_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_payouts: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          paid_at: string | null
          period: string
          reseller_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          period: string
          reseller_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          period?: string
          reseller_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_payouts_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_tickets: {
        Row: {
          created_at: string
          id: string
          opened_at: string
          priority: string
          reseller_id: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          opened_at?: string
          priority?: string
          reseller_id?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          opened_at?: string
          priority?: string
          reseller_id?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_tickets_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      resellers: {
        Row: {
          code: string
          contact_email: string
          contact_phone: string
          country: string
          created_at: string
          growth_pct: number
          id: string
          mrr_cents: number
          name: string
          onboarded_at: string
          region: string
          status: string
          tier: string
          updated_at: string
        }
        Insert: {
          code: string
          contact_email?: string
          contact_phone?: string
          country?: string
          created_at?: string
          growth_pct?: number
          id?: string
          mrr_cents?: number
          name: string
          onboarded_at?: string
          region: string
          status?: string
          tier?: string
          updated_at?: string
        }
        Update: {
          code?: string
          contact_email?: string
          contact_phone?: string
          country?: string
          created_at?: string
          growth_pct?: number
          id?: string
          mrr_cents?: number
          name?: string
          onboarded_at?: string
          region?: string
          status?: string
          tier?: string
          updated_at?: string
        }
        Relationships: []
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
