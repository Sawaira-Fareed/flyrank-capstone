# NOTES.md — shadcn/ui Comparison

## Modal Dialog vs shadcn Dialog

### What shadcn handled that I missed:

1. **Portal rendering:** shadcn renders the dialog through a React portal (`DialogPortal`), which appends it to `document.body`. This avoids z-index stacking issues and CSS overflow clipping from parent containers. My modal renders inline where it's placed in the DOM tree.

2. **Third-party focus trap:** shadcn delegates focus management to Radix UI's internal focus trap, which handles edge cases like dynamically added elements, nested dialogs, and non-focusable content. My focus trap manually queries focusable elements and wraps Tab/Shift+Tab — it works for basic cases but would break with dynamic content.

3. **Body scroll lock:** shadcn's Radix primitives handle scroll locking with `aria-hidden` on the rest of the page and prevent scroll chaining. I only set `overflow: hidden` on body, which doesn't prevent the scroll position from jumping.

4. **Animation support:** shadcn ships with data-state attributes (`data-open`, `data-closed`) and CSS animations for smooth enter/exit transitions. My modal appears and disappears instantly with no transition.

5. **Component composition:** shadcn splits the dialog into `DialogTrigger`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, and `DialogFooter` — all individually importable. My modal is one monolithic component.

6. **Accessibility extras:** shadcn includes `DialogDescription` with `aria-describedby` linking for screen readers. My modal only has a title.

### Concrete gaps (at least 2):

- **Gap 1:** My modal does not render in a portal, so it can be clipped by parent containers with `overflow: hidden` or z-index stacking issues. Shadcn uses `DialogPortal` to render into `document.body`.
- **Gap 2:** My focus trap does not account for dynamically added/removed focusable elements (e.g., if content loads after the modal opens). Shadcn delegates this to Radix's battle-tested focus trap.

---

## Tabs vs shadcn Tabs

### What shadcn handled that I missed:

1. **Orientation support:** shadcn supports both horizontal and vertical orientations via the `data-orientation` attribute. My tabs are horizontal only.

2. **Disabled tabs:** shadcn tabs can be individually disabled with proper `disabled` and `aria-disabled` attributes. My tabs have no disabled state.

3. **Compound component pattern:** shadcn splits into `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` — giving full layout control. My tabs are a single component that takes a data array.

4. **Variant support:** shadcn includes `variant` prop (`default`, `line`) for different visual styles. Mine has one fixed style.

### Concrete gaps (at least 2):

- **Gap 1:** My tabs lack a disabled state — there's no way to mark a tab as unavailable or to skip it in keyboard navigation. Shadcn handles this with `disabled` and `aria-disabled`.
- **Gap 2:** My tabs are horizontal-only. Shadcn supports vertical orientation which is essential for sidebar navigation patterns.

---

## What I Learned

Building these components from scratch made me realize how many edge cases component libraries handle silently. When I review AI-generated code now, I'll specifically check: portals for modals, focus trap robustness, disabled states, orientation variants, and animation lifecycle. AI assistants often skip these because the visible output "looks fine" — but it breaks under real usage.