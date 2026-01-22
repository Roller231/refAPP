import React from 'react';
import './Navigation.css';

const Navigation = ({ activeTab, onTabChange, lang }) => {
  const tabs = [
    { 
      id: 'leaderboard', 
      labelRu: 'Рейтинг', 
      labelUz: 'Reyting',
      icon: '🏆'
    },
    { 
      id: 'referrals', 
      labelRu: 'Партнерство', 
      labelUz: 'Hamkorlik',
      icon: '👥'
    }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'nav-tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="nav-tab__icon">{tab.icon}</span>
            <span className="nav-tab__label">
              {lang === 'ru' ? tab.labelRu : tab.labelUz}
            </span>
            {activeTab === tab.id && <div className="nav-tab__indicator" />}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
