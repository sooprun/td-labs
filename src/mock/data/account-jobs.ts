export type JobStatus = "No status" | "In progress" | "Completed" | "Extended"
export type JobPriority = "High" | "Medium" | "Low"
export type JobStage = "In progress" | "Review" | "Awaiting client" | "Filed"

export type Job = {
  id: string
  name: string
  pipeline: string
  stage: JobStage
  internalDeadline: string | null
  dueDate: string | null
}

export type Task = {
  id: string
  name: string
  job: string
  assignee: string
  status: JobStatus
  priority: JobPriority
  dueDate: string | null
}

export type AccountJobs = {
  jobs: Job[]
  tasks: Task[]
}

export const accountJobsMap: Record<string, AccountJobs> = {
  "acct-andrew-lee": {
    jobs: [
      {
        id: "job-al-1",
        name: "2023 1040 Tax Return",
        pipeline: "Individual Tax Returns (1040)",
        stage: "Review",
        internalDeadline: "Mar 15, 2024",
        dueDate: "Apr 15, 2024",
      },
      {
        id: "job-al-2",
        name: "Q1 2024 Tax Estimate",
        pipeline: "Individual Tax Returns (1040)",
        stage: "Awaiting client",
        internalDeadline: "Mar 31, 2024",
        dueDate: "Apr 15, 2024",
      },
      {
        id: "job-al-3",
        name: "Feb 2024 Bookkeeping",
        pipeline: "Monthly Bookkeeping",
        stage: "In progress",
        internalDeadline: "Mar 10, 2024",
        dueDate: "Mar 20, 2024",
      },
    ],
    tasks: [
      {
        id: "task-al-1",
        name: "Upload W-2 and 1099 Forms",
        job: "2023 1040 Tax Return",
        assignee: "JD",
        status: "Completed",
        priority: "High",
        dueDate: "Feb 28, 2024",
      },
      {
        id: "task-al-2",
        name: "Review and Approve Tax Return",
        job: "2023 1040 Tax Return",
        assignee: "JD",
        status: "In progress",
        priority: "High",
        dueDate: "Apr 10, 2024",
      },
      {
        id: "task-al-3",
        name: "E-Sign Form 8879",
        job: "2023 1040 Tax Return",
        assignee: "AS",
        status: "No status",
        priority: "Medium",
        dueDate: "Apr 12, 2024",
      },
      {
        id: "task-al-4",
        name: "Confirm Business Address",
        job: "Q1 2024 Tax Estimate",
        assignee: "JD",
        status: "No status",
        priority: "Low",
        dueDate: "Mar 25, 2024",
      },
      {
        id: "task-al-5",
        name: "Provide Bank Statements",
        job: "Feb 2024 Bookkeeping",
        assignee: "AS",
        status: "In progress",
        priority: "Medium",
        dueDate: "Mar 10, 2024",
      },
    ],
  },

  "acct-acme-corp": {
    jobs: [
      {
        id: "job-ac-1",
        name: "2023 1120S Return",
        pipeline: "Corporate Tax Returns (1120S)",
        stage: "Review",
        internalDeadline: "Feb 28, 2024",
        dueDate: "Mar 15, 2024",
      },
      {
        id: "job-ac-2",
        name: "Feb 2024 Bookkeeping",
        pipeline: "Monthly Bookkeeping",
        stage: "In progress",
        internalDeadline: "Mar 5, 2024",
        dueDate: "Mar 15, 2024",
      },
    ],
    tasks: [
      {
        id: "task-ac-1",
        name: "Review and Approve Tax Return",
        job: "2023 1120S Return",
        assignee: "AS",
        status: "In progress",
        priority: "High",
        dueDate: "Mar 10, 2024",
      },
      {
        id: "task-ac-2",
        name: "Confirm Business Address",
        job: "2023 1120S Return",
        assignee: "AS",
        status: "Completed",
        priority: "Low",
        dueDate: "Aug 18, 2021",
      },
      {
        id: "task-ac-3",
        name: "Provide Bank Statements",
        job: "Feb 2024 Bookkeeping",
        assignee: "AS",
        status: "No status",
        priority: "Medium",
        dueDate: "Mar 8, 2024",
      },
    ],
  },

  "acct-green-valley": {
    jobs: [
      {
        id: "job-gv-1",
        name: "2023 1120S Return",
        pipeline: "Corporate Tax Returns (1120S)",
        stage: "Filed",
        internalDeadline: "Feb 20, 2024",
        dueDate: "Mar 15, 2024",
      },
      {
        id: "job-gv-2",
        name: "2023 Partnership Tax Return",
        pipeline: "Corporate Tax Returns (1120S)",
        stage: "Review",
        internalDeadline: "Mar 1, 2024",
        dueDate: "Mar 15, 2024",
      },
      {
        id: "job-gv-3",
        name: "Feb 2024 Bookkeeping",
        pipeline: "Monthly Bookkeeping",
        stage: "Completed" as unknown as JobStage,
        internalDeadline: "Mar 3, 2024",
        dueDate: "Mar 10, 2024",
      },
      {
        id: "job-gv-4",
        name: "Q1 2024 Tax Estimate",
        pipeline: "Individual Tax Returns (1040)",
        stage: "Awaiting client",
        internalDeadline: "Apr 1, 2024",
        dueDate: "Apr 15, 2024",
      },
    ],
    tasks: [
      {
        id: "task-gv-1",
        name: "Upload W-2 and 1099 Forms",
        job: "2023 1120S Return",
        assignee: "AS",
        status: "Completed",
        priority: "High",
        dueDate: "Aug 18, 2021",
      },
      {
        id: "task-gv-2",
        name: "Review and Approve Tax Return",
        job: "2023 Partnership Tax Return",
        assignee: "AS",
        status: "In progress",
        priority: "High",
        dueDate: "Mar 12, 2024",
      },
      {
        id: "task-gv-3",
        name: "Provide Bank Statements",
        job: "Feb 2024 Bookkeeping",
        assignee: "AS",
        status: "Completed",
        priority: "Medium",
        dueDate: "Mar 5, 2024",
      },
      {
        id: "task-gv-4",
        name: "E-Sign Form 8879",
        job: "Q1 2024 Tax Estimate",
        assignee: "AS",
        status: "No status",
        priority: "Low",
        dueDate: "Apr 12, 2024",
      },
    ],
  },

  "acct-murphy-trust": {
    jobs: [
      {
        id: "job-mt-1",
        name: "2023 1040 Tax Return",
        pipeline: "Individual Tax Returns (1040)",
        stage: "Awaiting client",
        internalDeadline: "Mar 20, 2024",
        dueDate: "Apr 15, 2024",
      },
    ],
    tasks: [
      {
        id: "task-mt-1",
        name: "Upload W-2 and 1099 Forms",
        job: "2023 1040 Tax Return",
        assignee: "AS",
        status: "No status",
        priority: "High",
        dueDate: "Mar 15, 2024",
      },
      {
        id: "task-mt-2",
        name: "E-Sign Form 8879",
        job: "2023 1040 Tax Return",
        assignee: "JD",
        status: "Extended",
        priority: "Medium",
        dueDate: "Apr 10, 2024",
      },
    ],
  },

  "acct-smith-holdings": {
    jobs: [
      {
        id: "job-sh-1",
        name: "2023 Partnership Tax Return",
        pipeline: "Corporate Tax Returns (1120S)",
        stage: "In progress",
        internalDeadline: "Mar 5, 2024",
        dueDate: "Mar 15, 2024",
      },
    ],
    tasks: [
      {
        id: "task-sh-1",
        name: "Confirm Business Address",
        job: "2023 Partnership Tax Return",
        assignee: "AS",
        status: "In progress",
        priority: "Medium",
        dueDate: "Mar 8, 2024",
      },
    ],
  },

  "acct-mary-murphy": {
    jobs: [
      {
        id: "job-mm-1",
        name: "2023 1040 Tax Return",
        pipeline: "Individual Tax Returns (1040)",
        stage: "Filed",
        internalDeadline: "Apr 1, 2024",
        dueDate: "Apr 15, 2024",
      },
    ],
    tasks: [
      {
        id: "task-mm-1",
        name: "Review and Approve Tax Return",
        job: "2023 1040 Tax Return",
        assignee: "AS",
        status: "Completed",
        priority: "Low",
        dueDate: "Apr 8, 2024",
      },
    ],
  },
}
