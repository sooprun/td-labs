export type Job = {
  id: string
  clientName: string
  clientInitials: string
  jobTitle: string
  tags: string[]
  priority?: "High" | "Medium" | "Low"
  assignees: string[]
  daysInStage: number
}

export type Stage = {
  id: string
  name: string
  automationCount: number
  jobs: Job[]
}

export const pipelineName = "2024 Tax Season"

export const initialStages: Stage[] = [
  {
    id: "welcome-email",
    name: "Welcome email",
    automationCount: 0,
    jobs: [
      {
        id: "job-1",
        clientName: "Katherine Wright",
        clientInitials: "KW",
        jobTitle: "1040 Individual Return",
        tags: ["1040"],
        priority: "Medium",
        assignees: ["AM"],
        daysInStage: 1,
      },
    ],
  },
  {
    id: "proposal-sent",
    name: "Proposal sent",
    automationCount: 0,
    jobs: [],
  },
  {
    id: "in-progress",
    name: "In progress",
    automationCount: 0,
    jobs: [],
  },
  {
    id: "invoice-sent",
    name: "Invoice sent",
    automationCount: 0,
    jobs: [],
  },
  {
    id: "completed",
    name: "Completed",
    automationCount: 0,
    jobs: [],
  },
]
