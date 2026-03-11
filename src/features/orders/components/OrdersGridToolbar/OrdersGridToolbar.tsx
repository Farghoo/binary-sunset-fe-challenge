/**
 * @fileoverview Toolbar for the Orders Analytics grid.
 *
 * Features:
 *  - Quick-search with 300ms debounce → triggers server-side search via context
 *  - Reset Filters button → clears column filters, search, and purges cache
 *  - Edit badge → shows count of locally edited rows
 *  - Row count display (from server total, updates per search)
 *
 * All user-visible text sourced from `useTranslation('ordersToolbar')`.
 * MUI components: Toolbar, Chip, Button, TextField.
 *
 * Must be rendered inside `<OrdersProvider>`.
 */

import React, { useCallback, useId } from 'react';
import styles from '@/styles/features/orders/OrdersGridToolbar.module.scss';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Chip, InputAdornment, TextField, Toolbar, Typography } from '@mui/material';

import { useTranslation } from '@/i18n';
import { useDebounce } from '@/shared/hooks/useDebounce';

import { useOrders } from '../../context/OrdersContext';

const OrdersGridToolbar = React.memo(function OrdersGridToolbar() {
  const { totalRows, editedCount, setSearchQuery, resetFilters } = useOrders();
  const { t } = useTranslation('ordersToolbar');
  const searchId = useId();

  const [searchText, setSearchText] = React.useState('');
  const debouncedSearch = useDebounce(searchText, 300);

  React.useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    setSearchText('');
  }, [resetFilters]);

  return (
    <Toolbar
      component="div"
      className={styles.toolbar}
      disableGutters
      aria-label={t('toolbarAriaLabel')}
    >
      {/* Quick search */}
      <TextField
        id={searchId}
        size="small"
        placeholder={t('searchPlaceholder')}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        aria-label={t('searchAriaLabel')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" aria-hidden="true" />
            </InputAdornment>
          ),
        }}
        sx={{ width: 220 }}
      />

      {/* Reset Filters */}
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        startIcon={<FilterAltOffIcon fontSize="small" />}
        onClick={handleResetFilters}
        aria-label={t('resetFiltersAriaLabel')}
      >
        {t('resetFiltersLabel')}
      </Button>

      <div className={styles.divider} aria-hidden="true" />

      {/* Edit badge */}
      {editedCount > 0 && (
        <Chip
          icon={<EditNoteIcon fontSize="small" />}
          label={t('editedLabel', { count: editedCount })}
          size="small"
          color="warning"
          variant="outlined"
          aria-label={t('editedAriaLabel', { count: editedCount })}
        />
      )}

      <div className={styles.spacer} />

      {/* Row count */}
      <Typography component="span" className={styles.hint} aria-live="polite" aria-atomic="true">
        {t('rowCount', { count: totalRows.toLocaleString() })}
      </Typography>
    </Toolbar>
  );
});

export default OrdersGridToolbar;
