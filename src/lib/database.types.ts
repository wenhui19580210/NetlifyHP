// Supabaseデータベース型定義
// 自動生成: supabase gen types typescript --project-id YOUR_PROJECT_ID

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
      company_info: {
        Row: {
          id: string
          company_name: string
          company_name_en: string | null
          company_name_zh: string | null
          ceo_name: string | null
          established: string | null
          capital: string | null
          employees: number | null
          business_content_ja: string | null
          business_content_zh: string | null
          phone: string | null
          fax: string | null
          email: string | null
          address_ja: string | null
          address_zh: string | null
          postal_code: string | null
          map_embed: string | null
          logo_url: string | null
          main_color: string
          sub_color: string
          ceo_message_ja: string | null
          ceo_message_zh: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name?: string
          company_name_en?: string | null
          company_name_zh?: string | null
          ceo_name?: string | null
          established?: string | null
          capital?: string | null
          employees?: number | null
          business_content_ja?: string | null
          business_content_zh?: string | null
          phone?: string | null
          fax?: string | null
          email?: string | null
          address_ja?: string | null
          address_zh?: string | null
          postal_code?: string | null
          map_embed?: string | null
          logo_url?: string | null
          main_color?: string
          sub_color?: string
          ceo_message_ja?: string | null
          ceo_message_zh?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          company_name_en?: string | null
          company_name_zh?: string | null
          ceo_name?: string | null
          established?: string | null
          capital?: string | null
          employees?: number | null
          business_content_ja?: string | null
          business_content_zh?: string | null
          phone?: string | null
          fax?: string | null
          email?: string | null
          address_ja?: string | null
          address_zh?: string | null
          postal_code?: string | null
          map_embed?: string | null
          logo_url?: string | null
          main_color?: string
          sub_color?: string
          ceo_message_ja?: string | null
          ceo_message_zh?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      company_info_visibility: {
        Row: {
          id: string
          field_name: string
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          field_name: string
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          field_name?: string
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          service_name_ja: string
          service_name_zh: string | null
          description_ja: string | null
          description_zh: string | null
          image_url: string | null
          icon: string | null
          order_index: number
          is_visible: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_name_ja: string
          service_name_zh?: string | null
          description_ja?: string | null
          description_zh?: string | null
          image_url?: string | null
          icon?: string | null
          order_index?: number
          is_visible?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_name_ja?: string
          service_name_zh?: string | null
          description_ja?: string | null
          description_zh?: string | null
          image_url?: string | null
          icon?: string | null
          order_index?: number
          is_visible?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title_ja: string
          title_zh: string | null
          content_ja: string | null
          content_zh: string | null
          image_url: string | null
          publish_date: string
          is_visible: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title_ja: string
          title_zh?: string | null
          content_ja?: string | null
          content_zh?: string | null
          image_url?: string | null
          publish_date?: string
          is_visible?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_ja?: string
          title_zh?: string | null
          content_ja?: string | null
          content_zh?: string | null
          image_url?: string | null
          publish_date?: string
          is_visible?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          question_ja: string
          question_zh: string | null
          answer_ja: string | null
          answer_zh: string | null
          order_index: number
          is_visible: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_ja: string
          question_zh?: string | null
          answer_ja?: string | null
          answer_zh?: string | null
          order_index?: number
          is_visible?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_ja?: string
          question_zh?: string | null
          answer_ja?: string | null
          answer_zh?: string | null
          order_index?: number
          is_visible?: boolean
          deleted_at?: string | null
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
