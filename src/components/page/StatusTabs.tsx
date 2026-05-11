import { cn } from "@/lib/utils"

type StatusTab = {
  label: string
  active?: boolean
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
          className={cn(
            "rounded-lg px-5 py-2 text-sm font-medium",
            tab.active
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
