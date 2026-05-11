import type { Icon } from "@tabler/icons-react"

export type ProductNavItem = {
  title: string
  path: string
}

export type ProductNavSection = {
  title: string
  path: string
  icon: Icon
  items?: ProductNavItem[]
}
