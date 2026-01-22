import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Leaderboard from './components/Leaderboard/Leaderboard';
import ReferralSystem from './components/ReferralSystem/ReferralSystem';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import RegionSelectModal from './components/RegionSelectModal/RegionSelectModal';
import { useUser } from './context/UserContext';
import { initTelegram } from './utils/initTelegram';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [lang, setLang] = useState('ru');

  const { user, setUser, users, setUsers, loading, setLoading } = useUser();

  useEffect(() => {
    const tg = initTelegram();
    const tgUser = tg?.initDataUnsafe?.user;
  
    // ✅ fallback если не Telegram
    const telegramId = tgUser?.id ? String(tgUser.id) : '902';
    const username = tgUser?.first_name || 'DevUser';
  
    const createUser = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/users/telegram/${telegramId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
            }),
          },
        );
  
        const data = await res.json();
        setUser(data);

        const loadUsers = async () => {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/users`);
          const data = await res.json();
          setUsers(data);
        };
        
        await loadUsers();
        

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
  
    createUser();
  }, []);
  

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {user && !user.region && <RegionSelectModal />}

      <div className="app-container">
        <AnimatedBackground />
        <Header lang={lang} onLanguageChange={setLang} />

        <main className="main-content">
          {activeTab === 'leaderboard' && <Leaderboard lang={lang} />}
          {activeTab === 'referrals' && <ReferralSystem lang={lang} />}
        </main>

        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lang={lang}
        />
      </div>
    </>
  );
}

export default App;
