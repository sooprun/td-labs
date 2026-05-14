import { accounts, type Account, type AccountType } from "@/mock/data/accounts"

export type PrototypeAccountScenario = {
  id: string
  title: string
  entryPath: string
  accountIds: string[]
  notes: string
}

export type AccountsBulkCustomRatesScenario = PrototypeAccountScenario & {
  eligibleTypes: AccountType[]
  defaultRateName: string
}

export const accountsBulkCustomRatesScenario: AccountsBulkCustomRatesScenario = {
  id: "accounts-bulk-custom-rates",
  title: "Bulk client overrides",
  entryPath: "/app/clients",
  accountIds: [
    "acct-mary-murphy",
    "acct-murphy-trust",
    "acct-acme-corp",
    "acct-green-valley",
  ],
  eligibleTypes: ["Individual", "Company", "Other"],
  defaultRateName: "2026 advisory rates",
  notes:
    "Use this scenario when prototyping bulk selection, rate assignment, and account-level billing overrides.",
}

export const prototypeAccountScenarios: PrototypeAccountScenario[] = [
  accountsBulkCustomRatesScenario,
  {
    id: "accounts-linked-entities",
    title: "Linked entities review",
    entryPath: "/app/clients",
    accountIds: [
      "acct-mary-murphy",
      "acct-murphy-trust",
      "acct-green-valley",
      "acct-blue-horizon",
    ],
    notes:
      "Use this scenario for account relationship, linked entity, and shared-contact experiments.",
  },
]

export function getAccountsByIds(accountIds: string[]): Account[] {
  const accountIdSet = new Set(accountIds)

  return accounts.filter((account) => accountIdSet.has(account.id))
}
