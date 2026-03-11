/**
 * @fileoverview 404 Not Found page.
 * All text sourced from `useTranslation('notFound')`.
 */

import { useNavigate } from 'react-router-dom';

import { useTranslation } from '@/i18n';
import EmptyState from '@/shared/components/EmptyState';
import { ROUTES } from '@/constants/routes';

function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('notFound');

  return (
    <EmptyState
      icon="404"
      title={t('title')}
      description={t('description')}
      action={{ label: t('backLabel'), onClick: () => navigate(ROUTES.ORDERS) }}
    />
  );
}

export default NotFoundPage;
