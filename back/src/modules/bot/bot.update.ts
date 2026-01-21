// bot.update.ts
import { Update, Start, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import axios from 'axios';

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    if (!ctx.from) return;

    const text =
      ctx.message && 'text' in ctx.message
        ? ctx.message.text
        : null;

    const promoCode = text?.split(' ')[1];

    const telegramId = String(ctx.from.id);
    const username = ctx.from.username ?? null;

    // 1️⃣ РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ (всегда)
    try {
      await axios.post(
        `http://localhost:3001/users/telegram/${telegramId}`,
        { username },
      );
    } catch {
      // если уже существует или ошибка — нам пофиг
    }

    // 2️⃣ СТАРТОВОЕ СООБЩЕНИЕ
    let message =
      '👋 *Добро пожаловать!*\n\n' +
      'Ты попал в наш бот 🚀\n\n' +
      'Здесь ты можешь:\n' +
      '• 💰 получать и переводить баланс\n' +
      '• 🎁 активировать промокоды\n' +
      '• 👥 приглашать друзей\n\n';

    // 3️⃣ АКТИВАЦИЯ ПРОМОКОДА (если есть)
    if (promoCode) {
      try {
        const res = await axios.post(
          'http://localhost:3001/referrals/apply',
          {
            telegramId,
            code: promoCode,
            username,
          },
        );

        if (res.data?.success) {
          message +=
            '🎉 *Промокод успешно активирован!*\n' +
            'Бонус уже начислен на твой баланс 💎\n\n';
        }
      } catch {
        // неуспех — просто не пишем про промо
      }
    }

    message +=
      '👇 Нажми кнопку ниже, чтобы открыть приложение';

    // 4️⃣ ОТВЕТ + КНОПКА (на будущее WebApp)
    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🚀 Открыть приложение',
              web_app: {
                url: 'https://unity-build1-r7zk.vercel.app/',
              },
            },
          ],
        ],
      },
    });
  }
}
