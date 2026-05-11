import {
  IconBell,
  IconChevronDown,
  IconDotsVertical,
  IconLogout,
  IconGift,
  IconSettings,
  IconHelpCircle,
  IconSearch,
  IconUsersGroup,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

type AppTopbarProps = {
  onNavigate: (path: string) => void
}

export function AppTopbar({ onNavigate }: AppTopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-background">
      <button
        className="flex h-full w-64 shrink-0 items-center px-5 text-left"
        onClick={() => onNavigate("/app/insights")}
        type="button"
      >
        <span className="flex size-9 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          TD
        </span>
        <span className="sr-only">TaxDome Sandbox</span>
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-4 px-8">
        <div className="flex shrink-0 items-center gap-5">
          <Button className="h-10 px-6" type="button">
            New
          </Button>
          <div className="relative hidden w-48 lg:block xl:w-72">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search" />
          </div>
        </div>

        <div className="min-w-6 flex-1" />

        <div className="flex shrink-0 items-center text-sm font-medium text-muted-foreground">
          <button type="button" className="hidden h-10 shrink-0 items-center gap-1.5 px-2 hover:text-foreground 2xl:flex">
            <IconHelpCircle className="size-4" />
            Time entry
          </button>
          <Separator orientation="vertical" className="mx-2 hidden h-8 2xl:block" />
          <button type="button" className="hidden h-10 shrink-0 items-center gap-1.5 px-2 hover:text-foreground xl:flex 2xl:px-3">
            <IconHelpCircle className="size-4" />
            Help
          </button>
          <button type="button" className="hidden h-10 shrink-0 items-center gap-1.5 px-2 hover:text-foreground 2xl:flex">
            <IconUsersGroup className="size-4" />
            Community
          </button>
          <button type="button" className="hidden h-10 shrink-0 items-center gap-1.5 px-2 hover:text-foreground 2xl:flex">
            <IconGift className="size-4" />
            What&apos;s new
          </button>
          <Separator orientation="vertical" className="mx-2 hidden h-8 xl:block" />
          <button type="button" className="flex size-10 shrink-0 items-center justify-center rounded-md hover:bg-accent hover:text-foreground">
            <IconBell className="size-5" />
          </button>
          <button type="button" className="flex size-10 shrink-0 items-center justify-center rounded-md hover:bg-accent hover:text-foreground xl:hidden">
            <IconDotsVertical className="size-5" />
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg text-left hover:bg-accent data-[state=open]:bg-accent xl:w-52 xl:justify-start xl:px-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                AS
              </span>
              <div className="hidden min-w-0 leading-tight xl:block">
                <p className="truncate text-sm text-foreground">Alex Suprun</p>
                <p className="truncate text-xs font-normal text-muted-foreground">
                  asuprun@tax
                </p>
              </div>
              <IconChevronDown className="ml-auto hidden size-4 shrink-0 text-muted-foreground xl:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 overflow-hidden rounded-xl p-0 shadow-lg"
            sideOffset={8}
          >
            <div className="flex items-center gap-3 border-b bg-muted/50 p-4">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
                AS
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Alex Suprun
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  asuprun@taxdome.com
                </p>
              </div>
            </div>
            <div className="p-1.5">
              <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium">
                <IconSettings className="size-5" />
                Account settings
              </DropdownMenuItem>
              <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium">
                <IconUsersGroup className="size-5" />
                Team &amp; plans
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-1.5">
              <DropdownMenuItem
                className="h-10 gap-3 rounded-lg px-3 text-sm font-semibold"
                variant="destructive"
              >
                <IconLogout className="size-5" />
                Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
