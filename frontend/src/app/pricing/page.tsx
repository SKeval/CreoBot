import type { Metadata } from 'next'
import PricingClient from './PricingClient'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Pricing - CreoBot AI Chatbot',
  description: 'Simple flat pricing. Free plan, Spark at $19/month, Blaze at $49/month. No per-message fees. 14-day free trial.',
}

export default function Page() {
  return <PricingClient />
}
