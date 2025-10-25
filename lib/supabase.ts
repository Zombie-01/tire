import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Only create Supabase client if environment variables are provided
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: "admin" | "user";
          status: "active" | "inactive";
          created_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          role?: "admin" | "user";
          status?: "active" | "inactive";
          created_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          role?: "admin" | "user";
          status?: "active" | "inactive";
          created_at?: string;
          last_login?: string | null;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          logo: string;
          description: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo: string;
          description: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo?: string;
          description?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          brand_id: string;
          size: string;
          price: number;
          condition: "new" | "used";
          description: string;
          image: string;
          popularity: number;
          stock: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand_id: string;
          size: string;
          price: number;
          condition?: "new" | "used";
          description: string;
          image: string;
          popularity?: number;
          stock?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand_id?: string;
          size?: string;
          price?: number;
          condition?: "new" | "used";
          description?: string;
          image?: string;
          popularity?: number;
          stock?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
