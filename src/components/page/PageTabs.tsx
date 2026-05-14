type PageTab = {
  label: string
  badge?: React.ReactNode
}

type PageTabsProps<T extends string> = {
  tabs: (T | PageTab)[]
  active: T
  onChange: (tab: T) => void
}

import * as React from "react"

export function PageTabs<T extends string>({ tabs, active, onChange }: PageTabsProps<T>) {
  return (
    <div className="flex min-h-11 items-end border-b">
      {tabs.map((tab) => {
        const label = typeof tab === "string" ? tab : tab.label
        const badge = typeof tab === "string" ? undefined : tab.badge
        const isActive = active === label
        return (
          <button
            key={label}
            onClick={() => onChange(label as T)}
            className={`mr-6 flex items-center gap-2 border-b-2 pb-2.5 pt-1 text-base font-medium transition-colors ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
            {badge}
          </button>
        )
      })}
    </div>
  )
}
