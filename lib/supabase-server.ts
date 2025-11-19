import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// This function creates a Supabase client for Server Components and Server Actions.
// It uses the request's cookies to manage authentication tokens securely.
export function createSupabaseServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called from a
            // Server Component or Server Action in a 'POST' route.
            // If called in a 'GET' route, it will throw.
            // This is generally safe to ignore in read-only server functions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Same reason as above.
          }
        },
      },
    }
  );
}
// Note: If you don't use auto-generated types, you can remove `<Database>`
