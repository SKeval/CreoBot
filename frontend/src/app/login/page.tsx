import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Sign In - CreoBot',
  description: 'Sign in to your CreoBot account to manage your AI chatbot.',
}

export default function Page() {
  return <LoginClient />
}
