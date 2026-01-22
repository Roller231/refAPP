import React from 'react';
import './Header.css';

const Header = ({ lang, onLanguageChange }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="brand">
          <div className="bee-icon">
            <span className="bee-emoji">🐝</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-name gold-text">BeaSmart</h1>
            <span className="brand-tagline">Build Value</span>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="lang-toggle"
            onClick={() => onLanguageChange(lang === 'ru' ? 'uz' : 'ru')}
          >
            {lang === 'ru' ? 'UZ' : 'RU'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
