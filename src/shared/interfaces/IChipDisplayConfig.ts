/**
 * @fileoverview Generic chip display configuration interface.
 *
 * Domain-agnostic contract used by the StatusChip component.
 * Feature-specific config maps (status, device, source) implement this
 * interface in their respective feature utils — StatusChip itself has
 * no knowledge of any domain.
 */

export interface IChipDisplayConfig {
  /** CSS modifier class suffix — maps to `.chip--{variant}` in SCSS. */
  variant: string;
  /** Primary human-readable label (also used as visible text). */
  label: string;
  /** Decorative icon; marked `aria-hidden` inside the component. */
  icon: string;
  /** Verbose screen-reader description. */
  ariaLabel: string;
}
