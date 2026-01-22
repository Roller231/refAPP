import React, { useState } from 'react';
import { regions } from '../../data/mockData';
import './RegionSelector.css';

const RegionSelector = ({ selectedRegion, onSelect, lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedRegionData = regions.find(r => r.id === selectedRegion);
  const displayName = selectedRegionData
  ? (lang === 'ru' ? selectedRegionData.nameRu : selectedRegionData.nameUz)
  : (lang === 'ru' ? 'Выберите регион' : 'Viloyatni tanlang');


  const handleSelect = (regionId) => {
    onSelect(regionId);
    setIsOpen(false);
  };

  return (
    <div className="region-selector">
      <button 
        className={`region-selector__trigger ${isOpen ? 'region-selector__trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="region-selector__icon">📍</span>
        <span className="region-selector__value">{displayName}</span>
        <span className={`region-selector__arrow ${isOpen ? 'region-selector__arrow--open' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          <div className="region-selector__backdrop" onClick={() => setIsOpen(false)} />
          <div className="region-selector__dropdown">
            <div className="region-selector__header">
              <span>{lang === 'ru' ? 'Выберите регион' : 'Viloyatni tanlang'}</span>
            </div>
            <div className="region-selector__list">
             
              {regions.map(region => (
                <button
                  key={region.id}
                  className={`region-selector__option ${selectedRegion === region.id ? 'region-selector__option--selected' : ''}`}
                  onClick={() => handleSelect(region.id)}
                >
                  <span className="region-selector__option-icon">📍</span>
                  <span>{lang === 'ru' ? region.nameRu : region.nameUz}</span>
                  {selectedRegion === region.id && <span className="region-selector__check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RegionSelector;
