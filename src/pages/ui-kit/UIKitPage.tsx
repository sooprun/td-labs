import * as React from "react"
import { PageLayout } from "@/components/page/PageLayout"
import { CurrencyCell, CurrencyInput, PercentInput } from "@/features/billing/components/RateInputs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from "@/components/ui/combobox"
import { IconDots, IconEdit, IconTrash, IconCopy } from "@tabler/icons-react"

// ─── Layout helpers ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="border-b pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-6">
      <span className="w-44 shrink-0 pt-2 text-sm text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function UIKitPage() {
  const [sw1, setSw1] = React.useState(true)
  const [sw2, setSw2] = React.useState(false)
  const [selectVal, setSelectVal] = React.useState("")
  const [currencyA, setCurrencyA] = React.useState("5000")
  const [currencyB, setCurrencyB] = React.useState("150")
  const [currencyC, setCurrencyC] = React.useState("2500")
  const [pct, setPct] = React.useState("15")

  return (
    <PageLayout className="flex min-h-full flex-col gap-10 pb-20">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">UI Kit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Component playground — not in production navigation
        </p>
      </div>

      {/* ── Currency inputs ───────────────────────────────────────────────── */}
      <Section title="Currency inputs">
        <Row label="CurrencyInput">
          <CurrencyInput value={currencyA} onChange={setCurrencyA} suffix="/hr" className="w-32" />
          <CurrencyInput value={currencyA} onChange={setCurrencyA} className="w-28" />
          <CurrencyInput value="" onChange={() => {}} placeholder="Default rate" className="w-36" />
        </Row>
        <Row label="CurrencyCell — dollar=hug">
          <div className="w-52 overflow-hidden rounded border border-border">
            <CurrencyCell value={currencyB} onChange={setCurrencyB} suffix="/hr" dollar="hug" />
          </div>
          <div className="w-52 overflow-hidden rounded border border-border">
            <CurrencyCell value={currencyB} onChange={setCurrencyB} dollar="hug" />
          </div>
        </Row>
        <Row label="CurrencyCell — dollar=left">
          <div className="w-52 overflow-hidden rounded border border-border">
            <CurrencyCell value={currencyC} onChange={setCurrencyC} suffix="/hr" dollar="left" />
          </div>
          <div className="w-52 overflow-hidden rounded border border-border">
            <CurrencyCell value={currencyC} onChange={setCurrencyC} dollar="left" />
          </div>
        </Row>
        <Row label="PercentInput">
          <PercentInput value={pct} onChange={setPct} className="w-24" />
        </Row>
      </Section>

      {/* ── Buttons ───────────────────────────────────────────────────────── */}
      <Section title="Button">
        <Row label="Variants">
          <Button variant="default">Save</Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="ghost">Reset</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">Link</Button>
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline"><IconDots className="size-4" /></Button>
        </Row>
        <Row label="States">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled outline</Button>
        </Row>
      </Section>

      {/* ── Badge ─────────────────────────────────────────────────────────── */}
      <Section title="Badge">
        <Row label="Variants">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </Row>
      </Section>

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <Section title="Input">
        <Row label="Default">
          <Input placeholder="Enter value" className="w-48" />
          <Input placeholder="Disabled" className="w-48" disabled />
          <Input placeholder="Invalid" className="w-48" aria-invalid />
        </Row>
      </Section>

      {/* ── Textarea ──────────────────────────────────────────────────────── */}
      <Section title="Textarea">
        <Row label="Default">
          <Textarea placeholder="Enter description" className="w-80" />
        </Row>
      </Section>

      {/* ── Switch ────────────────────────────────────────────────────────── */}
      <Section title="Switch">
        <Row label="Sizes">
          <div className="flex items-center gap-2">
            <Switch checked={sw1} onCheckedChange={setSw1} />
            <Label>Default</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch size="sm" checked={sw2} onCheckedChange={setSw2} />
            <Label>Small</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch disabled defaultChecked />
            <Label className="text-muted-foreground">Disabled on</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch disabled />
            <Label className="text-muted-foreground">Disabled off</Label>
          </div>
        </Row>
      </Section>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <Section title="Tabs">
        <Row label="Default">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-sm text-muted-foreground">Overview content</p>
            </TabsContent>
            <TabsContent value="billing">
              <p className="text-sm text-muted-foreground">Billing content</p>
            </TabsContent>
            <TabsContent value="documents">
              <p className="text-sm text-muted-foreground">Documents content</p>
            </TabsContent>
          </Tabs>
        </Row>
      </Section>

      {/* ── Select ────────────────────────────────────────────────────────── */}
      <Section title="Select">
        <Row label="Default">
          <Select value={selectVal} onValueChange={setSelectVal}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
              <SelectItem value="tax">Tax preparation</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="advisory">Advisory</SelectItem>
            </SelectContent>
          </Select>
        </Row>
      </Section>

      {/* ── Combobox ──────────────────────────────────────────────────────── */}
      <Section title="Combobox">
        <Row label="Default">
          <Combobox>
            <ComboboxInput placeholder="Search team member" className="w-52" />
            <ComboboxContent>
              <ComboboxList>
                <ComboboxItem value="alice">Alice Johnson</ComboboxItem>
                <ComboboxItem value="bob">Bob Smith</ComboboxItem>
                <ComboboxItem value="carol">Carol Williams</ComboboxItem>
                <ComboboxItem value="david">David Brown</ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Row>
      </Section>

      {/* ── Dropdown menu ─────────────────────────────────────────────────── */}
      <Section title="Dropdown menu">
        <Row label="Default">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <IconDots className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <IconEdit className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCopy className="size-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <IconTrash className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Section>

      {/* ── Tooltip ───────────────────────────────────────────────────────── */}
      <Section title="Tooltip">
        <Row label="Default">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Row>
      </Section>

      {/* ── Dialog ────────────────────────────────────────────────────────── */}
      <Section title="Dialog">
        <Row label="Default">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>
                  This is a description of what this dialog does and what will happen.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Section>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <Section title="Table">
        <Row label="Default">
          <div className="w-full max-w-xl overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Tax return</TableCell>
                  <TableCell>Tax</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bookkeeping</TableCell>
                  <TableCell>Accounting</TableCell>
                  <TableCell className="text-right">$120.00/hr</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Payroll setup</TableCell>
                  <TableCell>Payroll</TableCell>
                  <TableCell className="text-right">$500.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Row>
      </Section>

      {/* ── Skeleton ──────────────────────────────────────────────────────── */}
      <Section title="Skeleton">
        <Row label="Default">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="size-10 rounded-full" />
        </Row>
      </Section>
    </PageLayout>
  )
}
