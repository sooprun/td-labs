import * as React from "react"
import { IconChevronDown, IconInfoCircle } from "@tabler/icons-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// ─── Types ────────────────────────────────────────────────────────────────────

export type Rounding = number

export const ROUNDING_PRESETS: { value: number; label: string }[] = [
  { value: 0,  label: "No rounding" },
  { value: 1,  label: "$1" },
  { value: 5,  label: "$5" },
  { value: 10, label: "$10" },
]

export function applyAdjustment(rate: number, pct: number, rounding: Rounding): number {
  const raw = rate * (1 + pct / 100)
  if (rounding === 0) return Math.round(raw * 100) / 100
  return pct >= 0
    ? Math.ceil(raw / rounding) * rounding
    : Math.floor(raw / rounding) * rounding
}

// ─── RoundingInput ────────────────────────────────────────────────────────────

export function RoundingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [input, setInput] = React.useState(value === 0 ? "" : String(value))

  const handleChange = (raw: string) => {
    setInput(raw)
    const n = parseFloat(raw)
    onChange(!raw || isNaN(n) ? 0 : n)
  }

  return (
    <div className="relative flex w-full items-center">
      <span className="pointer-events-none absolute left-3 text-sm text-muted-foreground">$</span>
      <Input
        type="text"
        inputMode="decimal"
        className="pl-6 pr-9 text-right"
        value={input}
        placeholder="0"
        onChange={(e) => handleChange(e.target.value)}
        onFocus={(e) => { const t = e.target; requestAnimationFrame(() => t.setSelectionRange(t.value.length, t.value.length)) }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute right-2 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground">
            <IconChevronDown className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          {ROUNDING_PRESETS.map((p) => (
            <DropdownMenuItem key={p.value} onSelect={() => { handleChange(p.value === 0 ? "" : String(p.value)) }}>
              {p.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ─── PriceAdjustmentCalculator ────────────────────────────────────────────────

type Props = {
  adjustment: string
  setAdjustment: (v: string) => void
  rounding: Rounding
  setRounding: (v: Rounding) => void
  autoFocus?: boolean
}

export function PriceAdjustmentCalculator({ adjustment, setAdjustment, rounding, setRounding, autoFocus = true }: Props) {
  const pct = parseFloat(adjustment)
  const valid = !isNaN(pct) && pct !== 0

  const example = 137.50
  const afterPct = valid ? example * (1 + pct / 100) : null
  const afterRound = afterPct !== null && rounding > 0
    ? (pct >= 0 ? Math.ceil(afterPct / rounding) * rounding : Math.floor(afterPct / rounding) * rounding)
    : afterPct
  const fmt = (n: number) => n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 flex flex-col gap-2">
          <div className="text-sm font-medium">Adjust by</div>
          <div className="relative w-full">
            <Input
              autoFocus={autoFocus}
              type="text"
              inputMode="decimal"
              className="pr-8 text-right"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              onFocus={(e) => { const t = e.target; requestAnimationFrame(() => t.setSelectionRange(t.value.length, t.value.length)) }}
              placeholder="0"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <div className="text-sm font-medium">Round to</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default text-primary"><IconInfoCircle className="size-4" /></span>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6} className="bg-background text-foreground text-xs border shadow-md max-w-56" hideArrow>
                  Larger rounding values may result in bigger percentage differences across services
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RoundingInput value={rounding} onChange={setRounding} />
        </div>
      </div>

      {afterPct === null ? (
        <p className="text-xs text-muted-foreground">Enter a positive or negative percentage to see how prices will change</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Example: {[fmt(example), fmt(afterPct), rounding > 0 ? fmt(afterRound!) : null].filter(Boolean).join(" → ")}
        </p>
      )}
    </div>
  )
}
