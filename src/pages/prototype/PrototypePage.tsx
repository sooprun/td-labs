import { PageLayout } from "@/components/page/PageLayout"
import { ProtoPlaceholder } from "@/components/page/ProtoPlaceholder"

type PrototypePageProps = {
  icon: React.ElementType
  title: string
  sectionTitle: string
  path: string
}

export function PrototypePage({ icon, title, sectionTitle }: PrototypePageProps) {
  return (
    <PageLayout className="flex min-h-full flex-col">
      <div className="mb-8">
        <h1 className="truncate text-3xl font-semibold tracking-normal">{title}</h1>
        <p className="sr-only">{sectionTitle}</p>
      </div>

      <ProtoPlaceholder title={title} icon={icon} context="page" />
    </PageLayout>
  )
}
