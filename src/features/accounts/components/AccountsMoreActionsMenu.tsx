import {
  IconArchive,
  IconBriefcase,
  IconDotsVertical,
  IconFileInvoice,
  IconFilePencil,
  IconFolderPlus,
  IconKey,
  IconLogin,
  IconMailCancel,
  IconMessage,
  IconSend,
  IconUserCheck,
  IconUserX,
  IconUsers,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AccountsMoreActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-primary hover:bg-[#F2F9FF] hover:text-primary aria-expanded:bg-[#F2F9FF] aria-expanded:text-primary">
          <IconDotsVertical className="size-4" />
          More actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 overflow-hidden rounded-xl p-1.5 shadow-lg"
        sideOffset={8}
      >
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconUsers className="size-4 shrink-0 text-primary" />
          Manage roles
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconFileInvoice className="size-4 shrink-0 text-primary" />
          Create invoice
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconBriefcase className="size-4 shrink-0 text-primary" />
          Create task
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconFolderPlus className="size-4 shrink-0 text-primary" />
          Apply folder template
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconMessage className="size-4 shrink-0 text-primary" />
          Send message
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]" disabled>
          <IconSend className="size-4 shrink-0" />
          Send proposal
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconFilePencil className="size-4 shrink-0 text-primary" />
          Send client request
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconUserCheck className="size-4 shrink-0 text-primary" />
          Follow accounts
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]" disabled>
          <IconUserX className="size-4 shrink-0" />
          Unfollow accounts
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconMailCancel className="size-4 shrink-0 text-primary" />
          Cancel scheduled emails
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconLogin className="size-4 shrink-0 text-primary" />
          Edit login, notify, email sync
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconKey className="size-4 shrink-0 text-primary" />
          Edit client type
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10 gap-3 rounded-lg px-3 text-sm font-medium hover:bg-[#F2F9FF] focus:bg-[#F2F9FF]">
          <IconArchive className="size-4 shrink-0 text-primary" />
          Archive accounts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
