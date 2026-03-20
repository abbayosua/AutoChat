'use client'

import { useSearchParams } from 'next/navigation'
import { AuthForm } from '@/components/organisms/landing/auth-form'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'

  return <AuthForm mode={mode} />
}
