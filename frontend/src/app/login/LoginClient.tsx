'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
})

type FormValues = z.infer<typeof schema>

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

export default function LoginClient() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

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
    <main className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-page)' }}>

      {/* Left: Brand Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] px-12 py-10 overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)', borderRight: '0.5px solid var(--border)' }}
      >

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="CreoBot" width={120} height={32} />
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <h2
            className="leading-snug mb-4 text-balance"
            style={{ fontSize: '1.75rem', fontWeight: 500, color: 'var(--text-100)' }}
          >
            Your business, always available.
          </h2>
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--text-60)' }}>
            CreoBot answers customer questions 24/7 from your docs only. You get an email when a human is needed.
          </p>
        </motion.div>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col gap-3"
        >
          {features.map((feat) => (
            <div key={feat} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-60)' }}>
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
              {feat}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <Link href="/" className="mb-10 lg:hidden">
          <Image src="/logo.png" alt="CreoBot" width={120} height={32} />
        </Link>

        <motion.div
          variants={formContainer}
          initial="hidden"
          animate="visible"
          className="w-full"
          style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            maxWidth: '420px',
            margin: '0 auto',
          }}
        >
          <motion.div variants={formItem} className="mb-8">
            <h1 className="mb-2" style={{ fontSize: '1.75rem', fontWeight: 500, color: 'var(--text-100)' }}>Welcome back</h1>
            <p className="text-sm" style={{ color: 'var(--text-60)' }}>Sign in to your CreoBot account.</p>
          </motion.div>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 mb-6 text-sm"
              style={{
                background: 'rgba(248, 113, 113, 0.1)',
                border: '0.5px solid rgba(248, 113, 113, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: '#f87171',
              }}
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
                  <p className="text-xs" style={{ color: '#f87171' }}>{errors.email.message}</p>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors duration-150"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs" style={{ color: '#f87171' }}>{errors.password.message}</p>
                )}
              </motion.div>

              <motion.div variants={formItem} className="pt-1">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-cb-primary hover:bg-cb-primary-hover text-white font-medium rounded-[10px] transition-[background-color,transform] duration-150 active:scale-[0.98] text-sm"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </motion.div>

            </motion.div>
          </form>

          <motion.p variants={formItem} className="text-sm text-center mt-8" style={{ color: 'var(--text-40)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="transition-colors duration-150 hover:underline" style={{ color: 'var(--primary-hover)' }}>
              Start free trial
            </Link>
          </motion.p>

          <motion.div variants={formItem} className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 text-xs transition-colors duration-150">
              <ArrowLeft className="w-3 h-3" /> Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </main>
  )
}
