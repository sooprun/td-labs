import type { ReactNode } from "react"

import { AppSidebar } from "@/layouts/app-shell/AppSidebar"
import { AppTopbar } from "@/layouts/app-shell/AppTopbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import type { ProductNavSection } from "@/types/navigation"

type AppShellProps = {
  activePath: string
  activeTitle: string
  activeSection: ProductNavSection
  onNavigate: (path: string) => void
  children: ReactNode
}

export function AppShell({
  activePath,
  onNavigate,
  children,
}: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="flex h-svh w-full flex-col overflow-hidden">
        <AppTopbar onNavigate={onNavigate} />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <AppSidebar activePath={activePath} onNavigate={onNavigate} />
          <main className="min-w-0 flex-1 overflow-auto bg-workspace">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
