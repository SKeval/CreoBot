"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Menu, ArrowRight, Bot } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const baseNavItems = [
  { title: "Features", href: "/#features" },
  { title: "How it works", href: "/#how-it-works" },
  { title: "Pricing", href: "/pricing" },
  { title: "Blog", href: "/blog" },
]

const spring = { type: "spring" as const, stiffness: 300, damping: 30 }

export function CreoBotNavbar({
  langSwitcher,
  isLoggedIn = false,
}: {
  langSwitcher?: React.ReactNode
  isLoggedIn?: boolean
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navItems = isLoggedIn
    ? [...baseNavItems, { title: "Dashboard", href: "/dashboard" }]
    : [...baseNavItems, { title: "Sign in", href: "/login" }]

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
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
          {langSwitcher}
          {!isLoggedIn && (
            <motion.div whileTap={{ scale: 0.97, transition: spring }}>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-[#1a56db] to-[#1e40af] hover:shadow-[0_0_20px_rgba(26,86,219,0.3)] text-white font-semibold px-4 py-2 rounded-lg transition-shadow duration-200">
                  Get started free <ArrowRight className="ml-1 w-4 h-4" />
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
              {!isLoggedIn && (
                <SheetClose>
                  <Link href="/signup">
                    <Button className="w-full bg-gradient-to-r from-[#1a56db] to-[#1e40af] text-white font-semibold rounded-lg">
                      Get started free <ArrowRight className="ml-1 w-4 h-4" />
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
