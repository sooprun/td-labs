import * as React from "react"

import { getDefaultPath } from "@/app/navigation"
import { resolveProductRoute } from "@/app/routes"
import { AppShell } from "@/layouts/app-shell/AppShell"
import { AccountsPage } from "@/pages/clients/accounts/AccountsPage"
import { InsightsPage } from "@/pages/insights/InsightsPage"
import { PrototypePage } from "@/pages/prototype/PrototypePage"

export function App() {
  const [activePath, setActivePath] = React.useState(() => {
    const pathname = window.location.pathname

    return pathname === "/" ? getDefaultPath() : pathname
  })

  const activeRoute = resolveProductRoute(activePath)

  React.useEffect(() => {
    if (window.location.pathname !== activePath) {
      window.history.replaceState(null, "", activePath)
    }
  }, [activePath])

  React.useEffect(() => {
    const handlePopState = () => {
      setActivePath(window.location.pathname || getDefaultPath())
    }

    window.addEventListener("popstate", handlePopState)

    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const handleNavigate = React.useCallback((path: string) => {
    window.history.pushState(null, "", path)
    setActivePath(path)
  }, [])

  if (!activeRoute) {
    return null
  }

  const pageMap: Partial<Record<string, React.ReactElement>> = {
    "/app/insights": <InsightsPage />,
    "/app/clients": <AccountsPage />,
  }

  const page = pageMap[activeRoute.path] ?? (
    <PrototypePage
      icon={activeRoute.section.icon}
      path={activeRoute.path}
      sectionTitle={activeRoute.section.title}
      title={activeRoute.title}
    />
  )

  return (
    <AppShell
      activePath={activeRoute.path}
      activeSection={activeRoute.section}
      activeTitle={activeRoute.title}
      onNavigate={handleNavigate}
    >
      {page}
    </AppShell>
  )
}

export default App
