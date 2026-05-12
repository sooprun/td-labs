import { IconChevronUp, IconChevronDown } from "@tabler/icons-react"

export type SortDir = "asc" | "desc"

type SortIconProps = {
  col: string
  sortKey: string
  sortDir: SortDir
}

export function DataTableSortIcon({ col, sortKey, sortDir }: SortIconProps) {
  if (col !== sortKey) {
    return (
      <span className="ml-1 inline-flex flex-col opacity-30">
        <IconChevronUp className="-mb-0.5 size-3" />
        <IconChevronDown className="size-3" />
      </span>
    )
  }
  return sortDir === "asc"
    ? <IconChevronUp className="ml-1 size-3.5 text-primary" />
    : <IconChevronDown className="ml-1 size-3.5 text-primary" />
}
