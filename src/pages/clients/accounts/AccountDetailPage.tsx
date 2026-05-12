import * as React from "react"
import {
  IconArrowLeft,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { protoAction } from "@/lib/proto"
import { accounts } from "@/mock/data/accounts"
import { accountJobsMap, type Job, type Task } from "@/mock/data/account-jobs"

// ─── Types ───────────────────────────────────────────────────────────────────

type AccountDetailPageProps = {
  accountId: string
  onBack: () => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TAB_BADGE_CLASS =
  "text-[11px] font-bold bg-[#24C875] text-white rounded-full px-1.5 py-0.5 ml-1"

function isPastDate(dateStr: string | null): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime()) && d < new Date()
}

const STATUS_STYLES: Record<string, string> = {
  "No status":
    "border border-border text-muted-foreground bg-transparent",
  "In progress": "bg-blue-100 text-blue-700 border border-blue-200",
  Completed: "bg-green-100 text-green-700 border border-green-200",
  Extended: "bg-orange-100 text-orange-700 border border-orange-200",
}

const PRIORITY_STYLES: Record<string, string> = {
  High: "border border-red-300 text-red-600",
  Medium: "border border-orange-300 text-orange-500",
  Low: "border border-green-300 text-green-600",
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES["No status"]}`}
    >
      {status}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority] ?? ""}`}
    >
      {priority}
    </span>
  )
}

function AssigneeAvatar({ initials }: { initials: string }) {
  return (
    <span className="flex size-[26px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {initials}
    </span>
  )
}

// ─── Left panel ──────────────────────────────────────────────────────────────

type CollapsibleSectionProps = {
  title: string
  count?: number
  actions: React.ReactNode
  children?: React.ReactNode
}

