import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Setup Your Chatbot - CreoBot',
  description: 'Get your CreoBot AI chatbot live in under 10 minutes. Upload your docs and embed on your site.',
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
