import { getDefaultPath, productNavigation } from "@/app/navigation"

export const productRoutes = productNavigation.flatMap((section) => {
  if (!section.items?.length) {
    return [{ title: section.title, path: section.path, section }]
  }

  return section.items.map((item) => ({
    title: item.title,
    path: item.path,
    section,
  }))
})

export function resolveProductRoute(pathname: string) {
  const normalizedPath = pathname === "/" ? getDefaultPath() : pathname
  const route = productRoutes.find((item) => item.path === normalizedPath)

  return route ?? productRoutes.find((item) => item.path === getDefaultPath())
}
