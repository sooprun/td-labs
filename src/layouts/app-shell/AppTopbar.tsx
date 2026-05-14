import * as React from "react"
import {
  IconChevronDown,
  IconDotsVertical,
  IconLogout,
  IconGift,
  IconSettings,
  IconHelpCircle,
  IconSearch,
  IconUsersGroup,
  IconClockHour3,
  IconUser,
  IconClock,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { protoAction } from "@/lib/proto"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { accounts } from "@/mock/accounts"

const RECENT_IDS = ["acct-andrew-lee", "acct-mary-murphy", "acct-acme-corp"]

function GlobalSearch({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [query, setQuery] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const recentAccounts = RECENT_IDS.map((id) => accounts.find((a) => a.id === id)).filter(Boolean) as typeof accounts

  const results = query.trim().length > 0
    ? accounts.filter((a) => a.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : recentAccounts

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSelect = (id: string) => {
    setOpen(false)
    setQuery("")
    onNavigate(`/app/clients/${id}`)
  }

  return (
    <div ref={containerRef} className="relative hidden w-48 lg:block xl:w-72">
      <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="border-0 bg-transparent pl-9 shadow-none"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-xl border bg-background shadow-lg">
          {!query && (
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
              <IconClock className="size-3" />
              Recent
            </div>
          )}
          {results.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">No results</p>
          )}
          {results.map((acc) => (
            <button
              key={acc.id}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-accent"
              onMouseDown={(e) => { e.preventDefault(); handleSelect(acc.id) }}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                <IconUser className="size-3.5" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{acc.name}</div>
                <div className="text-xs text-muted-foreground">{acc.type}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

type AppTopbarProps = {
  onNavigate: (path: string) => void
}

export function AppTopbar({ onNavigate }: AppTopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b bg-background">
      <button
        className="flex h-full w-64 shrink-0 items-center px-4 text-left"
        onClick={() => onNavigate("/app/insights")}
        type="button"
      >
        <img src="/taxdome-logo.svg" alt="TrueDraft" className="size-9 shrink-0" />
        <span className="ml-3 truncate text-sm font-semibold text-foreground">TrueDraft Firm</span>
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2 pl-6 pr-8">
        <div className="flex shrink-0 items-center gap-5">
          <Button className="h-10 bg-[#24C875] px-6 text-white hover:bg-[#1DB866]" type="button" onClick={protoAction("New")}>
            New
          </Button>
          <GlobalSearch onNavigate={onNavigate} />
        </div>

        <div className="min-w-6 flex-1" />

        <div className="flex shrink-0 items-center text-sm font-medium text-foreground">
          <button type="button" className="hidden h-10 shrink-0 items-center gap-1.5 rounded-md px-2 hover:bg-accent hover:text-foreground xl:flex" onClick={protoAction("Time entry")}>
            <IconClockHour3 className="size-4 text-primary" />
            Time entry
          </button>
          <div className="mx-2 hidden h-5 w-px shrink-0 bg-border xl:block" />
          <button type="button" className="hidden h-10 shrink-0 items-center gap-1.5 rounded-md px-2 hover:bg-accent hover:text-foreground xl:flex" onClick={protoAction("Help")}>
            <IconHelpCircle className="size-4 text-primary" />
            Help
          </button>
          <button type="button" className="hidden h-10 shrink-0 items-center gap-1.5 rounded-md px-2 hover:bg-accent hover:text-foreground xl:flex" onClick={protoAction("Community")}>
            <IconUsersGroup className="size-4 text-primary" />
            Community
          </button>
          <button type="button" className="hidden h-10 shrink-0 items-center gap-1.5 rounded-md px-2 hover:bg-accent hover:text-foreground xl:flex" onClick={protoAction("What's new")}>
            <IconGift className="size-4 text-primary" />
            What&apos;s new
          </button>
          <button type="button" className="flex size-10 shrink-0 items-center justify-center rounded-md hover:bg-accent hover:text-foreground xl:hidden" onClick={protoAction("More")}>
            <IconDotsVertical className="size-5" />
          </button>
        </div>
        <div className="h-5 w-px shrink-0 bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-10 w-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg text-left hover:bg-accent data-[state=open]:bg-accent xl:w-auto xl:justify-start xl:px-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E8813A] text-xs font-semibold text-white">
                AS
              </span>
              <div className="hidden min-w-0 leading-tight xl:block">
                <p className="truncate text-sm text-foreground">Alex Shaw</p>
                <p className="truncate text-xs font-normal text-muted-foreground">
                  ashaw@truedraft.com
                </p>
              </div>
              <IconChevronDown className="ml-auto hidden size-4 shrink-0 text-muted-foreground xl:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 overflow-hidden rounded-xl p-0 shadow-lg"
            sideOffset={8}
          >
            <div className="flex items-center gap-3 border-b p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8813A] text-sm font-semibold text-white">
                AS
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  Alex Shaw
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  ashaw@truedraft.com
                </p>
              </div>
            </div>
            <div className="p-1.5">
              <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium text-primary hover:bg-[#F2F9FF] focus:bg-[#F2F9FF] focus:text-primary" onSelect={protoAction("Account settings")}>
                <IconSettings className="size-4 text-primary" />
                Account settings
              </DropdownMenuItem>
              <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium text-primary hover:bg-[#F2F9FF] focus:bg-[#F2F9FF] focus:text-primary" onSelect={protoAction("Team & plans")}>
                <IconUsersGroup className="size-4 text-primary" />
                Team &amp; plans
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-1.5">
              <DropdownMenuItem
                className="h-10 gap-3 rounded-lg px-3 text-sm font-medium"
                variant="destructive"
                onSelect={protoAction("Log out")}
              >
                <IconLogout className="size-4" />
                Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
