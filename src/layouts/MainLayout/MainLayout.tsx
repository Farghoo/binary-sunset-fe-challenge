/**
 * @fileoverview MainLayout — top-level page wrapper.
 *
 * Structure:
 *   <skip link>
 *   <root>
 *     <header>  ← app title + LanguageSwitcher (top-right)
 *     <main>    ← page content (card with toolbar + grid)
 *   </root>
 *
 * Accessibility:
 *  - Skip link allows keyboard users to jump past the header.
 *  - `<header>` and `<main>` are ARIA landmark elements.
 */

import React from 'react';
import styles from '@/styles/components/MainLayout.module.scss';

import { useTranslation } from '@/i18n';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const { t } = useTranslation('common');

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t('skipToMain')}
      </a>

      <div className={styles.root}>
        <header className={styles.header}>
          <span className={styles.appTitle}>{t('appTitle')}</span>
          <LanguageSwitcher />
        </header>

        <main id="main-content" className={styles.card}>
          {children}
        </main>
      </div>
    </>
  );
}

export default MainLayout;
