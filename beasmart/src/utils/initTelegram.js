export function initTelegram() {
    const tg = window.Telegram?.WebApp;
    if (!tg) return null;
  
    tg.ready();
    tg.expand();
  
    return tg;
  }
  