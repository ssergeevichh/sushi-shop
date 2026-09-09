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
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string
          id: string
          image_path: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_path: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_path?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number | null
          line_weight: number | null
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
          unit_weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total?: number | null
          line_weight?: number | null
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
          unit_weight: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number | null
          line_weight?: number | null
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
          unit_weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          apartment: string | null
          comment: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          delivery_time_type: Database["public"]["Enums"]["delivery_time_type"]
          entrance: string | null
          floor: string | null
          fulfillment_type: Database["public"]["Enums"]["fulfillment_type"]
          house: string | null
          id: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          scheduled_for: string | null
          status: Database["public"]["Enums"]["order_status"]
          street: string | null
          total_price: number
          total_weight: number
          updated_at: string
        }
        Insert: {
          apartment?: string | null
          comment?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          delivery_time_type: Database["public"]["Enums"]["delivery_time_type"]
          entrance?: string | null
          floor?: string | null
          fulfillment_type: Database["public"]["Enums"]["fulfillment_type"]
          house?: string | null
          id?: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          street?: string | null
          total_price: number
          total_weight: number
          updated_at?: string
        }
        Update: {
          apartment?: string | null
          comment?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          delivery_time_type?: Database["public"]["Enums"]["delivery_time_type"]
          entrance?: string | null
          floor?: string | null
          fulfillment_type?: Database["public"]["Enums"]["fulfillment_type"]
          house?: string | null
          id?: string
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          street?: string | null
          total_price?: number
          total_weight?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string
          created_at: string
          description: string
          id: string
          image_path: string
          ingredients: string[]
          is_active: boolean
          is_available: boolean
          labels: Database["public"]["Enums"]["product_label"][]
          name: string
          old_price: number | null
          price: number
          slug: string
          sort_order: number
          updated_at: string
          weight: number
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string
          id?: string
          image_path: string
          ingredients?: string[]
          is_active?: boolean
          is_available?: boolean
          labels?: Database["public"]["Enums"]["product_label"][]
          name: string
          old_price?: number | null
          price: number
          slug: string
          sort_order?: number
          updated_at?: string
          weight: number
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          image_path?: string
          ingredients?: string[]
          is_active?: boolean
          is_available?: boolean
          labels?: Database["public"]["Enums"]["product_label"][]
          name?: string
          old_price?: number | null
          price?: number
          slug?: string
          sort_order?: number
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_order: {
        Args: {
          p_apartment: string
          p_comment: string
          p_customer_name: string
          p_customer_phone: string
          p_delivery_time_type: Database["public"]["Enums"]["delivery_time_type"]
          p_entrance: string
          p_floor: string
          p_fulfillment_type: Database["public"]["Enums"]["fulfillment_type"]
          p_house: string
          p_items: Json
          p_payment_method: Database["public"]["Enums"]["payment_method"]
          p_scheduled_for: string
          p_street: string
        }
        Returns: {
          created_at: string
          order_id: string
          order_number: string
          total_price: number
        }[]
      }
    }
    Enums: {
      delivery_time_type: "asap" | "scheduled"
      fulfillment_type: "delivery" | "pickup"
      order_status:
        | "new"
        | "confirmed"
        | "preparing"
        | "ready"
        | "delivering"
        | "completed"
        | "cancelled"
      payment_method: "cash" | "card-on-delivery"
      product_label: "bestseller" | "new" | "spicy"
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
    Enums: {
      delivery_time_type: ["asap", "scheduled"],
      fulfillment_type: ["delivery", "pickup"],
      order_status: [
        "new",
        "confirmed",
        "preparing",
        "ready",
        "delivering",
        "completed",
        "cancelled",
      ],
      payment_method: ["cash", "card-on-delivery"],
      product_label: ["bestseller", "new", "spicy"],
    },
  },
} as const
