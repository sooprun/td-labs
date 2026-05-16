import * as React from "react"
import { IconPencil } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"

// ─── CurrencyInput ────────────────────────────────────────────────────────────
//
// Input for monetary values. Built-in UX rules:
// - Clicks select all text (makes editing fast — no need to triple-click)
// - On blur: formats to N decimal places via `decimals` prop (default 2, e.g. "150" → "150.00")
// - $ prefix is always shown
// - Optional text suffix (e.g. "/hr") via `suffix` prop
// - Optional interactive trailing slot (e.g. dropdown) via `trailing` prop
//   Note: `suffix` and `trailing` are mutually exclusive — they overlap if combined

type CurrencyInputProps = {
  value: string
  onChange: (v: string) => void
  onFocus?: () => void
  onBlur?: () => void
  placeholder?: string
  suffix?: string        // text suffix, e.g. "/hr" — mutually exclusive with trailing
  trailing?: React.ReactNode  // interactive slot, e.g. dropdown trigger
  className?: string     // width, e.g. "w-28" or "w-40"
  decimals?: number      // decimal places on blur (default 2, use 0 for whole numbers)
  autoFocus?: boolean
}

export function CurrencyInput({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = "0.00",
  suffix,
  trailing,
  className = "w-28",
  decimals = 2,
  autoFocus,
}: CurrencyInputProps) {
  const parsed = parseFloat(value)
  const displayVal = value && !isNaN(parsed) ? parsed.toFixed(decimals) : value

  const hasRight = suffix || trailing
  return (
    <div className={`relative shrink-0 ${className}`}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
      <Input
        type="text"
        inputMode="decimal"
        autoFocus={autoFocus}
        className={`pl-6 text-right text-sm ${hasRight ? (trailing ? "pr-9" : "pr-8") : ""}`}
        value={displayVal}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          onFocus?.()
          const t = e.target
          requestAnimationFrame(() => t.select())
        }}
        onBlur={() => onBlur?.()}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      )}
      {trailing && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {trailing}
        </div>
      )}
    </div>
  )
}

// ─── CurrencyCell ─────────────────────────────────────────────────────────────
//
// Inline-editable currency cell for tables. Built-in UX rules:
// - No border/radius — fills the table cell flush
// - Clicks select all text
// - Formats to N decimal places via `decimals` prop (default 2)
// - Pencil icon indicates editability (gray → blue on hover/focus)
// - Hover: light blue background + 2px blue bottom border
// - Focus: transparent background + 2px blue bottom border

type CurrencyCellProps = {
  value: string
  onChange: (v: string) => void
  suffix?: string    // e.g. "/hr"
  decimals?: number  // default 2
}

export function CurrencyCell({
  value,
  onChange,
  suffix,
  decimals = 2,
}: CurrencyCellProps) {
  const parsed = parseFloat(value)
  const displayVal = value && !isNaN(parsed) ? parsed.toFixed(decimals) : value

  return (
    <div className="group flex h-full w-full items-center justify-end gap-2 border-b-2 border-transparent px-3 py-2 transition-colors hover:border-primary hover:bg-primary/5 focus-within:border-primary focus-within:bg-transparent">
      {/* $ + value grouped together, right-aligned */}
      <div className="flex items-center gap-0.5">
        <span className="pointer-events-none text-sm text-muted-foreground">$</span>
        <input
          type="text"
          inputMode="decimal"
          className="w-20 min-w-0 bg-transparent text-right text-sm outline-none"
          value={displayVal}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => {
            const t = e.target
            requestAnimationFrame(() => t.select())
          }}
        />
        {suffix && (
          <span className="pointer-events-none text-xs text-muted-foreground">{suffix}</span>
        )}
      </div>
      <IconPencil className="size-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary group-focus-within:text-primary" />
    </div>
  )
}

// ─── PercentInput ─────────────────────────────────────────────────────────────
//
// Input for percentage values. Built-in UX rules:
// - Clicks select all text
// - % suffix is always shown on the right

type PercentInputProps = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function PercentInput({
  value,
  onChange,
  placeholder = "0",
  className = "w-full",
  autoFocus,
}: PercentInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        inputMode="decimal"
        autoFocus={autoFocus}
        className="pr-8 text-right"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          const t = e.target
          requestAnimationFrame(() => t.select())
        }}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
    </div>
  )
}
