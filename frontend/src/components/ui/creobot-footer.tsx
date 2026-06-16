'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export function CreoBotFooter({ langSwitcher }: { langSwitcher?: React.ReactNode }) {
  const { t } = useLanguage()

  const productLinks = [
    { title: t('homepage.nav_features'), href: '/#features' },
    { title: t('homepage.nav_pricing'), href: '/pricing' },
    { title: t('homepage.nav_blog'), href: '/blog' },
    { title: 'Trust & Privacy', href: '/trust' },
  ]

  const accountLinks = [
    { title: t('homepage.nav_dashboard'), href: '/dashboard' },
    { title: 'Onboarding', href: '/onboarding' },
  ]

  return (
    <footer
      className="px-6"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '0.5px solid var(--border)',
        padding: '40px 0',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Col 1: Logo + tagline */}
          <div>
            <Link href="/" className="inline-block">
              <Image src="/logo.png" alt="CreoBot" width={160} height={44} />
            </Link>
            <p className="text-white/40 text-[13px] mt-3 max-w-[28ch]">
              {t('homepage.footer_tagline')}
            </p>
          </div>

          {/* Col 2: Product links */}
          <div className="flex flex-col gap-3">
            {productLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-white/60 hover:text-white text-sm transition-colors duration-150 w-fit"
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Col 3: Account links + language */}
          <div className="flex flex-col gap-3">
            {accountLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-white/60 hover:text-white text-sm transition-colors duration-150 w-fit"
              >
                {link.title}
              </Link>
            ))}
            {langSwitcher && <div className="mt-1">{langSwitcher}</div>}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderTop: '0.5px solid var(--border)', marginTop: '32px', paddingTop: '24px' }}
        >
          <p className="text-white/40 text-xs">{t('homepage.footer_copyright')}. All rights reserved.</p>
          <p className="text-white/40 text-xs">
            Built by{' '}
            <a
              href="https://www.linkedin.com/in/keval-savaliya/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors duration-150"
            >
              Keval Savaliya
            </a>
          </p>
          <p className="text-white/40 text-xs">Made for small businesses.</p>
        </div>
      </div>
    </footer>
  )
}
