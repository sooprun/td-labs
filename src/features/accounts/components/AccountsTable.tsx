import {
  IconBell,
  IconBellOff,
  IconCheck,
  IconEyeOff,
  IconMail,
  IconMailOff,
  IconRosetteDiscountCheck,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableSortIcon, type SortDir } from "@/components/data-table/DataTableSortIcon"
import type { Account } from "@/mock/accounts"
import { formatCurrency } from "@/lib/formatters"

export type AccountSortKey = "name" | "type" | "balanceDue" | "netDue" | "tasks" | "lastLogin"

type AccountsTableProps = {
  accounts: Account[]
  selectedIds: string[]
  onToggleAccount: (accountId: string) => void
  onToggleAll: () => void
  onNavigate: (path: string) => void
  sortKey: AccountSortKey
  sortDir: SortDir
  onSort: (key: AccountSortKey) => void
}

const stickyCheckbox = "col-sticky-cb w-12"
const stickyName = "col-sticky-name min-w-52"

export function AccountsTable({
  accounts,
  selectedIds,
  onToggleAccount,
  onToggleAll,
  onNavigate,
  sortKey,
  sortDir,
  onSort,
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
                className="table-checkbox"
                onChange={onToggleAll}
                type="checkbox"
              />
            </TableHead>
            <TableHead className={`${stickyName} cursor-pointer select-none hover:text-foreground`} onClick={() => onSort("name")}>
              <span className="inline-flex items-center">Name <DataTableSortIcon col="name" sortKey={sortKey} sortDir={sortDir} /></span>
            </TableHead>
            <TableHead className="whitespace-nowrap">Mobile app</TableHead>
            <TableHead>Follow</TableHead>
            <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => onSort("type")}>
              <span className="inline-flex items-center">Type <DataTableSortIcon col="type" sortKey={sortKey} sortDir={sortDir} /></span>
            </TableHead>
            <TableHead className="cursor-pointer select-none whitespace-nowrap hover:text-foreground" onClick={() => onSort("balanceDue")}>
              <span className="inline-flex items-center">Balance due <DataTableSortIcon col="balanceDue" sortKey={sortKey} sortDir={sortDir} /></span>
            </TableHead>
            <TableHead className="cursor-pointer select-none whitespace-nowrap hover:text-foreground" onClick={() => onSort("netDue")}>
              <span className="inline-flex items-center">Net due <DataTableSortIcon col="netDue" sortKey={sortKey} sortDir={sortDir} /></span>
            </TableHead>
            <TableHead>Credit</TableHead>
            <TableHead className="whitespace-nowrap">Linked accounts</TableHead>
            <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => onSort("tasks")}>
              <span className="inline-flex items-center">Tasks <DataTableSortIcon col="tasks" sortKey={sortKey} sortDir={sortDir} /></span>
            </TableHead>
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
            <TableHead className="cursor-pointer select-none whitespace-nowrap hover:text-foreground" onClick={() => onSort("lastLogin")}>
              <span className="inline-flex items-center">Last login <DataTableSortIcon col="lastLogin" sortKey={sortKey} sortDir={sortDir} /></span>
            </TableHead>
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
                  className="table-checkbox"
                  onChange={() => onToggleAccount(account.id)}
                  type="checkbox"
                />
              </TableCell>
              <TableCell className={stickyName}>
                <button className="font-medium text-primary hover:underline" onClick={() => onNavigate(`/app/clients/${account.id}`)}>
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
