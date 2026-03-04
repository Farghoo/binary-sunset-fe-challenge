import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

interface ChipsRendererParams extends ICellRendererParams {
  value: string;
  data: {
    status?: string;
    [key: string]: unknown;
  };
}

interface StatusConfig {
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  glowColor: string;
}

const STATUS_COLORS: Record<string, StatusConfig> = {
  'High Priority': {
    bgColor: '#fff1f2',
    textColor: '#dc2626',
    borderColor: '#fecaca',
    icon: '🔥',
    glowColor: 'rgba(220, 38, 38, 0.15)',
  },
  'Pending': {
    bgColor: '#fffbeb',
    textColor: '#d97706',
    borderColor: '#fed7aa',
    icon: '⏳',
    glowColor: 'rgba(217, 119, 6, 0.15)',
  },
  'Completed': {
    bgColor: '#f0fdf4',
    textColor: '#16a34a',
    borderColor: '#bbf7d0',
    icon: '✨',
    glowColor: 'rgba(22, 163, 74, 0.15)',
  },
  'Warning': {
    bgColor: '#fff7ed',
    textColor: '#ea580c',
    borderColor: '#fed7aa',
    icon: '⚠️',
    glowColor: 'rgba(234, 88, 12, 0.15)',
  },
  'Normal': {
    bgColor: '#eff6ff',
    textColor: '#2563eb',
    borderColor: '#bfdbfe',
    icon: 'ℹ️',
    glowColor: 'rgba(37, 99, 235, 0.15)',
  },
};

export const ChipsRenderer: React.FC<ChipsRendererParams> = ({ value, data }) => {
  const status = value || data.status || 'Normal';
  const config = STATUS_COLORS[status] || STATUS_COLORS['Normal'];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: '6px',
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
        fontSize: '11px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        letterSpacing: '0.2px',
        position: 'relative',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        boxShadow: `0 1px 2px 0 ${config.glowColor}, inset 0 1px 0 0 rgba(255, 255, 255, 0.5)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = `0 4px 8px 0 ${config.glowColor}, inset 0 1px 0 0 rgba(255, 255, 255, 0.6)`;
        e.currentTarget.style.borderColor = config.textColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 1px 2px 0 ${config.glowColor}, inset 0 1px 0 0 rgba(255, 255, 255, 0.5)`;
        e.currentTarget.style.borderColor = config.borderColor;
      }}
    >
      <span
        style={{
          fontSize: '12px',
          lineHeight: '1',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {config.icon}
      </span>
      <span style={{ fontSize: '11px', fontWeight: '600' }}>{status}</span>
    </span>
  );
};

