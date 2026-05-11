export type InsightMetric = {
  id: string
  label: string
  value: number
  filter?: string
}

export const jobMetrics: InsightMetric[] = [
  {
    id: "approaching-deadline",
    label: "Approaching deadline",
    value: 0,
    filter: "Today",
  },
  {
    id: "no-activity",
    label: "No activity",
    value: 0,
    filter: "Over 3 days",
  },
  {
    id: "overdue",
    label: "Overdue",
    value: 0,
  },
  {
    id: "in-progress",
    label: "In progress",
    value: 0,
  },
]

export const pendingClientActivityMetrics: InsightMetric[] = [
  { id: "invoices", label: "Invoices", value: 0 },
  { id: "organizers", label: "Organizers", value: 0 },
  { id: "signatures", label: "Signatures", value: 0 },
  { id: "proposals", label: "Proposals", value: 0 },
  { id: "approvals", label: "Approvals", value: 0 },
  { id: "client-requests", label: "Client requests", value: 0 },
]
