# UI Contracts

The prototype follows shadcn/ui composition with TaxDome-like product structure. The goal is consistency across experiments, not pixel-perfect cloning.

## Layout

- `AppTopbar` spans the full viewport width.
- `AppSidebar` sits below the topbar and owns only navigation.
- The workspace/content area uses `bg-workspace`.
- Topbar and sidebar use `bg-background`.
- Pages should not create their own full-screen scroll shells unless they need a board-style surface.

## Tokens

Prefer semantic Tailwind tokens:

- `bg-background`, `bg-workspace`, `bg-muted`
- `text-foreground`, `text-muted-foreground`, `text-primary`
- `border-border`
- `bg-primary`, `text-primary-foreground`

TaxDome-like constants live in `src/index.css`. Add a token there when a value becomes shared. Keep one-off hex values local only while experimenting with a single feature.

## Buttons

Use the local shadcn `Button` variants:

- `default` for primary actions.
- `outline` for secondary bordered actions.
- `ghost` for toolbar actions.
- `destructive` for risky actions.
- `link` for low-emphasis text actions.

Use the existing extended sizes such as `xl` and `icon-xl` for TaxDome-style toolbar controls.

## Tables

Tables should keep their own horizontal scroll. Toolbars should not create page-level horizontal overflow.

Bulk-action toolbars should use `DataTableBulkActionsBar`. Keep feature-specific actions in the feature component; keep layout behavior in the shared data-table component.

## Empty States

Empty states should live inside the product workspace, not as marketing content. Use a title, short helper copy, and one clear next action when the screen has a natural action.

## Prototype Actions

Non-functional clicks should use `protoAction` so users get feedback without pretending data was saved. When an action becomes part of an experiment flow, replace `protoAction` with local state or scenario state.
