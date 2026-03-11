import React from 'react';
import { render, screen } from '@testing-library/react';

import LanguageSwitcher from '@/shared/components/LanguageSwitcher';

const mockSetLocale = jest.fn();

jest.mock('@/i18n', () => ({
  useI18n: () => ({ locale: 'en', setLocale: mockSetLocale }),
  SUPPORTED_LOCALES: ['en', 'de'],
  LOCALE_LABELS: { en: 'English', de: 'Deutsch' },
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mockSetLocale.mockClear();
  });

  it('renders a language selector', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows the current locale as selected value', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('combobox')).toHaveTextContent('English');
  });
});
