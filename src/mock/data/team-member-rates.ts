export type TeamMember = {
  id: string
  name: string
  initials: string
  color: string
}

export type RateGroupService = {
  serviceId: string
  rate: number
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
      { serviceId: "svc-1040",              rate: 500 },
      { serviceId: "svc-1120s",             rate: 950 },
      { serviceId: "svc-bookkeeping-monthly", rate: 175 },
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
      { serviceId: "svc-1040",              rate: 250 },
      { serviceId: "svc-bookkeeping-monthly", rate: 95  },
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
      { serviceId: "svc-1040nr",       rate: 650 },
      { serviceId: "svc-1065",         rate: 850 },
      { serviceId: "svc-tax-planning", rate: 225 },
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
      { serviceId: "svc-bookkeeping-monthly", rate: 120 },
    ],
    members: [
      { id: "tm-mike", name: "Mike Torres", initials: "MT", color: "#10B981" },
    ],
  },
]
