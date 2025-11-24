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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string
          id: string
          mission: string | null
          title: string
          updated_at: string
          vision: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description: string
          id: string
          mission?: string | null
          title: string
          updated_at?: string
          vision?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string
          id?: string
          mission?: string | null
          title?: string
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          adults: number
          booking_date: string
          booking_time: string | null
          created_at: string
          id: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string
          total_price: number
          tour_id: string
          updated_at: string
          user_email: string | null
          user_phone: string | null
        }
        Insert: {
          adults?: number
          booking_date: string
          booking_time?: string | null
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string
          total_price: number
          tour_id: string
          updated_at?: string
          user_email?: string | null
          user_phone?: string | null
        }
        Update: {
          adults?: number
          booking_date?: string
          booking_time?: string | null
          created_at?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string
          total_price?: number
          tour_id?: string
          updated_at?: string
          user_email?: string | null
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name_de: string
          name_en: string
          name_ru: string
          name_uz: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name_de: string
          name_en: string
          name_ru: string
          name_uz: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name_de?: string
          name_en?: string
          name_ru?: string
          name_uz?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      destinations: {
        Row: {
          category_id: string | null
          country: string
          created_at: string | null
          description_de: string | null
          description_en: string | null
          description_ru: string | null
          description_uz: string | null
          id: string
          image_url: string | null
          name_de: string
          name_en: string
          name_ru: string
          name_uz: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          country: string
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_uz?: string | null
          id?: string
          image_url?: string | null
          name_de: string
          name_en: string
          name_ru: string
          name_uz: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          country?: string
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_uz?: string | null
          id?: string
          image_url?: string | null
          name_de?: string
          name_en?: string
          name_ru?: string
          name_uz?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "destinations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      flights: {
        Row: {
          airline: string
          arrival_time: string
          available_seats: number
          created_at: string
          departure_time: string
          from_city: string
          id: string
          price: number
          to_city: string
          updated_at: string
        }
        Insert: {
          airline: string
          arrival_time: string
          available_seats?: number
          created_at?: string
          departure_time: string
          from_city: string
          id?: string
          price: number
          to_city: string
          updated_at?: string
        }
        Update: {
          airline?: string
          arrival_time?: string
          available_seats?: number
          created_at?: string
          departure_time?: string
          from_city?: string
          id?: string
          price?: number
          to_city?: string
          updated_at?: string
        }
        Relationships: []
      }
      hotels: {
        Row: {
          amenities: string | null
          available_rooms: number
          created_at: string
          description: string
          id: string
          location: string
          name: string
          price_per_night: number
          rating: number
          updated_at: string
        }
        Insert: {
          amenities?: string | null
          available_rooms?: number
          created_at?: string
          description: string
          id?: string
          location: string
          name: string
          price_per_night: number
          rating?: number
          updated_at?: string
        }
        Update: {
          amenities?: string | null
          available_rooms?: number
          created_at?: string
          description?: string
          id?: string
          location?: string
          name?: string
          price_per_night?: number
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          created_at: string | null
          display_order: number
          icon: string | null
          id: string
          name_de: string
          name_en: string
          name_ru: string
          name_uz: string
          parent_id: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name_de: string
          name_en: string
          name_ru: string
          name_uz: string
          parent_id?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          name_de?: string
          name_en?: string
          name_ru?: string
          name_uz?: string
          parent_id?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          guest_name: string
          id: string
          image_urls: string[] | null
          rating: number
          tour_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          guest_name: string
          id?: string
          image_urls?: string[] | null
          rating: number
          tour_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          guest_name?: string
          id?: string
          image_urls?: string[] | null
          rating?: number
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          category_id: string | null
          created_at: string | null
          description_de: string | null
          description_en: string | null
          description_ru: string | null
          description_uz: string | null
          destination_id: string | null
          duration: string
          id: string
          image_url: string | null
          important_info_de: string | null
          important_info_en: string | null
          important_info_ru: string | null
          important_info_uz: string | null
          included_de: string | null
          included_en: string | null
          included_ru: string | null
          included_uz: string | null
          is_bestseller: boolean | null
          itinerary_de: string | null
          itinerary_en: string | null
          itinerary_ru: string | null
          itinerary_uz: string | null
          location_de: string | null
          location_en: string | null
          location_ru: string | null
          location_uz: string | null
          not_included_de: string | null
          not_included_en: string | null
          not_included_ru: string | null
          not_included_uz: string | null
          overview_de: string | null
          overview_en: string | null
          overview_ru: string | null
          overview_uz: string | null
          price: number
          rating: number | null
          reviews_count: number | null
          title_de: string
          title_en: string
          title_ru: string
          title_uz: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_uz?: string | null
          destination_id?: string | null
          duration: string
          id?: string
          image_url?: string | null
          important_info_de?: string | null
          important_info_en?: string | null
          important_info_ru?: string | null
          important_info_uz?: string | null
          included_de?: string | null
          included_en?: string | null
          included_ru?: string | null
          included_uz?: string | null
          is_bestseller?: boolean | null
          itinerary_de?: string | null
          itinerary_en?: string | null
          itinerary_ru?: string | null
          itinerary_uz?: string | null
          location_de?: string | null
          location_en?: string | null
          location_ru?: string | null
          location_uz?: string | null
          not_included_de?: string | null
          not_included_en?: string | null
          not_included_ru?: string | null
          not_included_uz?: string | null
          overview_de?: string | null
          overview_en?: string | null
          overview_ru?: string | null
          overview_uz?: string | null
          price: number
          rating?: number | null
          reviews_count?: number | null
          title_de: string
          title_en: string
          title_ru: string
          title_uz: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_ru?: string | null
          description_uz?: string | null
          destination_id?: string | null
          duration?: string
          id?: string
          image_url?: string | null
          important_info_de?: string | null
          important_info_en?: string | null
          important_info_ru?: string | null
          important_info_uz?: string | null
          included_de?: string | null
          included_en?: string | null
          included_ru?: string | null
          included_uz?: string | null
          is_bestseller?: boolean | null
          itinerary_de?: string | null
          itinerary_en?: string | null
          itinerary_ru?: string | null
          itinerary_uz?: string | null
          location_de?: string | null
          location_en?: string | null
          location_ru?: string | null
          location_uz?: string | null
          not_included_de?: string | null
          not_included_en?: string | null
          not_included_ru?: string | null
          not_included_uz?: string | null
          overview_de?: string | null
          overview_en?: string | null
          overview_ru?: string | null
          overview_uz?: string | null
          price?: number
          rating?: number | null
          reviews_count?: number | null
          title_de?: string
          title_en?: string
          title_ru?: string
          title_uz?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tours_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visas: {
        Row: {
          country: string
          created_at: string
          duration: string
          id: string
          price: number
          processing_time: string
          requirements: string
          updated_at: string
          visa_type: string
        }
        Insert: {
          country: string
          created_at?: string
          duration: string
          id?: string
          price: number
          processing_time: string
          requirements: string
          updated_at?: string
          visa_type: string
        }
        Update: {
          country?: string
          created_at?: string
          duration?: string
          id?: string
          price?: number
          processing_time?: string
          requirements?: string
          updated_at?: string
          visa_type?: string
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
