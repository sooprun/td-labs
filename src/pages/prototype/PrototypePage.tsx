import { PageLayout } from "@/components/page/PageLayout"

type PrototypePageProps = {
  icon: React.ElementType
  title: string
  sectionTitle: string
  path: string
}

export function PrototypePage({ icon: Icon, title, sectionTitle }: PrototypePageProps) {
  return (
    <PageLayout className="flex min-h-full flex-col">
      <div className="mb-8">
        <h1 className="truncate text-3xl font-semibold tracking-normal">{title}</h1>
        <p className="sr-only">{sectionTitle}</p>
      </div>

      <div className="flex flex-1 items-center justify-center pb-24 pt-16 text-center">
        <div className="mx-auto flex max-w-lg flex-col items-center">
          <Icon className="mb-6 size-16 text-muted-foreground/40" strokeWidth={1.25} />
          <h2 className="text-xl font-semibold tracking-normal">
            {title} isn't part of this prototype yet
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Everything's working — this section just hasn't been built out. Try a different page.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
