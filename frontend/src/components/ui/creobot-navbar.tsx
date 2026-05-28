"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Menu, ArrowRight, Bot } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const spring = { type: "spring" as const, stiffness: 300, damping: 30 }

export function CreoBotNavbar({
  langSwitcher,
  isLoggedIn = false,
}: {
  langSwitcher?: React.ReactNode
  isLoggedIn?: boolean
}) {
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const baseNavItems = [
    { title: t('homepage.nav_features'), href: "/#features" },
    { title: t('homepage.nav_how_it_works'), href: "/#how-it-works" },
    { title: t('homepage.nav_pricing'), href: "/pricing" },
    { title: t('homepage.nav_blog'), href: "/blog" },
  ]

  const navItems = isLoggedIn
    ? baseNavItems
    : [...baseNavItems, { title: t('homepage.nav_signin'), href: "/login" }]

  return (
    <motion.header
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className={`sticky top-0 z-50 w-full bg-gray-950/80 backdrop-blur-md border-b transition-[border-color] duration-300 ease-out ${
        scrolled ? "border-gray-800/50" : "border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex h-16 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-xl text-white">CreoBot</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {item.title}
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200"
            >
              {t('homepage.nav_dashboard')}
            </Link>
          )}
          {langSwitcher}
          {!isLoggedIn && (
            <motion.div whileTap={{ scale: 0.97, transition: spring }}>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-[#1a56db] to-[#1e40af] hover:shadow-[0_0_20px_rgba(26,86,219,0.3)] text-white font-semibold px-4 py-2 rounded-lg transition-shadow duration-200">
                  {t('homepage.nav_get_started')} <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </nav>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-gray-950 border-gray-800">
            <nav className="flex flex-col gap-6 mt-8">
              {navItems.map((item) => (
                <SheetClose key={item.title}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.title}
                  </Link>
                </SheetClose>
              ))}
              {langSwitcher && <div>{langSwitcher}</div>}
              {isLoggedIn && (
                <SheetClose>
                  <Link
                    href="/dashboard"
                    className="block w-full text-center border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                  >
                    {t('homepage.nav_dashboard')}
                  </Link>
                </SheetClose>
              )}
              {!isLoggedIn && (
                <SheetClose>
                  <Link href="/signup">
                    <Button className="w-full bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white font-semibold rounded-lg">
                      {t('homepage.nav_get_started')} <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </SheetClose>
              )}
            </nav>
          </SheetContent>
        </Sheet>

      </div>
    </motion.header>
  )
}
