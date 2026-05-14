import {
  IconActivityHeartbeat,
  IconApps,
  IconChartDonut,
  IconClipboard,
  IconFileDescription,
  IconInbox,
  IconMessages,
  IconMessageUser,
  IconReceiptDollar,
  IconRosetteDiscount,
  IconSettings,
  IconStack2,
  IconTemplate,
  IconUsersGroup,
} from "@tabler/icons-react"

import type { ProductNavSection } from "@/types/navigation"

export const productNavigation: ProductNavSection[] = [
  {
    title: "Insights",
    path: "/app/insights",
    icon: IconApps,
  },
  {
    title: "Inbox+",
    path: "/app/inbox",
    icon: IconInbox,
  },
  {
    title: "Clients",
    path: "/app/clients",
    icon: IconUsersGroup,
    items: [
      { title: "Accounts", path: "/app/clients" },
      { title: "Contacts", path: "/app/clients/contacts" },
    ],
  },
  {
    title: "Reporting",
    path: "/app/reporting",
    icon: IconChartDonut,
    items: [
      { title: "Overview", path: "/app/reporting" },
      { title: "Reports", path: "/app/reporting/reports" },
      { title: "Dashboards", path: "/app/reporting/dashboards" },
      { title: "Report designer", path: "/app/reporting/report-designer" },
      { title: "Alerts", path: "/app/reporting/alerts" },
      { title: "How it works", path: "/app/reporting/how-it-works" },
    ],
  },
  {
    title: "Reporting (Legacy)",
    path: "/app/reporting-legacy",
    icon: IconChartDonut,
    items: [
      { title: "Overview", path: "/app/reporting-legacy" },
      { title: "Reports", path: "/app/reporting-legacy/reports" },
      { title: "Dashboards", path: "/app/reporting-legacy/dashboards" },
      {
        title: "Report designer",
        path: "/app/reporting-legacy/report-designer",
      },
      { title: "Alerts", path: "/app/reporting-legacy/alerts" },
      { title: "How it works", path: "/app/reporting-legacy/how-it-works" },
    ],
  },
  {
    title: "Team chat",
    path: "/app/team-chat",
    icon: IconMessageUser,
  },
  {
    title: "Communications",
    path: "/app/communications",
    icon: IconMessages,
  },
  {
    title: "Workflow",
    path: "/app/workflow",
    icon: IconStack2,
    items: [
      { title: "Tasks", path: "/app/workflow" },
      { title: "Jobs", path: "/app/workflow/jobs" },
      { title: "Job recurrences", path: "/app/workflow/job-recurrences" },
      { title: "Pipelines", path: "/app/workflow/pipelines" },
      { title: "Calendar", path: "/app/workflow/calendar" },
    ],
  },
  {
    title: "Documents",
    path: "/app/documents",
    icon: IconFileDescription,
    items: [
      { title: "Clients docs", path: "/app/documents" },
      { title: "Wiki", path: "/app/documents/wiki" },
    ],
  },
  {
    title: "Organizers",
    path: "/app/organizers",
    icon: IconClipboard,
  },
  {
    title: "Billing",
    path: "/app/billing",
    icon: IconReceiptDollar,
    items: [
      { title: "Invoices", path: "/app/billing" },
      { title: "Recurring invoices", path: "/app/billing/recurring-invoices" },
      { title: "Time entries", path: "/app/billing/time-entries" },
      { title: "WIP", path: "/app/billing/wip" },
      { title: "Proposals & ELs", path: "/app/billing/proposals-els" },
      { title: "Payments", path: "/app/billing/payments" },
      { title: "Pricing", path: "/app/billing/services" },
    ],
  },
  {
    title: "Activity feed",
    path: "/app/activity-feed",
    icon: IconActivityHeartbeat,
  },
  {
    title: "Templates",
    path: "/app/templates",
    icon: IconTemplate,
    items: [
      { title: "Firm templates", path: "/app/templates" },
      { title: "Pipelines", path: "/app/templates/pipelines" },
      { title: "Custom fields", path: "/app/templates/custom-fields" },
      { title: "Tags", path: "/app/templates/tags" },
      { title: "Marketplace", path: "/app/templates/marketplace" },
      { title: "Creator hub", path: "/app/templates/creator-hub" },
    ],
  },
  {
    title: "Growth solutions",
    path: "/app/growth-solutions",
    icon: IconRosetteDiscount,
    items: [
      { title: "Support plans", path: "/app/growth-solutions" },
      { title: "Insurance", path: "/app/growth-solutions/insurance" },
      { title: "Perks & offers", path: "/app/growth-solutions/perks-offers" },
      { title: "Refer & earn", path: "/app/growth-solutions/refer-earn" },
    ],
  },
  {
    title: "Settings",
    path: "/app/settings",
    icon: IconSettings,
    items: [
      { title: "Firm settings", path: "/app/settings" },
      { title: "Integrations", path: "/app/settings/integrations" },
      { title: "Team & plans", path: "/app/settings/team-plans" },
      { title: "Firm balance", path: "/app/settings/firm-balance" },
      { title: "Billing", path: "/app/settings/billing" },
      { title: "Site builder", path: "/app/settings/site-builder" },
      { title: "Client signup", path: "/app/settings/client-signup" },
    ],
  },
]

export function getDefaultPath() {
  return productNavigation[0].path
}
