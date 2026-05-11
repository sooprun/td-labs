import * as React from "react"
import { IconChevronDown, IconMoon, IconPin, IconSun } from "@tabler/icons-react"

import { productNavigation } from "@/app/navigation"
import { useTheme } from "@/components/theme-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  activePath: string
  onNavigate: (path: string) => void
}

export function AppSidebar({
  activePath,
  onNavigate,
  ...props
}: AppSidebarProps) {
  const { theme, setTheme } = useTheme()
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    const activeSection = productNavigation.find((section) =>
      section.items?.some((item) => item.path === activePath)
    )

    setExpandedSection(activeSection?.title ?? null)
  }, [activePath])

  return (
    <Sidebar
      className="h-full shrink-0 border-r bg-background"
      collapsible="none"
      {...props}
    >
      <SidebarHeader className="hidden" />
      <SidebarContent>
        <SidebarMenu className="p-2">
          {productNavigation.map((section) => {
            const hasChildren = Boolean(section.items?.length)
            const isExpanded = hasChildren && expandedSection === section.title
            const isSectionActive = !hasChildren && activePath === section.path
            const Icon = section.icon

            return (
              <SidebarMenuItem key={section.title}>
                <SidebarMenuButton
                  className="font-semibold"
                  isActive={isSectionActive}
                  onClick={() => {
                    if (hasChildren) {
                      setExpandedSection((current) =>
                        current === section.title ? null : section.title
                      )
                    }

                    onNavigate(section.path)
                  }}
                  tooltip={section.title}
                  type="button"
                >
                  <Icon className="text-sidebar-primary" />
                  <span>{section.title}</span>
                  {hasChildren ? (
                    <IconChevronDown
                      className={cn(
                        "ml-auto transition-transform group-data-[collapsible=icon]:hidden",
                        isExpanded && "rotate-180"
                      )}
                    />
                  ) : null}
                </SidebarMenuButton>

                {section.items?.length && isExpanded ? (
                  <SidebarMenuSub>
                    {section.items.map((item) => (
                      <SidebarMenuSubItem key={item.path}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={activePath === item.path}
                        >
                          <a
                            href={item.path}
                            onClick={(event) => {
                              event.preventDefault()
                              onNavigate(item.path)
                            }}
                          >
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                        <span className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border">
                          {activePath === item.path && (
                            <span className="absolute inset-x-0 top-1 bottom-1 rounded-full bg-sidebar-primary" />
                          )}
                        </span>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between px-1 py-1">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <IconPin className="size-4" />
          </button>
          <div className="flex items-center rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={cn(
                "flex size-8 items-center justify-center rounded-md",
                theme === "light"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <IconSun className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={cn(
                "flex size-8 items-center justify-center rounded-md",
                theme === "dark"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <IconMoon className="size-4" />
            </button>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