function CollapsibleSection({
  title,
  count,
  actions,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="border-t px-5 py-4">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 text-sm font-medium"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <IconChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <IconChevronRight className="size-4 text-muted-foreground" />
          )}
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[11px] font-semibold text-muted-foreground">
              {count}
            </span>
          )}
        </button>
        <div className="ml-auto flex items-center gap-3 text-sm text-primary">
          {actions}
        </div>
      </div>
      {open && (
        <div className="mt-3 pl-5">
          {children ?? (
            <p className="text-sm text-muted-foreground">
              No {title.toLowerCase()} yet
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function LeftPanel({
  account,
}: {
  account: NonNullable<ReturnType<typeof accounts.find>>
}) {
  const contactsCount = account.linkedAccounts.length
  const rolesCount = account.team.length

  return (
    <div className="w-72 shrink-0 rounded-xl border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <span className="font-semibold">Account</span>
        <button
          className="text-sm text-primary hover:underline"
          onClick={protoAction("Unfollow account")}
        >
          Unfollow account
        </button>
      </div>

      {/* Notes */}
      <CollapsibleSection
        title="Notes"
        actions={
          <>
            <button className="hover:underline" onClick={protoAction("Create note")}>
              Create
            </button>
            <button className="hover:underline" onClick={protoAction("View all notes")}>
              View all
            </button>
          </>
        }
      />

      {/* Tags & custom fields */}
      <CollapsibleSection
        title="Tags &amp; custom fields"
        count={account.tags.length}
        actions={
          <button className="hover:underline" onClick={protoAction("View tags")}>
            View
          </button>
        }
      >
        {account.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {account.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : undefined}
      </CollapsibleSection>

      {/* Account roles */}
      <CollapsibleSection
        title="Account roles"
        count={rolesCount}
        actions={
          <button className="hover:underline" onClick={protoAction("View all roles")}>
            View all
          </button>
        }
      >
        {rolesCount > 0 ? (
          <div className="flex items-center gap-1">
            {account.team.map((member) => (
              <AssigneeAvatar key={member} initials={member} />
            ))}
          </div>
        ) : undefined}
      </CollapsibleSection>

      {/* Contacts */}
      <CollapsibleSection
        title="Contacts"
        count={contactsCount > 0 ? Math.min(contactsCount, 3) : undefined}
        actions={
          <button className="hover:underline" onClick={protoAction("View all contacts")}>
            View all
          </button>
        }
      >
        {contactsCount > 0 ? (
          <ul className="space-y-1">
            {account.linkedAccounts.slice(0, 3).map((name) => (
              <li key={name}>
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={protoAction(name)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        ) : undefined}
      </CollapsibleSection>
    </div>
  )
}

// ─── Jobs table ──────────────────────────────────────────────────────────────

function JobsTable({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return <p className="text-sm text-muted-foreground">No jobs yet</p>
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-xs font-medium text-muted-foreground">
          <th className="pb-2 pr-4 font-medium">Name</th>
          <th className="pb-2 pr-4 font-medium">Pipeline</th>
          <th className="pb-2 pr-4 font-medium">Stage</th>
          <th className="pb-2 pr-4 font-medium whitespace-nowrap">Internal deadline</th>
          <th className="pb-2 font-medium whitespace-nowrap">Due date</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id} className="border-b last:border-0">
            <td className="py-2.5 pr-4">
              <button
                className="text-primary hover:underline"
                onClick={protoAction(job.name)}
              >
                {job.name}
              </button>
            </td>
            <td className="py-2.5 pr-4 text-muted-foreground">
              <button
                className="hover:underline hover:text-foreground transition-colors"
                onClick={protoAction(job.pipeline)}
              >
                {job.pipeline}
              </button>
            </td>
            <td className="py-2.5 pr-4 text-muted-foreground">{job.stage}</td>
            <td
              className={`py-2.5 pr-4 whitespace-nowrap ${isPastDate(job.internalDeadline) ? "text-red-500" : "text-muted-foreground"}`}
            >
              {job.internalDeadline ?? "—"}
            </td>
            <td
              className={`py-2.5 whitespace-nowrap ${isPastDate(job.dueDate) ? "text-red-500" : "text-muted-foreground"}`}
            >
              {job.dueDate ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── Tasks table ─────────────────────────────────────────────────────────────

function TasksTable({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks yet</p>
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-xs font-medium text-muted-foreground">
          <th className="pb-2 pr-4 font-medium">Name</th>
          <th className="pb-2 pr-4 font-medium">Job</th>
          <th className="pb-2 pr-4 font-medium">Assignee</th>
          <th className="pb-2 pr-4 font-medium">Status</th>
          <th className="pb-2 pr-4 font-medium">Priority</th>
          <th className="pb-2 font-medium whitespace-nowrap">Due date</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="border-b last:border-0">
            <td className="py-2.5 pr-4">
              <button
                className="text-primary hover:underline"
                onClick={protoAction(task.name)}
              >
                {task.name}
              </button>
            </td>
            <td className="py-2.5 pr-4 text-muted-foreground">
              <button
                className="hover:underline hover:text-foreground transition-colors"
                onClick={protoAction(task.job)}
              >
                {task.job}
              </button>
            </td>
            <td className="py-2.5 pr-4">
              <AssigneeAvatar initials={task.assignee} />
            </td>
            <td className="py-2.5 pr-4">
              <StatusBadge status={task.status} />
            </td>
            <td className="py-2.5 pr-4">
              <PriorityBadge priority={task.priority} />
            </td>
            <td
              className={`py-2.5 whitespace-nowrap ${isPastDate(task.dueDate) ? "text-red-500" : "text-muted-foreground"}`}
            >
              {task.dueDate ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ─── Right panel ─────────────────────────────────────────────────────────────

type OverviewSubTab =
  | "jobs"
  | "client-todos"
  | "communication"
  | "docs"
  | "billing"
  | "activity"

function RightPanel({ accountId }: { accountId: string }) {
  const [activeSubTab, setActiveSubTab] =
    React.useState<OverviewSubTab>("jobs")

  const data = accountJobsMap[accountId] ?? { jobs: [], tasks: [] }
  const totalJobsAndTasks = data.jobs.length + data.tasks.length

  const subTabs: { id: OverviewSubTab; label: string; badge?: number }[] = [
    { id: "jobs", label: "Jobs & tasks", badge: totalJobsAndTasks },
    { id: "client-todos", label: "Client to-do's", badge: 25 },
    { id: "communication", label: "Communication" },
    { id: "docs", label: "Docs" },
    { id: "billing", label: "Billing" },
    { id: "activity", label: "Activity" },
  ]

  return (
    <div className="min-w-0 flex-1 rounded-xl border bg-background">
      {/* Header */}
      <div className="px-5 pb-0 pt-5">
        <h2 className="text-lg font-semibold">Overview</h2>
      </div>

      {/* Sub-tabs */}
      <div className="mt-3 flex border-b px-5 gap-0">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center pb-2.5 pt-1 text-sm mr-5 border-b-2 transition-colors ${
              activeSubTab === tab.id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={TAB_BADGE_CLASS}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        {activeSubTab === "jobs" ? (
          <div className="space-y-6">
            {/* Jobs section */}
            <div>
              <div className="mb-3 flex items-center">
                <span className="font-semibold">Jobs</span>
                <button
                  className="ml-auto text-sm text-primary hover:underline"
                  onClick={protoAction("View all jobs")}
                >
                  View all
                </button>
              </div>
              <JobsTable jobs={data.jobs} />
            </div>

            {/* Tasks section */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="font-semibold">Tasks</span>
                {data.tasks.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[11px] font-semibold text-muted-foreground">
                    {data.tasks.length}
                  </span>
                )}
                <button
                  className="ml-auto text-sm text-primary hover:underline"
                  onClick={protoAction("View all tasks")}
                >
                  View all
                </button>
              </div>
              <TasksTable tasks={data.tasks} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Coming soon</p>
        )}
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

const TOP_TABS = [
  { label: "Overview", badge: undefined },
  { label: "Info", badge: undefined },
  { label: "Docs", badge: undefined },
  { label: "Communication", badge: undefined },
  { label: "Organizers", badge: 3 },
  { label: "Requests", badge: 1 },
  { label: "Invoices", badge: 4 },
  { label: "Transactions", badge: undefined },
  { label: "Proposals & ELs", badge: 1 },
  { label: "Notes", badge: undefined },
  { label: "Workflow", badge: undefined },
] as const

type TopTabLabel = (typeof TOP_TABS)[number]["label"]

export function AccountDetailPage({ accountId, onBack }: AccountDetailPageProps) {
  const [activeTopTab, setActiveTopTab] =
    React.useState<TopTabLabel>("Overview")

  const account = accounts.find((a) => a.id === accountId)

  if (!account) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Account not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top tab bar */}
      <div className="flex shrink-0 items-center gap-0 border-b bg-background">
        {/* Back button */}
        <div className="flex shrink-0 items-center px-2">
          <Button size="icon" variant="ghost" onClick={onBack}>
            <IconArrowLeft className="size-4" />
          </Button>
        </div>

        {/* Account name */}
        <span className="shrink-0 pr-3 text-sm font-medium">{account.name}</span>

        {/* Divider */}
        <div className="h-5 w-px shrink-0 bg-border" />

        {/* Scrollable tabs */}
        <div className="flex min-w-0 overflow-x-auto">
          <ul className="flex">
            {TOP_TABS.map((tab) => (
              <li key={tab.label}>
                <button
                  className={`flex h-[49px] items-center px-4 text-sm transition-colors ${
                    activeTopTab === tab.label
                      ? "border-b-2 border-primary font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveTopTab(tab.label)}
                >
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={TAB_BADGE_CLASS}>{tab.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto bg-workspace p-6">
        {activeTopTab === "Overview" ? (
          <div className="flex min-h-full items-start gap-5">
            <LeftPanel account={account} />
            <RightPanel accountId={accountId} />
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">
              {activeTopTab} — coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
