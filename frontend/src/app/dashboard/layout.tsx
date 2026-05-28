import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - CreoBot',
  description: 'Manage your CreoBot AI chatbot, upload documents, and monitor your subscription.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
