import type { ReactNode } from "react"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "sonner"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        {children}
        <Toaster position="top-right" richColors />
        <Analytics />
      </TooltipProvider>
    </ThemeProvider>
  )
}
