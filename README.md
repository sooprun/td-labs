# TrueDraft Firm

Clickable SaaS prototype sandbox for TrueDraft-like UX and product experiments.

## Project Docs

- [Prototype architecture](docs/prototype-architecture.md)
- [UI contracts](docs/ui-contracts.md)

## Adding components

This project uses shadcn/ui source components. Add new primitives only when a shared component is missing:

```bash
npx shadcn@latest add button
```

This places UI primitives in `src/components/ui`.

## Using components

Import local primitives through the configured alias:

```tsx
import { Button } from "@/components/ui/button"
```
