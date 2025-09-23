import { createServerClient } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Service role client for admin operations
export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createBrowserClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database types
export type Database = {
  public: {
    Tables: {
      templates: {
        Row: {
          id: string
          slug: string
          title: string
          audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant'
          preview_url: string | null
          bg_audio_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          audience: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant'
          preview_url?: string | null
          bg_audio_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          audience?: 'teen' | 'adult' | 'classic' | 'fun' | 'elegant'
          preview_url?: string | null
          bg_audio_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      durations: {
        Row: {
          id: number
          label: string
          days: number
          price_try: number
          is_active: boolean
        }
        Insert: {
          id?: number
          label: string
          days: number
          price_try: number
          is_active?: boolean
        }
        Update: {
          id?: number
          label?: string
          days?: number
          price_try?: number
          is_active?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'paid' | 'failed' | 'canceled'
          payment_provider: 'iyzico' | 'stripe'
          payment_ref: string | null
          total_try: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'paid' | 'failed' | 'canceled'
          payment_provider: 'iyzico' | 'stripe'
          payment_ref?: string | null
          total_try: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'paid' | 'failed' | 'canceled'
          payment_provider?: 'iyzico' | 'stripe'
          payment_ref?: string | null
          total_try?: number
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          template_id: string
          duration_id: number
          recipient_name: string
          message: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          template_id: string
          duration_id: number
          recipient_name: string
          message: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          template_id?: string
          duration_id?: number
          recipient_name?: string
          message?: string
          quantity?: number
          created_at?: string
        }
      }
      personal_pages: {
        Row: {
          id: string
          short_id: string
          template_id: string
          order_item_id: string
          recipient_name: string
          message: string
          start_at: string
          expire_at: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          short_id: string
          template_id: string
          order_item_id: string
          recipient_name: string
          message: string
          start_at?: string
          expire_at: string
          created_at?: string
        }
        Update: {
          id?: string
          short_id?: string
          template_id?: string
          order_item_id?: string
          recipient_name?: string
          message?: string
          start_at?: string
          expire_at?: string
          created_at?: string
        }
      }
      page_views: {
        Row: {
          id: number
          personal_page_id: string
          viewed_at: string
          ip: string | null
          ua: string | null
        }
        Insert: {
          id?: number
          personal_page_id: string
          viewed_at?: string
          ip?: string | null
          ua?: string | null
        }
        Update: {
          id?: number
          personal_page_id?: string
          viewed_at?: string
          ip?: string | null
          ua?: string | null
        }
      }
      admins: {
        Row: {
          user_id: string
          role: 'admin'
        }
        Insert: {
          user_id: string
          role?: 'admin'
        }
        Update: {
          user_id?: string
          role?: 'admin'
        }
      }
    }
  }
}