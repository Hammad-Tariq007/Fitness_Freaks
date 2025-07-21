export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          author_name: string
          category: string
          content: string
          cover_image_url: string
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name: string
          category: string
          content: string
          cover_image_url: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          cover_image_url?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          created_at: string
          id: string
          post_id: string
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_community_comments_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_posts: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          tags: string[] | null
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          tags?: string[] | null
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          tags?: string[] | null
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_community_posts_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      nutrition_plans: {
        Row: {
          calories: number
          created_at: string
          description: string
          goal: string
          id: string
          image_url: string
          macros: Json
          meals: Json
          title: string
          updated_at: string
        }
        Insert: {
          calories: number
          created_at?: string
          description: string
          goal: string
          id?: string
          image_url: string
          macros?: Json
          meals?: Json
          title: string
          updated_at?: string
        }
        Update: {
          calories?: number
          created_at?: string
          description?: string
          goal?: string
          id?: string
          image_url?: string
          macros?: Json
          meals?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_post_likes_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_nutrition_plans: {
        Row: {
          created_at: string
          id: string
          nutrition_plan_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nutrition_plan_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nutrition_plan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_saved_nutrition_plans_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "saved_nutrition_plans_nutrition_plan_id_fkey"
            columns: ["nutrition_plan_id"]
            isOneToOne: false
            referencedRelation: "nutrition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_workouts: {
        Row: {
          created_at: string
          id: string
          user_id: string
          workout_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          workout_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_saved_workouts_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "saved_workouts_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          metadata: Json | null
          plan: string
          provider: string | null
          started_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          plan: string
          provider?: string | null
          started_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          plan?: string
          provider?: string | null
          started_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_subscriptions_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string
          daily_calorie_goal: number
          goal_type: string | null
          id: string
          macros_carbs: number | null
          macros_fat: number | null
          macros_protein: number | null
          target_date: string | null
          target_weight: number | null
          updated_at: string
          user_id: string
          weekly_workout_goal: number
          weight_goal: number | null
        }
        Insert: {
          created_at?: string
          daily_calorie_goal: number
          goal_type?: string | null
          id?: string
          macros_carbs?: number | null
          macros_fat?: number | null
          macros_protein?: number | null
          target_date?: string | null
          target_weight?: number | null
          updated_at?: string
          user_id: string
          weekly_workout_goal: number
          weight_goal?: number | null
        }
        Update: {
          created_at?: string
          daily_calorie_goal?: number
          goal_type?: string | null
          id?: string
          macros_carbs?: number | null
          macros_fat?: number | null
          macros_protein?: number | null
          target_date?: string | null
          target_weight?: number | null
          updated_at?: string
          user_id?: string
          weekly_workout_goal?: number
          weight_goal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_goals_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          gender: string
          goal: string
          height: number
          id: string
          name: string
          role: string | null
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          gender: string
          goal: string
          height: number
          id?: string
          name: string
          role?: string | null
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string
          gender?: string
          goal?: string
          height?: number
          id?: string
          name?: string
          role?: string | null
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          calories_intake: number | null
          created_at: string
          date: string
          id: string
          note: string | null
          updated_at: string
          user_id: string
          workouts_completed: number | null
        }
        Insert: {
          calories_intake?: number | null
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          updated_at?: string
          user_id: string
          workouts_completed?: number | null
        }
        Update: {
          calories_intake?: number | null
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          updated_at?: string
          user_id?: string
          workouts_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_progress_user_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_progress_logs: {
        Row: {
          calories_consumed: number | null
          created_at: string
          current_weight: number | null
          date: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
          water_intake: number | null
          workouts_completed: number | null
        }
        Insert: {
          calories_consumed?: number | null
          created_at?: string
          current_weight?: number | null
          date?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
          water_intake?: number | null
          workouts_completed?: number | null
        }
        Update: {
          calories_consumed?: number | null
          created_at?: string
          current_weight?: number | null
          date?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          water_intake?: number | null
          workouts_completed?: number | null
        }
        Relationships: []
      }
      workouts: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          id: string
          image_url: string
          level: string
          tags: string[] | null
          title: string
          updated_at: string
          video_url: string | null
          youtube_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          duration: string
          id?: string
          image_url: string
          level: string
          tags?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          image_url?: string
          level?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      get_user_subscription: {
        Args: { check_user_id?: string }
        Returns: {
          id: string
          plan: string
          is_active: boolean
          started_at: string
          expires_at: string
          provider: string
        }[]
      }
      has_active_subscription: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      has_premium_access: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
