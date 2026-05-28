import type { Metadata } from 'next'
import HomepageClient from './HomepageClient'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'CreoBot - AI Chatbot for Small Businesses',
  description: 'CreoBot answers customer questions 24/7 from your docs only - never makes things up. Free 14-day trial. Live in 10 minutes.',
}

export default function Page() {
  return <HomepageClient />
}
