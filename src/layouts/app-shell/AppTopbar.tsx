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

type AppTopbarProps = {
  onNavigate: (path: string) => void
}

export function AppTopbar({ onNavigate }: AppTopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b bg-background">
      <button
        className="flex h-full w-64 shrink-0 items-center px-5 text-left"
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
          <div className="relative hidden w-48 lg:block xl:w-72">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="border-0 bg-transparent pl-9 shadow-none" placeholder="Search" />
          </div>
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
