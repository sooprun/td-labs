import {
  IconBell,
  IconBellOff,
  IconCheck,
  IconEyeOff,
  IconMail,
  IconMailOff,
  IconRosetteDiscountCheck,
} from "@tabler/icons-react"
import { protoAction } from "@/lib/proto"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Account } from "@/mock/data/accounts"
import { formatCurrency } from "@/lib/formatters"

type AccountsTableProps = {
  accounts: Account[]
  selectedIds: string[]
  onToggleAccount: (accountId: string) => void
  onToggleAll: () => void
}

const stickyCheckbox = "col-sticky-cb w-12"
const stickyName = "col-sticky-name min-w-52"

export function AccountsTable({
  accounts,
  selectedIds,
  onToggleAccount,
  onToggleAll,
}: AccountsTableProps) {
  const allSelected =
    accounts.length > 0 && selectedIds.length === accounts.length

  return (
    <div className="table-striped overflow-x-auto rounded-lg border bg-background">
      <Table>
        <TableHeader className="sticky top-0 z-40 bg-background">
          <TableRow>
            <TableHead className={stickyCheckbox}>
              <input
                checked={allSelected}
                className="size-4 rounded border-border"
                onChange={onToggleAll}
                type="checkbox"
              />
            </TableHead>
            <TableHead className={stickyName}>Name</TableHead>
            <TableHead className="whitespace-nowrap">Mobile app</TableHead>
            <TableHead>Follow</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="whitespace-nowrap">Balance due</TableHead>
            <TableHead className="whitespace-nowrap">Net due</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead className="whitespace-nowrap">Linked accounts</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead className="whitespace-nowrap">General ledger</TableHead>
            <TableHead className="whitespace-nowrap">Transactions responded</TableHead>
            <TableHead className="whitespace-nowrap">Transactions awaiting</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Proposals</TableHead>
            <TableHead className="whitespace-nowrap">Unread chats</TableHead>
            <TableHead className="whitespace-nowrap">Pending organizers</TableHead>
            <TableHead className="whitespace-nowrap">Pending signatures</TableHead>
            <TableHead className="whitespace-nowrap">Pending client requests</TableHead>
            <TableHead>Notify</TableHead>
            <TableHead className="whitespace-nowrap">Email sync</TableHead>
            <TableHead className="whitespace-nowrap">Last login</TableHead>
            <TableHead>Checklist</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow
              data-state={
                selectedIds.includes(account.id) ? "selected" : undefined
              }
              key={account.id}
            >
              <TableCell className={stickyCheckbox}>
                <input
                  checked={selectedIds.includes(account.id)}
                  className="size-4 rounded border-border"
                  onChange={() => onToggleAccount(account.id)}
                  type="checkbox"
                />
              </TableCell>
              <TableCell className={stickyName}>
                <button className="font-medium text-primary hover:underline" onClick={protoAction(account.name)}>
                  {account.name}
                </button>
              </TableCell>
              <TableCell>
                {account.mobileApp ? (
                  <IconRosetteDiscountCheck className="size-5 text-primary" />
                ) : null}
              </TableCell>
              <TableCell>
                {account.followed ? null : (
                  <IconEyeOff className="size-5 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell>{formatCurrency(account.balanceDue)}</TableCell>
              <TableCell>{formatCurrency(account.netDue)}</TableCell>
              <TableCell>{formatCurrency(account.credit)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {account.linkedAccounts.slice(0, 1).map((linkedAccount) => (
                    <Badge key={linkedAccount} variant="secondary">
                      {linkedAccount}
                    </Badge>
                  ))}
                  {account.linkedAccountsOverflow ? (
                    <Badge variant="secondary">
                      +{account.linkedAccountsOverflow}
                    </Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>{account.tasks || ""}</TableCell>
              <TableCell>
                <Badge variant="secondary">{account.ledgerSyncStatus}</Badge>
              </TableCell>
              <TableCell>{account.transactionsResponded || ""}</TableCell>
              <TableCell>{account.transactionsAwaiting || ""}</TableCell>
              <TableCell>
                <div className="flex items-center gap-0.5">
                  {account.team.map((member) => (
                    <span
                      key={member}
                      className="flex size-[26px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {account.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{account.proposals || ""}</TableCell>
              <TableCell>{account.unreadChats || ""}</TableCell>
              <TableCell>{account.pendingOrganizers || ""}</TableCell>
              <TableCell>{account.pendingSignatures || ""}</TableCell>
              <TableCell>{account.pendingClientRequests || ""}</TableCell>
              <TableCell>
                {account.notify ? (
                  <IconBell className="size-5 text-primary" />
                ) : (
                  <IconBellOff className="size-5 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell>
                {account.emailSync ? (
                  <IconMail className="size-5 text-primary" />
                ) : (
                  <IconMailOff className="size-5 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {account.lastLogin ?? "—"}
              </TableCell>
              <TableCell>
                {account.checklist ? (
                  <span className="flex items-center gap-1 text-sm">
                    <IconCheck className="size-4 text-[#24C875]" />
                    {account.checklist}
                  </span>
                ) : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
