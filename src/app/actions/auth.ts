'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // Use dummy authentication to prevent crash locally when dummy keys are present
  if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://abcdefghijklmnopqrst.supabase.co') {
    redirect('/')
    return
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/account?error=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://abcdefghijklmnopqrst.supabase.co') {
    redirect('/')
    return
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/account?error=Could not sign up user')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/account')
}
