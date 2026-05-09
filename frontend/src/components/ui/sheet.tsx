"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetProps {
  children: React.ReactNode
}

interface SheetContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType>({
  open: false,
  setOpen: () => {},
})

function Sheet({ children }: SheetProps) {
  const [open, setOpen] = React.useState(false)
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

function SheetTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { setOpen } = React.useContext(SheetContext)
  return (
    <div onClick={() => setOpen(true)} style={{ display: "contents" }}>
      {children}
    </div>
  )
}

function SheetClose({ children }: { children?: React.ReactNode }) {
  const { setOpen } = React.useContext(SheetContext)
  return (
    <div onClick={() => setOpen(false)} style={{ display: "contents" }}>
      {children}
    </div>
  )
}

function SheetContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = React.useContext(SheetContext)
  if (!open) return null
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80"
        onClick={() => setOpen(false)}
      />
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 h-full w-3/4 max-w-sm bg-background p-6 shadow-lg",
        className
      )}>
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </>
  )
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-2", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

const SheetPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SheetOverlay = ({ className }: { className?: string }) => null

export {
  Sheet, SheetTrigger, SheetClose, SheetContent,
  SheetHeader, SheetFooter, SheetTitle, SheetDescription,
  SheetPortal, SheetOverlay,
}