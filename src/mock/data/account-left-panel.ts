export type Note = {
  id: string
  title: string
  body: string
}

export type ContactDetail = {
  id: string
  name: string
  phone: string | null
  email: string | null
  lastLogin: string | null
  permissions: string
}

export type AccountRole = {
  roleName: string
  members: string[]
}

export type AccountLeftPanelData = {
  notes: Note[]
  contacts: ContactDetail[]
  roles: AccountRole[]
}

export const teamMemberNames: Record<string, string> = {
  AS: "Alex Shaw",
  JD: "James Davis",
}

const defaultData: AccountLeftPanelData = { notes: [], contacts: [], roles: [] }

export const accountLeftPanelMap: Record<string, AccountLeftPanelData> = {
  "acct-mary-murphy": {
    notes: [
      {
        id: "n-mm-1",
        title: "Engagement letter signed",
        body: "Mary signed the engagement letter for the 2023 tax season. All documents received and verified.",
      },
      {
        id: "n-mm-2",
        title: "Follow-up on W-2",
        body: "Called on Apr 2 — W-2 from secondary employer still missing. Client will upload by Apr 5.",
      },
    ],
    contacts: [
      {
        id: "c-mm-1",
        name: "Mary T. Murphy",
        phone: "+1 555-210-4400",
        email: "mary.murphy@example.com",
        lastLogin: "May 1, 2025",
        permissions: "Login, Signatory authority",
      },
    ],
    roles: [
      { roleName: "Tax preparer", members: ["Alex Shaw"] },
      { roleName: "Reviewer", members: ["James Davis"] },
    ],
  },

  "acct-murphy-trust": {
    notes: [
      {
        id: "n-mt-1",
        title: "Trust setup complete",
        body: "Murphy Family Trust established 2019. EIN confirmed. Primary contact is Mary T. Murphy.",
      },
    ],
    contacts: [
      {
        id: "c-mt-1",
        name: "Mary T. Murphy",
        phone: "+1 555-210-4400",
        email: "mary.murphy@example.com",
        lastLogin: "Apr 28, 2025",
        permissions: "Login, Signatory authority",
      },
    ],
    roles: [
      { roleName: "Bookkeeper", members: ["James Davis"] },
      { roleName: "Tax preparer", members: ["Alex Shaw", "James Davis"] },
    ],
  },

  "acct-acme-corp": {
    notes: [
      {
        id: "n-ac-1",
        title: "QBO integration active",
        body: "QuickBooks Online sync enabled Mar 1. Transactions pulling correctly. Last sync Mar 10.",
      },
      {
        id: "n-ac-2",
        title: "Extension filed",
        body: "6-month extension filed Apr 15. New deadline Oct 15. Client notified by email.",
      },
      {
        id: "n-ac-3",
        title: "New contact added",
        body: "CFO Sandra Lee added as secondary contact for billing correspondence.",
      },
    ],
    contacts: [
      {
        id: "c-ac-1",
        name: "Robert Chen",
        phone: "+1 555-840-2200",
        email: "robert.chen@acmecorp.com",
        lastLogin: "May 10, 2025",
        permissions: "Login, Signatory authority",
      },
      {
        id: "c-ac-2",
        name: "Sandra Lee",
        phone: "+1 555-840-2201",
        email: "sandra.lee@acmecorp.com",
        lastLogin: null,
        permissions: "Login",
      },
    ],
    roles: [
      { roleName: "Tax preparer", members: ["Alex Shaw"] },
      { roleName: "Bookkeeper", members: ["Alex Shaw"] },
    ],
  },

  "acct-andrew-lee": {
    notes: [
      {
        id: "n-al-1",
        title: "New client onboarding",
        body: "Andrew referred by Green Valley Enterprises. Onboarding completed Feb 12. First engagement 1040.",
      },
      {
        id: "n-al-2",
        title: "Crypto income disclosure",
        body: "Client disclosed Coinbase activity — approx 14 transactions. Needs Form 8949. Flagged for review.",
      },
    ],
    contacts: [
      {
        id: "c-al-1",
        name: "Andrew Lee",
        phone: "+1 555-370-9900",
        email: "andrew.lee@example.com",
        lastLogin: "May 11, 2025",
        permissions: "Login, Signatory authority",
      },
    ],
    roles: [
      { roleName: "Tax preparer", members: ["James Davis"] },
      { roleName: "Reviewer", members: ["Alex Shaw"] },
    ],
  },

  "acct-green-valley": {
    notes: [
      {
        id: "n-gv-1",
        title: "Multi-entity client",
        body: "Green Valley Enterprises is the parent entity. Linked subsidiary: Green Valley Properties LLC.",
      },
      {
        id: "n-gv-2",
        title: "Q1 payroll issue",
        body: "Payroll discrepancy in Q1 — $2,400 variance. Escalated to James. Resolution pending.",
      },
    ],
    contacts: [
      {
        id: "c-gv-1",
        name: "Patricia Green",
        phone: "+1 555-620-7700",
        email: "patricia.green@greenvalley.com",
        lastLogin: "May 8, 2025",
        permissions: "Login, Signatory authority",
      },
      {
        id: "c-gv-2",
        name: "Mark Green",
        phone: "+1 555-620-7701",
        email: "mark.green@greenvalley.com",
        lastLogin: "Apr 22, 2025",
        permissions: "Login",
      },
    ],
    roles: [
      { roleName: "Tax preparer", members: ["Alex Shaw"] },
      { roleName: "Bookkeeper", members: ["Alex Shaw"] },
      { roleName: "Reviewer", members: ["James Davis"] },
    ],
  },

  "acct-smith-holdings": {
    notes: [
      {
        id: "n-sh-1",
        title: "Real estate holdings review",
        body: "Client owns 8 rental properties. Depreciation schedules need update for 2023. Requires quarterly review.",
      },
    ],
    contacts: [
      {
        id: "c-sh-1",
        name: "William Smith",
        phone: "+1 555-490-3300",
        email: "william.smith@smithholdings.com",
        lastLogin: "Apr 15, 2025",
        permissions: "Login, Signatory authority",
      },
    ],
    roles: [
      { roleName: "Tax preparer", members: ["James Davis"] },
    ],
  },
}

export function getAccountLeftPanel(accountId: string): AccountLeftPanelData {
  return accountLeftPanelMap[accountId] ?? defaultData
}
