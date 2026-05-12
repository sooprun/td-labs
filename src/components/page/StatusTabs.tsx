import { cn } from "@/lib/utils"

type StatusTab = {
  label: string
  active?: boolean
  onClick?: () => void
}

type StatusTabsProps = {
  tabs: StatusTab[]
}

export function StatusTabs({ tabs }: StatusTabsProps) {
  return (
    <div className="inline-flex w-fit rounded-xl bg-muted p-1">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          type="button"
          onClick={tab.onClick}
          className={cn(
            "rounded-lg px-5 py-2 text-sm font-medium transition-colors",
            tab.active
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
