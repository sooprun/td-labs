import { IconCirclePlus, IconFileSearch } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/page/PageLayout"
import { StatusTabs } from "@/components/page/StatusTabs"

type PrototypePageProps = {
  title: string
  sectionTitle: string
  path: string
}

export function PrototypePage({
  title,
  sectionTitle,
  path,
}: PrototypePageProps) {
  const isServicesPage = path === "/app/billing/services"
  const showTabs = isServicesPage || title.includes("Invoices")

  return (
    <PageLayout className="flex min-h-full flex-col">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-semibold tracking-normal">
            {title}
          </h1>
          <p className="sr-only">{sectionTitle}</p>
        </div>
        <PageActions title={title} />
      </div>

      {showTabs ? (
        <StatusTabs tabs={[{ label: "Active", active: true }, { label: "Archived" }]} />
      ) : null}

      <div className="flex flex-1 items-center justify-center pb-24 pt-16 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <IconFileSearch className="mb-6 size-16 text-muted-foreground/60" />
          <h2 className="text-xl font-semibold tracking-normal">
            {getEmptyTitle(title)}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {getEmptyDescription(title)}
          </p>
          <Button className="mt-8" variant="link">
            <IconCirclePlus className="size-4" />
            {getPrimaryAction(title)}
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}


function PageActions({ title }: { title: string }) {
  if (title === "Services") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button>New service</Button>
        <Button variant="outline">Copy from library</Button>
        <Button variant="link">Copy from QuickBooks</Button>
      </div>
    )
  }

  if (title.includes("Invoices")) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button>New invoice</Button>
        <Button variant="outline">Import</Button>
      </div>
    )
  }

  return null
}

function getEmptyTitle(title: string) {
  if (title === "Services") {
    return "Turn your work into clear billables"
  }

  return `No ${title.toLowerCase()} yet`
}

function getEmptyDescription(title: string) {
  if (title === "Services") {
    return "Use services to track time and itemize invoices, so clients always know exactly what they're paying for."
  }

  return "This area is ready for prototype data. Add records here when this section becomes part of a product flow."
}

function getPrimaryAction(title: string) {
  if (title === "Services") {
    return "New service"
  }

  if (title.includes("Invoices")) {
    return "New invoice"
  }

  return `New ${title.toLowerCase()}`
}
