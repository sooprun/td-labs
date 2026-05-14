import * as React from "react"

import { getDefaultPath } from "@/app/navigation"
import { resolveProductRoute } from "@/app/routes"
import { AppShell } from "@/layouts/app-shell/AppShell"
import { AccountsPage } from "@/pages/clients/accounts/AccountsPage"
import { AccountDetailPage } from "@/pages/clients/accounts/AccountDetailPage"
import { InsightsPage } from "@/pages/insights/InsightsPage"
import { PipelinesPage } from "@/pages/workflow/pipelines/PipelinesPage"
import { ServicesPage } from "@/pages/billing/services/ServicesPage"
import { InvoicesPage } from "@/pages/billing/invoices/InvoicesPage"
import { serviceItems } from "@/mock/services"
import type { ServiceItem } from "@/mock/services"
import { accounts } from "@/mock/accounts"
import { PrototypePage } from "@/pages/prototype/PrototypePage"

export function App() {
  const [services, setServices] = React.useState<ServiceItem[]>(serviceItems)
  const [followedIds, setFollowedIds] = React.useState<Set<string>>(
    () => new Set(accounts.filter((a) => a.followed).map((a) => a.id))
  )
  const toggleFollow = React.useCallback((id: string) => {
    setFollowedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

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

  // Handle dynamic account detail route before pageMap lookup
  const accountIdSegment = activePath.startsWith("/app/clients/")
    ? activePath.slice("/app/clients/".length)
    : null
  if (accountIdSegment && accountIdSegment.startsWith("acct-")) {
    const accountId = activePath.replace("/app/clients/", "")
    return (
      <AppShell
        activePath="/app/clients"
        onNavigate={handleNavigate}
      >
        <AccountDetailPage
          accountId={accountId}
          onBack={() => handleNavigate("/app/clients")}
          services={services}
          onServicesChange={setServices}
          followed={followedIds.has(accountId)}
          onToggleFollow={() => toggleFollow(accountId)}
        />
      </AppShell>
    )
  }

  if (!activeRoute) {
    return null
  }

  const pageMap: Partial<Record<string, React.ReactElement>> = {
    "/app/insights": <InsightsPage />,
    "/app/clients": <AccountsPage onNavigate={handleNavigate} services={services} onServicesChange={setServices} followedIds={followedIds} />,
    "/app/workflow/pipelines": <PipelinesPage />,
    "/app/billing": <InvoicesPage />,
    "/app/billing/services": <ServicesPage items={services} onItemsChange={setServices} />,
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
      onNavigate={handleNavigate}
    >
      {page}
    </AppShell>
  )
}

export default App
