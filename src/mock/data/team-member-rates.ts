export type TeamMember = {
  id: string
  name: string
  initials: string
  color: string
}

export type RateGroupService = {
  serviceId: string
  serviceName: string
  rate: number
  rateType: "Item" | "Hour"
}

export type RateGroup = {
  id: string
  name: string
  services: RateGroupService[]
  members: TeamMember[]
  archived: boolean
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "tm-alex",  name: "Alex Shaw",    initials: "AS", color: "#7C3AED" },
  { id: "tm-james", name: "James Davis",  initials: "JD", color: "#0EA5E9" },
  { id: "tm-sarah", name: "Sarah Kim",    initials: "SK", color: "#F59E0B" },
  { id: "tm-mike",  name: "Mike Torres",  initials: "MT", color: "#10B981" },
  { id: "tm-helen", name: "Helen Stone",  initials: "HS", color: "#EF4444" },
]

export const rateGroups: RateGroup[] = [
  {
    id: "rg-1",
    name: "Senior Accountants",
    archived: false,
    services: [
      { serviceId: "svc-1040",             serviceName: "Individual Tax Return (1040)",    rate: 500, rateType: "Item" },
      { serviceId: "svc-1120s",            serviceName: "S-Corp Tax Return (1120-S)",      rate: 950, rateType: "Item" },
      { serviceId: "svc-bookkeeping-monthly", serviceName: "Bookkeeping (monthly)",        rate: 175, rateType: "Hour" },
    ],
    members: [
      { id: "tm-alex",  name: "Alex Shaw",   initials: "AS", color: "#7C3AED" },
      { id: "tm-james", name: "James Davis", initials: "JD", color: "#0EA5E9" },
    ],
  },
  {
    id: "rg-2",
    name: "Junior Staff",
    archived: false,
    services: [
      { serviceId: "svc-1040",             serviceName: "Individual Tax Return (1040)",    rate: 250, rateType: "Item" },
      { serviceId: "svc-bookkeeping-monthly", serviceName: "Bookkeeping (monthly)",        rate: 95,  rateType: "Hour" },
    ],
    members: [
      { id: "tm-sarah", name: "Sarah Kim",   initials: "SK", color: "#F59E0B" },
      { id: "tm-mike",  name: "Mike Torres", initials: "MT", color: "#10B981" },
      { id: "tm-helen", name: "Helen Stone", initials: "HS", color: "#EF4444" },
    ],
  },
  {
    id: "rg-3",
    name: "Tax Advisors",
    archived: false,
    services: [
      { serviceId: "svc-1040nr",   serviceName: "Nonresident Tax Return (1040-NR)", rate: 650, rateType: "Item" },
      { serviceId: "svc-1065",     serviceName: "Partnership Tax Return (1065)",    rate: 850, rateType: "Item" },
      { serviceId: "svc-tax-planning", serviceName: "Tax planning",                rate: 225, rateType: "Hour" },
    ],
    members: [
      { id: "tm-alex",  name: "Alex Shaw",   initials: "AS", color: "#7C3AED" },
      { id: "tm-helen", name: "Helen Stone", initials: "HS", color: "#EF4444" },
    ],
  },
  {
    id: "rg-4",
    name: "Bookkeeping Team",
    archived: true,
    services: [
      { serviceId: "svc-bookkeeping-monthly", serviceName: "Bookkeeping (monthly)", rate: 120, rateType: "Hour" },
    ],
    members: [
      { id: "tm-mike", name: "Mike Torres", initials: "MT", color: "#10B981" },
    ],
  },
]
