export type JobBadge =
  | { type: "number"; value: number; color: "red" | "orange" }
  | { type: "check" }

export type Job = {
  id: string
  name: string
  dueDate: string | null
  timeBudget: string
  timeVariance: string
  timeBudgetSpent: string
  timeAgo: string
  overdueText?: string
  badge?: JobBadge
}

export type Stage = {
  id: string
  name: string
  automationCount: number
  avgTimeInStage?: string
  jobs: Job[]
}

export const pipelineName = "2024 Tax Season"

export const initialStages: Stage[] = [
  {
    id: "welcome-email",
    name: "Welcome email",
    automationCount: 2,
    avgTimeInStage: "3 days",
    jobs: [
      {
        id: "job-1",
        name: "Katherine Wright",
        dueDate: "Apr-15-2025",
        timeBudget: "N/A",
        timeVariance: "N/A",
        timeBudgetSpent: "N/A",
        timeAgo: "2 days",
        badge: { type: "number", value: 6, color: "red" },
      },
      {
        id: "job-2",
        name: "Aliganga Engineering Consultancy",
        dueDate: "Apr-15-2025",
        timeBudget: "N/A",
        timeVariance: "N/A",
        timeBudgetSpent: "N/A",
        timeAgo: "a month",
        overdueText: "26 days overdue",
        badge: { type: "number", value: 6, color: "red" },
      },
    ],
  },
  {
    id: "proposal-sent",
    name: "Proposal sent",
    automationCount: 3,
    jobs: [],
  },
  {
    id: "in-progress",
    name: "In progress",
    automationCount: 1,
    avgTimeInStage: "1 week",
    jobs: [
      {
        id: "job-3",
        name: "Maria SL2 Test",
        dueDate: "Apr-15-2025",
        timeBudget: "N/A",
        timeVariance: "N/A",
        timeBudgetSpent: "N/A",
        timeAgo: "a month",
        badge: { type: "number", value: 2, color: "orange" },
      },
      {
        id: "job-4",
        name: "AAA1",
        dueDate: "May-03-2025",
        timeBudget: "N/A",
        timeVariance: "N/A",
        timeBudgetSpent: "N/A",
        timeAgo: "10 months",
        badge: { type: "number", value: 7, color: "red" },
      },
    ],
  },
  {
    id: "invoice-sent",
    name: "Invoice sent",
    automationCount: 2,
    avgTimeInStage: "5 days",
    jobs: [
      {
        id: "job-5",
        name: "000-1",
        dueDate: "May-03-2025",
        timeBudget: "N/A",
        timeVariance: "N/A",
        timeBudgetSpent: "N/A",
        timeAgo: "a month",
        badge: { type: "check" },
      },
      {
        id: "job-6",
        name: "000-1",
        dueDate: "Aug-14-2025",
        timeBudget: "N/A",
        timeVariance: "N/A",
        timeBudgetSpent: "N/A",
        timeAgo: "a month",
        badge: { type: "check" },
      },
    ],
  },
  {
    id: "completed",
    name: "Completed",
    automationCount: 0,
    jobs: [
      {
        id: "job-7",
        name: "Wright & Associates LLC",
        dueDate: null,
        timeBudget: "N/A",
        timeVariance: "N/A",
        timeBudgetSpent: "N/A",
        timeAgo: "3 days",
        badge: { type: "check" },
      },
    ],
  },
]
