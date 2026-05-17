import * as React from "react"
import { IconPencil } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"

// ─── Shared helpers ───────────────────────────────────────────────────────────

function parseCurrency(v: string) {
  return parseFloat(v.replace(/,/g, ""))
}

function formatCurrency(n: number, decimals: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

// ─── CurrencyInput ────────────────────────────────────────────────────────────
//
// Input for monetary values. Built-in UX rules:
// - On focus: shows formatted value selected ("5,000.00" highlighted) — what you see is what you select
// - While typing: shows raw input (no formatting interference)
// - On blur: formats with thousands separator + N decimal places ("5000" → "5,000.00")
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
  placeholder,  // if set → show placeholder when empty; if omitted → reset to "0" on blur
  suffix,
  trailing,
  className = "w-28",
  decimals = 2,
  autoFocus,
}: CurrencyInputProps) {
  // isTyping: true only after the first keystroke — until then we keep showing the formatted value
  const [isTyping, setIsTyping] = React.useState(false)

  const parsed = parseCurrency(value)
  const formatted = value && !isNaN(parsed) ? formatCurrency(parsed, decimals) : value

  // Focused but not yet typing → show formatted ("5,000.00") so select-all shows what user saw
  // Typing → show raw (no interference while entering digits)
  // Blurred → show formatted
  const displayVal = isTyping ? value : formatted

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
        onChange={(e) => {
          setIsTyping(true)
          onChange(e.target.value)
        }}
        onFocus={(e) => {
          setIsTyping(false)  // reset so we show formatted on each new focus
          onFocus?.()
          const t = e.target
          requestAnimationFrame(() => t.select())
        }}
        onBlur={() => {
          setIsTyping(false)
          // No placeholder → reset empty to "0" so field never stays blank
          // Placeholder set → leave empty so placeholder is visible
          if (!value.trim() && !placeholder) onChange("0")
          onBlur?.()
        }}
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
// - Entire highlighted area is clickable (not just the narrow input width)
// - On focus: shows formatted value selected ("5,000.00" highlighted) — what you see is what you select
// - While typing: shows raw input (no formatting interference)
// - On blur: formats with thousands separator + N decimal places ("5000" → "5,000.00")
// - $ hugs the digits — input width shrinks to content via ch units
// - Pencil icon indicates editability (gray → blue on hover/focus)
// - Hover: light blue background + 2px blue bottom border
// - Focus: transparent background + 2px blue bottom border

type CurrencyCellProps = {
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder?: string  // shown when empty, e.g. default rate — also disables reset-to-zero on blur
  suffix?: string       // e.g. "/hr"
  decimals?: number     // default 2
  className?: string    // override root width; default "w-full" fills the cell, pass "" to hug content
  dollar?: "hug" | "left"  // "hug" (default): $ hugs the digits; "left": $ fixed at left edge
}

export function CurrencyCell({
  value,
  onChange,
  onBlur,
  placeholder,
  suffix,
  decimals = 2,
  className = "w-full",
  dollar = "hug",
}: CurrencyCellProps) {
  // isTyping: true only after the first keystroke — until then we keep showing the formatted value
  const [isTyping, setIsTyping] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const mirrorRef = React.useRef<HTMLSpanElement>(null)
  const [inputWidth, setInputWidth] = React.useState(24)

  const parsed = parseCurrency(value)
  const formatted = value && !isNaN(parsed) ? formatCurrency(parsed, decimals) : value

  // Focused but not yet typing → show formatted ("5,000.00") so select-all shows what user saw
  // Typing → show raw (no interference while entering digits)
  // Blurred → show formatted
  const displayVal = isTyping ? value : formatted

  // Measure exact pixel width from a hidden mirror span — only needed in "hug" mode
  React.useLayoutEffect(() => {
    if (dollar === "hug" && mirrorRef.current) {
      setInputWidth(mirrorRef.current.offsetWidth + 2)
    }
  }, [displayVal, dollar])

  const sharedInputProps = {
    ref: inputRef,
    type: "text" as const,
    inputMode: "decimal" as const,
    placeholder,
    value: displayVal,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsTyping(true)
      onChange(e.target.value)
    },
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      setIsTyping(false)
      const t = e.target
      requestAnimationFrame(() => t.select())
    },
    onBlur: () => {
      setIsTyping(false)
      if (!value.trim() && !placeholder) onChange("0")
      onBlur?.()
    },
  }

  return (
    <div
      className={`group flex h-full cursor-text items-center justify-end gap-1.5 border-b-2 border-transparent pl-3 pr-4 py-2 transition-colors hover:border-primary hover:bg-primary/5 focus-within:border-primary focus-within:bg-transparent ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {dollar === "hug" ? (
        /* $ hugs the digits — input sized to content via mirror span */
        <div className="flex items-center gap-0.5">
          <span ref={mirrorRef} className="pointer-events-none invisible absolute whitespace-pre text-sm" aria-hidden>
            {(displayVal?.length ?? 0) > ((placeholder || formatCurrency(0, decimals)).length)
              ? displayVal
              : (placeholder || formatCurrency(0, decimals))}
          </span>
          <span className="pointer-events-none text-sm text-muted-foreground">$</span>
          <input
            {...sharedInputProps}
            className="min-w-0 bg-transparent text-right text-sm outline-none"
            style={{ width: inputWidth }}
          />
          {suffix && (
            <span className="pointer-events-none text-xs text-muted-foreground">{suffix}</span>
          )}
        </div>
      ) : (
        /* $ fixed at left edge — input fills remaining space */
        <>
          <span className="pointer-events-none shrink-0 text-sm text-muted-foreground">$</span>
          <input
            {...sharedInputProps}
            className="min-w-0 flex-1 bg-transparent text-right text-sm outline-none"
          />
          {suffix && (
            <span className="pointer-events-none shrink-0 text-xs text-muted-foreground">{suffix}</span>
          )}
        </>
      )}
      <IconPencil className="size-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary group-focus-within:text-primary" />
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
