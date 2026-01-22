import React, { useState, useMemo } from 'react';
import RegionSelector from '../RegionSelector/RegionSelector';
import './Leaderboard.css';
import { useUser } from '../../context/UserContext';

const Leaderboard = ({ lang }) => {
  const { user, users } = useUser();

  const [activeTab, setActiveTab] = useState('global');
  const [selectedRegion, setSelectedRegion] = useState(null);

  const tabs = [
    { id: 'global', labelRu: 'Глобальный UZ', labelUz: 'Global UZ' },
    { id: 'regional', labelRu: 'Региональный', labelUz: 'Mintaqaviy' }
  ];

  

  // 🔥 ФИЛЬТРАЦИЯ
  const filteredUsers = useMemo(() => {
    if (!users.length) return [];

    if (activeTab === 'global') {
      return users;
    }

    if (activeTab === 'regional') {
      const regionToUse = selectedRegion ?? user?.region;
      console.log('regionToUse:', regionToUse, typeof regionToUse);
      console.log('example user region:', users[0]?.region, typeof users[0]?.region);
      if (!regionToUse) return [];
      return users.filter((u) => u.region === regionToUse);
    }
    
    

    return [];
  }, [activeTab, users, user, selectedRegion]);

  // 🔥 РАНЖИРОВАНИЕ (пока по дате, потом по очкам)
  const rankedUsers = useMemo(() => {
    return [...filteredUsers]
      .sort((a, b) => {
        const aPoints = Number(a?.balance || 0);
        const bPoints = Number(b?.balance || 0);
        return bPoints - aPoints; // по убыванию очков
      })
      .map((u, index) => ({
        ...u,
        rank: index + 1,
      }));
  }, [filteredUsers]);
  
  const formatPoints = (points) => {
    return points.toLocaleString('ru-RU');
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getInitials = (username) => {
    if (!username || typeof username !== 'string') return '??';
    return username.slice(0, 2).toUpperCase();
  };
  const fullRankedUsers = useMemo(() => {
    if (!users?.length) return [];
  
    // та же фильтрация, что и для списка
    let base = users;
  
    if (activeTab === 'regional') {
      const regionToUse = selectedRegion ?? user?.region;
      if (!regionToUse) return [];
      base = users.filter(
        (u) => String(u.region) === String(regionToUse)
      );
    }
  
    // та же сортировка
    return [...base]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((u, index) => ({
        ...u,
        rank: index + 1,
      }));
  }, [users, activeTab, selectedRegion, user?.region]);
  
  const myRank = useMemo(() => {
    if (!user || !fullRankedUsers.length) return null;
  
    const found = fullRankedUsers.find(
      (u) => String(u.id) === String(user.id)
    );
  
    return found ? found.rank : null;
  }, [fullRankedUsers, user?.id]);
  const myBalanceFormatted = useMemo(() => {
    if (!user?.balance && user?.balance !== 0) return '—';
    return formatPoints(user.balance);
  }, [user?.balance]);
  
  return (
    <div className="leaderboard">
      <div className="hero-banner">
        <div className="hero-banner__content">
          <div className="hero-banner__text">
            <span className="hero-banner__label">Referral rewards</span>
            <span className="hero-banner__value">+10%</span>
            <p className="hero-banner__desc">
              {lang === 'ru' 
                ? 'Приглашай друзей и зарабатывай больше!' 
                : 'Do\'stlaringizni taklif qiling va ko\'proq ishlang!'}
            </p>
          </div>
          <div className="hero-banner__mascot">
            <div className="bee-mascot">
              <span className="bee-body">🐝</span>
              <div className="coin-icon">💰</div>
            </div>
          </div>
        </div>
        <div className="hero-banner__glow" />
      </div>

      <div className="leaderboard__header">
        <h2 className="leaderboard__title">
          {lang === 'ru' ? 'Рейтинг BeaSmart' : 'BeaSmart Reytingi'}
        </h2>
      </div>

      <div className="leaderboard__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`leaderboard__tab ${activeTab === tab.id ? 'leaderboard__tab--active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
            
              if (tab.id === 'regional') {
                setSelectedRegion(user?.region || null);
              }
            }}
                      >
            {lang === 'ru' ? tab.labelRu : tab.labelUz}
          </button>
        ))}
      </div>

      {activeTab === 'regional' && (
  <div className="leaderboard__region-picker">
    <RegionSelector
      selectedRegion={selectedRegion}
      onSelect={setSelectedRegion}
      lang={lang}
    />
  </div>
)}


      <div className="leaderboard__list">
      {rankedUsers.map((user, index) => (
          <div 
            key={user.id} 
            className={`leaderboard__item ${getRankClass(user.rank)}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="leaderboard__rank">
              {user.rank <= 3 ? (
                <span className="rank-medal">{getRankIcon(user.rank)}</span>
              ) : (
                <span className="rank-number">{user.rank}</span>
              )}
            </div>
            
            <div className="leaderboard__avatar">
              <div className={`avatar ${getRankClass(user.rank)}`}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span className="avatar-initials">{getInitials(user.username)}</span>
                )}
              </div>
              {user.rank <= 3 && <div className="avatar-glow" />}
            </div>
            
            <div className="leaderboard__info">
              <span className="leaderboard__username">{user.username}</span>
            </div>
            
            <div className="leaderboard__points">
              <span className={`points-value ${getRankClass(user.rank)}`}>
                {formatPoints(user.balance)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {user && (
  <div className="my-rank-section">
    <div className="my-rank-card">
      <div className="my-rank-label">
        {lang === 'ru' ? '📍 Ваша позиция' : '📍 Sizning o‘rningiz'}
      </div>
      <div className="my-rank-content">
  <div className="my-rank-info">
    <span className="my-rank-username">{user.username}</span>
    <span className="my-rank-region">
      {myRank ? `#${myRank}` : '—'}
    </span>
  </div>

  <div className="my-rank-points">
    <span className="my-rank-points-value">
      💰 {myBalanceFormatted}
    </span>
    <span className="my-rank-points-label">
      {lang === 'ru' ? 'Баланс' : 'Balans'}
    </span>
  </div>
</div>

    </div>
  </div>
)}


    </div>
  );
};

export default Leaderboard;
