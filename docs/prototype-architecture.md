# TaxDome Sandbox Prototype Architecture

This app is a clickable SaaS prototype for UX and product experiments. It should feel like a real product shell first, then support experiments inside that shell.

## App Layers

- `src/app` owns routing, product navigation resolution, and top-level providers.
- `src/layouts/app-shell` owns the persistent product chrome: topbar, sidebar, and scroll containers.
- `src/pages` owns route-level screens. Pages compose feature components and mock data, but should avoid deep table or workflow logic.
- `src/features` owns domain components that can be reused across pages within a product area.
- `src/components/ui` is shadcn/ui source code and low-level primitives.
- `src/components/page` owns shared page scaffolding such as headers and sections.
- `src/components/data-table` owns reusable table toolbar and bulk-action contracts.
- `src/mock` exposes domain mock entrypoints for pages and features.

## Route Pattern

Use `src/app/navigation.ts` as the source of truth for product navigation. Parent sections with children should navigate to the first child route. Parent sections are expandable navigation groups, not separate pages unless the real product has one.

Add route-level screens in `src/app/App.tsx` only when the route needs a real prototype page. Otherwise routes should fall back to `PrototypePage`.

## Page Pattern

Use `PageLayout` for standard SaaS screens with the gray workspace background. Use `PageHeader` for page titles and status tabs. Keep major content surfaces inside feature components when they are likely to be reused or iterated.

Do not make landing pages inside the authenticated app. The first screen should always be a working product surface.

## Table Pattern

Use `DataTableToolbarSlot`, `DataTableToolbarGroup`, and `DataTableToolbarSpacer` for table toolbars.

Use `DataTableBulkActionsBar` for selected-row states. Feature code should provide the action list and optional overflow menu; the shared component owns the stable toolbar layout, selected count, clear action, and select-all button.

When an action set becomes too wide, prefer hiding secondary actions behind breakpoints or an overflow menu. Do not let a toolbar expand the page width.

## Mock Data Pattern

Pages should import mock data from domain entrypoints:

- `@/mock/accounts`
- `@/mock/insights`
- `@/mock/pipelines`

Large fixture files can stay in `src/mock/data`, but screens should not import them directly. This leaves room to reshape internals without touching pages.

Scenario data belongs in `src/mock/scenarios`. A scenario should describe the experiment, entry route, and fixture IDs it relies on. For example, the custom-rates experiment starts with `accountsBulkCustomRatesScenario`.

## Experiment Pattern

For new product experiments:

1. Add or extend mock scenario data first.
2. Add the smallest route/page surface needed to click through the flow.
3. Reuse shell, page, table, and bulk-action primitives.
4. Keep prototype-only no-op actions behind `protoAction`.
5. Promote repeated UI from a page into `features` only after the second real use case appears.
