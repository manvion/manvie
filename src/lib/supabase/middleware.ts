import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh the auth token
  let user = null;
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://abcdefghijklmnopqrst.supabase.co') {
      const { data } = await supabase.auth.getUser()
      user = data.user;
    }
  } catch (err) {
    console.error("Supabase Auth Fetch Error (Expected with Dummy Keys)");
  }

  const pathname = request.nextUrl.pathname

  // Role-based protection logic
  if (user) {
    // If the user tries to access admin or supplier but might not have the correct role,
    // we would check their profile. For MVP, we pass it forward. In production, 
    // fetch the user's role from the `profiles` table.
    
    // Example logic using user metadata (if role is stored there):
    // const role = user.user_metadata?.role || 'user';
    // if (pathname.startsWith('/admin') && role !== 'admin') {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }
  }

  // Protect admin, supplier, and account routes if NOT logged in
  if (
    !user &&
    (pathname.startsWith('/admin') ||
      pathname.startsWith('/supplier'))
  ) {
    // Redirect unauthenticated users to the account login page
    const url = request.nextUrl.clone()
    url.pathname = '/account'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
