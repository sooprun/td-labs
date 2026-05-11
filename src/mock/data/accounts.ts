export type AccountType = "Individual" | "Company" | "Other"

export type Account = {
  id: string
  name: string
  mobileApp: boolean
  followed: boolean
  type: AccountType
  balanceDue: number
  netDue: number
  credit: number
  linkedAccounts: string[]
  linkedAccountsOverflow?: number
  tasks: number
  ledgerSyncStatus: "Not synced" | "Synced"
}

export const accounts: Account[] = [
  {
    id: "acct-adams",
    name: "Adams",
    mobileApp: false,
    followed: false,
    type: "Individual",
    balanceDue: 1197,
    netDue: 1178,
    credit: 19,
    linkedAccounts: ["Adams co"],
    tasks: 0,
    ledgerSyncStatus: "Not synced",
  },
  {
    id: "acct-adams-co",
    name: "Adams co",
    mobileApp: false,
    followed: false,
    type: "Company",
    balanceDue: 0,
    netDue: 0,
    credit: 34.2,
    linkedAccounts: ["Adams"],
    tasks: 0,
    ledgerSyncStatus: "Not synced",
  },
  {
    id: "acct-bildgewater",
    name: "Bildgewater",
    mobileApp: true,
    followed: false,
    type: "Other",
    balanceDue: 45690,
    netDue: 45020,
    credit: 664,
    linkedAccounts: ["Noxus"],
    linkedAccountsOverflow: 1,
    tasks: 2,
    ledgerSyncStatus: "Not synced",
  },
  {
    id: "acct-clean",
    name: "Clean",
    mobileApp: false,
    followed: false,
    type: "Individual",
    balanceDue: 4017.98,
    netDue: 3840.48,
    credit: 177.5,
    linkedAccounts: ["Clean acc-t"],
    linkedAccountsOverflow: 7,
    tasks: 0,
    ledgerSyncStatus: "Not synced",
  },
  {
    id: "acct-clean-t",
    name: "Clean acc-t",
    mobileApp: false,
    followed: false,
    type: "Individual",
    balanceDue: 886.85,
    netDue: 886.85,
    credit: 0,
    linkedAccounts: ["Clean"],
    linkedAccountsOverflow: 6,
    tasks: 0,
    ledgerSyncStatus: "Not synced",
  },
  {
    id: "acct-daniel-freeman",
    name: "Daniel Freeman",
    mobileApp: false,
    followed: false,
    type: "Individual",
    balanceDue: 16230,
    netDue: 16230,
    credit: 0,
    linkedAccounts: [],
    tasks: 0,
    ledgerSyncStatus: "Not synced",
  },
  {
    id: "acct-external-mail",
    name: "external_mail",
    mobileApp: true,
    followed: false,
    type: "Individual",
    balanceDue: 448.11,
    netDue: 448.11,
    credit: 0,
    linkedAccounts: [],
    tasks: 0,
    ledgerSyncStatus: "Not synced",
  },
  {
    id: "acct-ionia",
    name: "Ionia",
    mobileApp: false,
    followed: false,
    type: "Individual",
    balanceDue: 5524.94,
    netDue: 5524.94,
    credit: 0,
    linkedAccounts: ["Clean"],
    linkedAccountsOverflow: 7,
    tasks: 1,
    ledgerSyncStatus: "Not synced",
  },
  {
    id: "acct-miley-cyrus",
    name: "Miley Cyrus",
    mobileApp: true,
    followed: false,
    type: "Individual",
    balanceDue: 38.45,
    netDue: 30.05,
    credit: 8.4,
    linkedAccounts: [],
    tasks: 0,
    ledgerSyncStatus: "Not synced",
  },
]
