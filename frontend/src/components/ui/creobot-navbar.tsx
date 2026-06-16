"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export function CreoBotNavbar({
  langSwitcher,
  isLoggedIn = false,
}: {
  langSwitcher?: React.ReactNode
  isLoggedIn?: boolean
}) {
  const { t } = useLanguage()

  const navItems = [
    { title: t('homepage.nav_features'), href: "/#features" },
    { title: t('homepage.nav_pricing'), href: "/pricing" },
    { title: t('homepage.nav_blog'), href: "/blog" },
  ]

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderBottom: '0.5px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex h-16 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image src="/logo.png" alt="CreoBot" width={160} height={44} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm text-white/60 hover:text-white transition-colors duration-150"
            >
              {item.title}
            </Link>
          ))}
          {langSwitcher}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white px-4 py-2 rounded-[var(--radius-md)] bg-cb-primary hover:bg-cb-primary-hover transition-[background-color,transform] duration-150 active:scale-[0.97]"
            >
              {t('homepage.nav_dashboard')}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white/60 hover:text-white transition-colors duration-150"
              >
                {t('homepage.nav_signin')}
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-white px-4 py-2 rounded-[var(--radius-md)] bg-cb-primary hover:bg-cb-primary-hover transition-[background-color,transform] duration-150 active:scale-[0.97]"
              >
                {t('homepage.nav_get_started')}
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/[0.05]">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-cb-bg border-white/[0.08] w-full">
            <nav className="flex flex-col gap-6 mt-8">
              {navItems.map((item) => (
                <SheetClose key={item.title}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-white transition-colors duration-150 text-sm"
                  >
                    {item.title}
                  </Link>
                </SheetClose>
              ))}
              {langSwitcher && <div>{langSwitcher}</div>}
              {isLoggedIn ? (
                <SheetClose>
                  <Link
                    href="/dashboard"
                    className="block w-full text-center text-sm font-medium text-white px-4 py-2.5 rounded-[var(--radius-md)] bg-cb-primary hover:bg-cb-primary-hover transition-colors duration-150"
                  >
                    {t('homepage.nav_dashboard')}
                  </Link>
                </SheetClose>
              ) : (
                <>
                  <SheetClose>
                    <Link
                      href="/login"
                      className="text-white/60 hover:text-white transition-colors duration-150 text-sm"
                    >
                      {t('homepage.nav_signin')}
                    </Link>
                  </SheetClose>
                  <SheetClose>
                    <Link
                      href="/signup"
                      className="block w-full text-center text-sm font-medium text-white px-4 py-2.5 rounded-[var(--radius-md)] bg-cb-primary hover:bg-cb-primary-hover transition-colors duration-150"
                    >
                      {t('homepage.nav_get_started')}
                    </Link>
                  </SheetClose>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  )
}
