import { cn } from "@/lib/utils"

type StatusTab = {
  label: string
  active?: boolean
  onClick?: () => void
}

type StatusTabsProps = {
  tabs: StatusTab[]
  className?: string
  fullWidth?: boolean
}

export function StatusTabs({ tabs, className, fullWidth }: StatusTabsProps) {
  return (
    <div className={cn("inline-flex w-fit rounded-lg bg-border p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.label}
          type="button"
          onClick={tab.onClick}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            fullWidth && "flex-1",
            tab.active
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
