import type { Metadata } from 'next'
import HomeServicesClient from './HomeServicesClient'


export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'AI Chatbot for Home Service Businesses - CreoBot',
  description: 'Never miss a lead while on the job. CreoBot answers customer questions 24/7 for plumbers, HVAC, electricians, and more. Free 14-day trial.',
}

export default function Page() {
  return <HomeServicesClient />
}
