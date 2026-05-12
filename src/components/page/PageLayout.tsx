import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageLayoutProps = {
  children: ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn("min-h-full w-full bg-workspace p-6", className)}>
      {children}
    </div>
  )
}

type PageHeaderProps = {
  title: string
  action?: ReactNode
  children?: ReactNode
}

export function PageHeader({ title, action, children }: PageHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-3xl font-semibold tracking-normal">
          {title}
        </h1>
        {action}
      </div>
      {children}
    </div>
  )
}

type PageSectionProps = {
  title: string
  meta?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function PageSection({
  title,
  meta,
  action,
  children,
  className,
}: PageSectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      <div className="mb-4 flex min-w-0 items-center gap-4">
        <h2 className="text-xl font-semibold tracking-normal">{title}</h2>
        {meta}
        <div className="ml-auto">{action}</div>
      </div>
      {children}
    </section>
  )
}
