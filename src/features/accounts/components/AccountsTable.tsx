import { IconEyeOff, IconRosetteDiscountCheck } from "@tabler/icons-react"
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

export function AccountsTable({
  accounts,
  selectedIds,
  onToggleAccount,
  onToggleAll,
}: AccountsTableProps) {
  const allSelected =
    accounts.length > 0 && selectedIds.length === accounts.length

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                checked={allSelected}
                className="size-4 rounded border-border"
                onChange={onToggleAll}
                type="checkbox"
              />
            </TableHead>
            <TableHead className="min-w-52">Name</TableHead>
            <TableHead>Mobile app</TableHead>
            <TableHead>Follow</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Balance due</TableHead>
            <TableHead>Net due</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Linked accounts</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>General ledger</TableHead>
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
              <TableCell>
                <input
                  checked={selectedIds.includes(account.id)}
                  className="size-4 rounded border-border"
                  onChange={() => onToggleAccount(account.id)}
                  type="checkbox"
                />
              </TableCell>
              <TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
