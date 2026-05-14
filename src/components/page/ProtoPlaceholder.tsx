import * as React from "react"
import { IconBox } from "@tabler/icons-react"

type ProtoPlaceholderProps = {
  title: string
  icon?: React.ElementType
  context?: "tab" | "page"
}

export function ProtoPlaceholder({ title, icon: Icon = IconBox, context = "tab" }: ProtoPlaceholderProps) {
  return (
    <div className="flex flex-1 items-center justify-center pb-24 pt-16 text-center">
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <Icon className="mb-4 size-16 text-muted-foreground/40" strokeWidth={1.25} />
        <h2 className="text-xl font-semibold tracking-normal">
          Nothing to see here — {title} isn't in this prototype
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Focus is elsewhere for now. Try a different {context}.
        </p>
      </div>
    </div>
  )
}
