import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { regions } from '../../data/mockData';
import './RegionSelectModal.css';

export default function RegionSelectModal({ lang = 'ru' }) {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  if (!user || !user.telegramId) {
    return null;
  }

  const submitRegion = async () => {
    if (!selectedRegion) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/telegram/${user.telegramId}/region`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ region: selectedRegion }),
        },
      );

      const updatedUser = await res.json();
      setUser(updatedUser);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="region-modal">
      <div className="region-modal__card">
        <h3 className="region-modal__title">
          {lang === 'ru' ? 'Выберите регион' : 'Hududingizni tanlang'}
        </h3>

        <div className="region-list">
          {regions.map((region) => {
            const isActive = selectedRegion === region.id;

            return (
              <button
                key={region.id}
                className={`region-item ${isActive ? 'region-item--active' : ''}`}
                onClick={() => setSelectedRegion(region.id)}
                disabled={loading}
              >
                <span className="region-item__name">
                  {lang === 'uz' ? region.nameUz : region.nameRu}
                </span>

                {isActive && <span className="region-item__check">✓</span>}
              </button>
            );
          })}
        </div>

        <button
          className="region-confirm-btn"
          disabled={!selectedRegion || loading}
          onClick={submitRegion}
        >
          {loading
            ? (lang === 'ru' ? 'Сохранение...' : 'Saqlanmoqda...')
            : (lang === 'ru' ? 'Выбрать регион' : 'Hududni tanlash')}
        </button>
      </div>
    </div>
  );
}
