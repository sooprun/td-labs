import {
  IconArchive,
  IconBriefcase,
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
        <Button variant="ghost">More actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72" sideOffset={8}>
        <DropdownMenuItem>
          <IconUsers className="size-4" />
          Manage roles
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconFileInvoice className="size-4" />
          Create invoice
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconBriefcase className="size-4" />
          Create task
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconFolderPlus className="size-4" />
          Apply folder template
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconMessage className="size-4" />
          Send message
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconSend className="size-4" />
          Send proposal
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconFilePencil className="size-4" />
          Send client request
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconUserCheck className="size-4" />
          Follow accounts
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <IconUserX className="size-4" />
          Unfollow accounts
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconMailCancel className="size-4" />
          Cancel scheduled emails
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconLogin className="size-4" />
          Edit login, notify, email sync
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconKey className="size-4" />
          Edit client type
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconArchive className="size-4" />
          Archive accounts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
