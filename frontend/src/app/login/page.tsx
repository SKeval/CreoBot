'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
})

type FormValues = z.infer<typeof schema>

const TESTIMONIALS = [
  {
    quote: 'Setup took 5 minutes. Now our bot handles enquiries 24/7 while we sleep.',
    name: 'James K.',
    role: 'Restaurant Owner',
  },
  {
    quote: 'CreoBot answered 90% of our customer questions automatically. Game changer.',
    name: 'Sarah M.',
    role: 'Coffee Shop Owner',
  },
  {
    quote: 'The human handoff feature is brilliant. We never miss a hot lead.',
    name: 'Priya R.',
    role: 'Boutique Owner',
  },
  {
    quote: "Our customers think we have a full support team. It's just CreoBot.",
    name: 'David L.',
    role: 'Fitness Studio Owner',
  },
]

const INTERVAL = 5000

const features = [
  'Zero hallucination: answers only from your docs',
  'Human handoff when it matters',
  'Live on your site in under 2 minutes',
]

const formContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const formItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [idx, setIdx] = useState(0)
  const [tick, setTick] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(i => (i + 1) % TESTIMONIALS.length)
      setTick(t => t + 1)
    }, INTERVAL)
    return () => clearInterval(t)
  }, [])

  const onSubmit = async (data: FormValues) => {
    setServerError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) { setServerError(error.message); return }
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gray-950 flex">

      {/* Left: Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gray-900 border-r border-gray-800 px-12 py-10 overflow-hidden">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Link href="/" className="flex items-center gap-2 text-white">
            <Bot className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl">CreoBot</span>
          </Link>
        </motion.div>

        {/* Rotating testimonial */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
              >
                <blockquote className="text-2xl font-bold tracking-tight text-white leading-snug mb-6">
                  "{TESTIMONIALS[idx].quote}"
                </blockquote>
                <p className="text-white font-semibold text-sm">{TESTIMONIALS[idx].name}</p>
                <p className="text-gray-500 text-sm">{TESTIMONIALS[idx].role}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIdx(i); setTick(t => t + 1) }}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                  i === idx ? 'w-8 bg-gray-700' : 'w-1.5 bg-gray-700 hover:bg-gray-500'
                }`}
              >
                {i === idx && (
                  <motion.span
                    key={tick}
                    className="absolute inset-y-0 left-0 bg-blue-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col gap-3"
        >
          {features.map((feat) => (
            <div key={feat} className="flex items-center gap-3 text-sm text-gray-400">
              <span className="text-green-400 text-base leading-none flex-shrink-0">✓</span>
              {feat}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <Bot className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-xl text-white">CreoBot</span>
        </Link>

        <motion.div
          variants={formContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          <motion.div variants={formItem} className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back</h1>
            <p className="text-gray-400 text-sm">Sign in to your CreoBot account.</p>
          </motion.div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <motion.div variants={formContainer} initial="hidden" animate="visible" className="flex flex-col gap-5">

              <motion.div variants={formItem} className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </motion.div>

              <motion.div variants={formItem} className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-11"
                    {...register('password')}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </motion.div>

              <motion.div variants={formItem} className="pt-1">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </motion.div>

            </motion.div>
          </form>

          <motion.p variants={formItem} className="text-gray-500 text-sm text-center mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
              Start free trial
            </Link>
          </motion.p>

          <motion.div variants={formItem} className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-xs transition-colors duration-200">
              <ArrowLeft className="w-3 h-3" /> Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </main>
  )
}
