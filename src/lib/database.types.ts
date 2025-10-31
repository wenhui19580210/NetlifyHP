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
          favicon_url: string | null
          browser_favicon_url: string | null
          hero_icon_url: string | null
          hero_icon_visible: boolean
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
          favicon_url?: string | null
          browser_favicon_url?: string | null
          hero_icon_url?: string | null
          hero_icon_visible?: boolean
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
          favicon_url?: string | null
          browser_favicon_url?: string | null
          hero_icon_url?: string | null
          hero_icon_visible?: boolean
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
      announcements: {
        Row: {
          id: string
          title_ja: string
          title_zh: string | null
          content_ja: string
          content_zh: string | null
          is_visible: boolean
          start_date: string | null
          end_date: string | null
          priority: number
          background_color: string
          text_color: string
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title_ja: string
          title_zh?: string | null
          content_ja: string
          content_zh?: string | null
          is_visible?: boolean
          start_date?: string | null
          end_date?: string | null
          priority?: number
          background_color?: string
          text_color?: string
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_ja?: string
          title_zh?: string | null
          content_ja?: string
          content_zh?: string | null
          is_visible?: boolean
          start_date?: string | null
          end_date?: string | null
          priority?: number
          background_color?: string
          text_color?: string
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      seo_settings: {
        Row: {
          id: string
          page_key: string
          title_ja: string | null
          description_ja: string | null
          keywords_ja: string[] | null
          title_zh: string | null
          description_zh: string | null
          keywords_zh: string[] | null
          og_title_ja: string | null
          og_title_zh: string | null
          og_description_ja: string | null
          og_description_zh: string | null
          og_image_url: string | null
          og_type: string
          twitter_card: string
          twitter_site: string | null
          twitter_creator: string | null
          structured_data: Json | null
          canonical_url: string | null
          robots_index: boolean
          robots_follow: boolean
          priority: number
          change_frequency: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_key: string
          title_ja?: string | null
          description_ja?: string | null
          keywords_ja?: string[] | null
          title_zh?: string | null
          description_zh?: string | null
          keywords_zh?: string[] | null
          og_title_ja?: string | null
          og_title_zh?: string | null
          og_description_ja?: string | null
          og_description_zh?: string | null
          og_image_url?: string | null
          og_type?: string
          twitter_card?: string
          twitter_site?: string | null
          twitter_creator?: string | null
          structured_data?: Json | null
          canonical_url?: string | null
          robots_index?: boolean
          robots_follow?: boolean
          priority?: number
          change_frequency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_key?: string
          title_ja?: string | null
          description_ja?: string | null
          keywords_ja?: string[] | null
          title_zh?: string | null
          description_zh?: string | null
          keywords_zh?: string[] | null
          og_title_ja?: string | null
          og_title_zh?: string | null
          og_description_ja?: string | null
          og_description_zh?: string | null
          og_image_url?: string | null
          og_type?: string
          twitter_card?: string
          twitter_site?: string | null
          twitter_creator?: string | null
          structured_data?: Json | null
          canonical_url?: string | null
          robots_index?: boolean
          robots_follow?: boolean
          priority?: number
          change_frequency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      page_sections: {
        Row: {
          id: string
          section_key: string
          section_name_ja: string
          section_name_zh: string | null
          order_index: number
          is_visible: boolean
          background_color: string | null
          text_color: string | null
          title_ja: string | null
          title_zh: string | null
          subtitle_ja: string | null
          subtitle_zh: string | null
          custom_styles: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_key: string
          section_name_ja: string
          section_name_zh?: string | null
          order_index?: number
          is_visible?: boolean
          background_color?: string | null
          text_color?: string | null
          title_ja?: string | null
          title_zh?: string | null
          subtitle_ja?: string | null
          subtitle_zh?: string | null
          custom_styles?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_key?: string
          section_name_ja?: string
          section_name_zh?: string | null
          order_index?: number
          is_visible?: boolean
          background_color?: string | null
          text_color?: string | null
          title_ja?: string | null
          title_zh?: string | null
          subtitle_ja?: string | null
          subtitle_zh?: string | null
          custom_styles?: Json
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
