/**
 * @fileoverview LanguageSwitcher — locale toggle for the top-right header.
 *
 * Renders a MUI `Select` with all supported locales.
 * On change: updates the I18n context (which persists to localStorage).
 *
 * Reusable — not tied to the orders feature.
 */

import { FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

import { LOCALE_LABELS, SUPPORTED_LOCALES, useI18n, type Locale } from '@/i18n';

interface LanguageSwitcherProps {
  /** Additional class for layout positioning. */
  className?: string;
}

/**
 * Dropdown to switch the active locale.
 * Must be rendered inside `<I18nProvider>`.
 */
function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  const handleChange = (event: SelectChangeEvent<Locale>) => {
    setLocale(event.target.value as Locale);
  };

  return (
    <FormControl size="small" className={className}>
      <Select
        value={locale}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'Select language' }}
        sx={{ fontSize: 'var(--font-size-sm)', minWidth: 110 }}
      >
        {SUPPORTED_LOCALES.map((code) => (
          <MenuItem key={code} value={code}>
            {LOCALE_LABELS[code]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageSwitcher;
