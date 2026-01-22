export const translations = {
  ru: {
    header: {
      brandName: 'BeaSmart',
      tagline: 'Build Value'
    },
    navigation: {
      leaderboard: 'Рейтинг',
      referrals: 'Партнерство'
    },
    leaderboard: {
      title: 'Рейтинг BeaSmart',
      globalTab: 'Глобальный UZ',
      regionalTab: 'Региональный',
      selectRegion: 'Выберите регион',
      allRegions: 'Все регионы',
      smartPoints: 'Smart Points',
      yourRank: 'Ваша позиция',
      rank: 'Место',
      top3Labels: {
        1: '🥇',
        2: '🥈', 
        3: '🥉'
      }
    },
    referrals: {
      title: 'Партнерская программа',
      balanceCard: {
        title: 'Ваш баланс',
        points: 'BeaSmart Points',
        bonus: 'Бонус за рефералов: +10%'
      },
      inviteSection: {
        title: 'Пригласите друзей',
        description: 'Получайте 10% от заработка ваших рефералов',
        copyLink: 'Скопировать ссылку',
        copied: 'Скопировано!',
        shareButton: 'Поделиться в Telegram'
      },
      referralsList: {
        title: 'Ваши рефералы',
        noReferrals: 'У вас пока нет рефералов',
        earned: 'Заработано',
        joined: 'Присоединился'
      },
      status: {
        active: 'Активен',
        inactive: 'Неактивен',
        left: 'Ушёл'
      }
    },
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      retry: 'Повторить'
    }
  },
  uz: {
    header: {
      brandName: 'BeaSmart',
      tagline: 'Build Value'
    },
    navigation: {
      leaderboard: 'Reyting',
      referrals: 'Hamkorlik'
    },
    leaderboard: {
      title: 'BeaSmart Reytingi',
      globalTab: 'Global UZ',
      regionalTab: 'Mintaqaviy',
      selectRegion: 'Viloyatni tanlang',
      allRegions: 'Barcha viloyatlar',
      smartPoints: 'Smart Points',
      yourRank: 'Sizning o\'rningiz',
      rank: 'O\'rin',
      top3Labels: {
        1: '🥇',
        2: '🥈',
        3: '🥉'
      }
    },
    referrals: {
      title: 'Hamkorlik dasturi',
      balanceCard: {
        title: 'Sizning balansingiz',
        points: 'BeaSmart Points',
        bonus: 'Referallar uchun bonus: +10%'
      },
      inviteSection: {
        title: 'Do\'stlaringizni taklif qiling',
        description: 'Referallaringiz daromadining 10% ini oling',
        copyLink: 'Havolani nusxalash',
        copied: 'Nusxalandi!',
        shareButton: 'Telegram\'da ulashish'
      },
      referralsList: {
        title: 'Sizning referallaringiz',
        noReferrals: 'Sizda hali referallar yo\'q',
        earned: 'Topilgan',
        joined: 'Qo\'shilgan'
      },
      status: {
        active: 'Faol',
        inactive: 'Nofaol',
        left: 'Ketgan'
      }
    },
    common: {
      loading: 'Yuklanmoqda...',
      error: 'Xatolik',
      retry: 'Qayta urinish'
    }
  }
};

export const getTranslation = (lang, path) => {
  const keys = path.split('.');
  let value = translations[lang];
  
  for (const key of keys) {
    if (value && value[key] !== undefined) {
      value = value[key];
    } else {
      return path;
    }
  }
  
  return value;
};
