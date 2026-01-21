import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, lang }) => {
  const statusConfig = {
    active: {
      labelRu: 'Активен',
      labelUz: 'Faol',
      icon: '🟢'
    },
    inactive: {
      labelRu: 'Неактивен',
      labelUz: 'Nofaol',
      icon: '🟡'
    },
    left: {
      labelRu: 'Ушёл',
      labelUz: 'Ketgan',
      icon: '🔴'
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;
  const label = lang === 'ru' ? config.labelRu : config.labelUz;

  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__icon">{config.icon}</span>
      <span className="status-badge__label">{label}</span>
    </span>
  );
};

export default StatusBadge;
