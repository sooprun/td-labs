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
      { serviceId: "svc-1",  serviceName: "Individual Tax Return (1040)",    rate: 500, rateType: "Item" },
      { serviceId: "svc-3",  serviceName: "S-Corp Tax Return (1120-S)",       rate: 950, rateType: "Item" },
      { serviceId: "svc-11", serviceName: "Bookkeeping",                      rate: 175, rateType: "Hour" },
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
      { serviceId: "svc-1",  serviceName: "Individual Tax Return (1040)",    rate: 250, rateType: "Item" },
      { serviceId: "svc-11", serviceName: "Bookkeeping",                      rate: 95,  rateType: "Hour" },
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
      { serviceId: "svc-2",  serviceName: "Nonresident Tax Return (1040-NR)", rate: 650, rateType: "Item" },
      { serviceId: "svc-4",  serviceName: "Partnership Tax Return (1065)",    rate: 850, rateType: "Item" },
      { serviceId: "svc-12", serviceName: "Tax Planning",                     rate: 225, rateType: "Hour" },
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
      { serviceId: "svc-11", serviceName: "Bookkeeping",  rate: 120, rateType: "Hour" },
    ],
    members: [
      { id: "tm-mike", name: "Mike Torres", initials: "MT", color: "#10B981" },
    ],
  },
]
