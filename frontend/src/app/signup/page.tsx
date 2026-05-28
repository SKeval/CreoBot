import type { Metadata } from 'next'
import SignupClient from './SignupClient'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Start Free Trial - CreoBot AI Chatbot',
  description: 'Create your free CreoBot account. 14-day free trial, no credit card required. Live on your site in under 2 minutes.',
}

export default function Page() {
  return <SignupClient />
}
