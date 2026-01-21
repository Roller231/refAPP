import React, { useState, useEffect, useMemo } from 'react';
import StatusBadge from '../StatusBadge/StatusBadge';
import './ReferralSystem.css';
import { useUser } from '../../context/UserContext';

const ReferralSystem = ({ lang }) => {
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();

  const [transferUsername, setTransferUsername] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferMessage, setTransferMessage] = useState('');
  const [transferStatus, setTransferStatus] = useState('success'); // success | error
  

  const refreshUser = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/telegram/${user.telegramId}`,
      );
      const data = await res.json();
      setUser(data);
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  };
  

  const handleTransfer = async () => {
    if (!transferUsername || !transferAmount) {
      setTransferStatus('error');
      setTransferMessage(
        lang === 'ru'
          ? 'Заполните все поля'
          : 'Barcha maydonlarni to‘ldiring',
      );
      return;
    }
  
    setTransferLoading(true);
    setTransferMessage('');
  
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/transactions/transfer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fromTelegramId: user.telegramId,
            toUsername: transferUsername,
            amount: Number(transferAmount),
          }),
        },
      );
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Transfer failed');
      }
  
      setTransferStatus('success');
      setTransferMessage(
        lang === 'ru'
          ? '✅ Перевод выполнен успешно'
          : '✅ O‘tkazma muvaffaqiyatli',
      );
      await refreshUser(); // 👈 ВАЖНО
      setTransferUsername('');
      setTransferAmount('');
    } catch (e) {
      setTransferStatus('error');
      setTransferMessage(
        lang === 'ru'
          ? '❌ Ошибка перевода'
          : '❌ O‘tkazishda xatolik',
      );
    } finally {
      setTransferLoading(false);
    }
  };
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  

  const BOT_USERNAME = 'BeeSmart_xbot'; // ⚠️ замени на своего

  const referralLink = useMemo(() => {
    if (!user?.referralCode) return '';
    return `https://t.me/${BOT_USERNAME}?start=${user.referralCode}`;
  }, [user?.referralCode]);
  

  const inviteTextRu = `
  🐝 Присоединяйся к *BeaSmart*!
  
  💰 Зарабатывай Smart Points  
  🎁 Получай бонусы и промокоды  
  👥 Доход с рефералов — *10%*
  
  👇 Жми по ссылке и начинай прямо сейчас
  `;
  
  
  const handleShare = () => {
    const text =
      lang === 'ru'
        ? `\n🐝 Присоединяйся к BeaSmart!\n\n💰 Зарабатывай Smart Points\n🎁 Бонусы и промокоды\n👥 Доход с рефералов — 10%`
        : `\n🐝 BeaSmart'ga qo‘shiling!\n\n💰 Smart Points ishlang\n🎁 Bonus va promokodlar\n👥 Referallardan 10%`;
  
    const telegramUrl =
      `https://t.me/share/url?` +
      `url=${encodeURIComponent(referralLink)}` +
      `&text=${encodeURIComponent(text)}`;
  
    window.open(telegramUrl, '_blank');
  };
  
  
  const getReferralStatus = (ref) => {
    const now = new Date();
    const joinedAt = new Date(ref.invited.createdAt);
    const diffDays = Math.floor(
      (now - joinedAt) / (1000 * 60 * 60 * 24)
    );
  
    const balance = Number(ref.invited.balance || 0);
  
    if (diffDays >= 25) return 'left';
    if (diffDays >= 5 && balance === 0) return 'inactive';
  
    return 'active';
  };
  const formatPoints = (points) => {
    return points.toLocaleString('ru-RU');
  };

  const getInitials = (username) => {
    return username.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', {
      day: 'numeric',
      month: 'short'
    });
  };

  const stats = useMemo(() => {
    const safe = Array.isArray(referrals) ? referrals : [];
  
    let active = 0;
    let inactive = 0;
    let left = 0;
    let totalEarned = 0;
  
    safe.forEach((ref) => {
      const status = getReferralStatus(ref);
  
      if (status === 'active') active++;
      if (status === 'inactive') inactive++;
      if (status === 'left') left++;
  
      const balance = Number(ref.invited.balance || 0);
      totalEarned += balance * 0.1;
    });
  
    return {
      total: safe.length,
      active,
      inactive,
      left,
      totalEarned,
    };
  }, [referrals]);
  
  


  useEffect(() => {
    if (!user?.telegramId) return;
  
    const loadReferrals = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/referrals/my?telegramId=${user.telegramId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        const data = await res.json();
    
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
    
        setReferrals(normalized);
      } catch (e) {
        console.error('Failed to load referrals', e);
      } finally {
        setLoading(false);
      }
    };
    
  
    loadReferrals();
  }, [user?.telegramId]);

  return (
    <div className="referral-system">
      <div className="referral-system__header">
        <h2 className="referral-system__title">
          {lang === 'ru' ? 'Партнерская программа' : 'Hamkorlik dasturi'}
        </h2>
      </div>

      <div className="balance-card">
        <div className="balance-card__glow" />
        <div className="balance-card__content">
          <div className="balance-card__header">
            <span className="balance-card__label">
              {lang === 'ru' ? 'Ваш баланс' : 'Sizning balansingiz'}
            </span>
            <span className="balance-card__icon">💎</span>
          </div>
          <div className="balance-card__value">
            <span className="balance-amount">{formatPoints(user.balance)}</span>
            <span className="balance-currency">BeaSmart Points</span>
          </div>
          <div className="balance-card__bonus">
            <span className="bonus-icon">🎁</span>
            <span className="bonus-text">
              {lang === 'ru' ? 'Бонус за рефералов: ' : 'Referallar uchun bonus: '}
              <strong>+10%</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="invite-section">
        <div className="invite-section__header">
          <h3 className="invite-section__title">
            {lang === 'ru' ? 'Пригласите друзей' : 'Do\'stlaringizni taklif qiling'}
          </h3>
          <p className="invite-section__description">
            {lang === 'ru' 
              ? 'Получайте 10% от заработка ваших рефералов'
              : 'Referallaringiz daromadining 10% ini oling'
            }
          </p>
        </div>

        <div className="invite-section__link-box">
          <div className="link-display">
            <span className="link-icon">🔗</span>
            <span className="link-text">{user.referralCode}</span>
          </div>
          <button 
            className={`copy-button ${copied ? 'copy-button--copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied 
              ? (lang === 'ru' ? '✓ Скопировано!' : '✓ Nusxalandi!')
              : (lang === 'ru' ? 'Скопировать' : 'Nusxalash')
            }
          </button>
        </div>

        <button className="share-button" onClick={handleShare}>
          <span className="share-icon">📤</span>
          <span className="share-text">
            {lang === 'ru' ? 'Поделиться в Telegram' : 'Telegram\'da ulashish'}
          </span>
        </button>
      </div>


      {/* TRANSFER SECTION */}
<div className="transfer-section">
  <div className="transfer-section__header">
    <h3 className="transfer-section__title">
      {lang === 'ru' ? 'Перевод средств' : 'Pul o‘tkazish'}
    </h3>
    <p className="transfer-section__description">
      {lang === 'ru'
        ? 'Введите username получателя и сумму перевода'
        : 'Qabul qiluvchining username va summani kiriting'}
    </p>
  </div>

  <div className="transfer-form">
    <input
      className="transfer-input"
      placeholder={lang === 'ru' ? '@username получателя' : '@foydalanuvchi'}
      value={transferUsername}
      onChange={(e) => setTransferUsername(e.target.value)}
    />

    <input
      className="transfer-input"
      type="number"
      min="0"
      step="0.01"
      placeholder={lang === 'ru' ? 'Сумма' : 'Summa'}
      value={transferAmount}
      onChange={(e) => setTransferAmount(e.target.value)}
    />

    <button
      className="transfer-button"
      disabled={transferLoading}
      onClick={handleTransfer}
    >
      {transferLoading
        ? (lang === 'ru' ? 'Переводим…' : 'Yuborilmoqda…')
        : (lang === 'ru' ? 'Перевести' : 'O‘tkazish')}
    </button>

    {transferMessage && (
      <div className={`transfer-message transfer-message--${transferStatus}`}>
        {transferMessage}
      </div>
    )}
  </div>
</div>



      <div className="referrals-stats">
        <div className="stat-item">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">{lang === 'ru' ? 'Всего' : 'Jami'}</span>
        </div>
        <div className="stat-item stat-item--active">
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">{lang === 'ru' ? 'Активных' : 'Faol'}</span>
        </div>
        <div className="stat-item stat-item--inactive">
          <span className="stat-value">{stats.inactive}</span>
          <span className="stat-label">{lang === 'ru' ? 'Неактивных' : 'Nofaol'}</span>
        </div>
        <div className="stat-item stat-item--left">
          <span className="stat-value">{stats.left}</span>
          <span className="stat-label">{lang === 'ru' ? 'Ушло' : 'Ketgan'}</span>
        </div>
      </div>

      <div className="referrals-list">
        <div className="referrals-list__header">
          <h3 className="referrals-list__title">
            {lang === 'ru' ? 'Ваши рефералы' : 'Sizning referallaringiz'}
          </h3>
          <span className="referrals-list__earned">
            {lang === 'ru' ? 'Заработано: ' : 'Topilgan: '}
            <strong>{formatPoints(stats.totalEarned)}</strong>
          </span>
        </div>

        <div className="referrals-list__items">
        {referrals.map((ref, index) => {
  const status = getReferralStatus(ref);

  return (
    <div
      key={ref.id}
      className="referral-item"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="referral-item__avatar">
        <div className={`avatar avatar--${status}`}>
          <span className="avatar-initials">
            {getInitials(ref.invited.username)}
          </span>
        </div>
      </div>

      <div className="referral-item__info">
        <span className="referral-item__username">
          {ref.invited.username}
        </span>
        <span className="referral-item__date">
          {lang === 'ru' ? 'Присоединился: ' : 'Qo‘shilgan: '}
          {formatDate(ref.invited.createdAt)}
        </span>
      </div>

      <div className="referral-item__right">
        <StatusBadge status={status} lang={lang} />
        <span className="referral-item__earned">
          +{formatPoints(Number(ref.invited.balance * 0.1 || 0))}
        </span>
      </div>
    </div>
  );
})}

        </div>

        {referrals.length === 0 && (
          <div className="referrals-list__empty">
            <span className="empty-icon">👥</span>
            <p className="empty-text">
              {lang === 'ru' 
                ? 'У вас пока нет рефералов'
                : 'Sizda hali referallar yo\'q'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralSystem;
