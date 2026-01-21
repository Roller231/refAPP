# Beasmart Miniapp Backend

NestJS backend for a Telegram mini app with users, referrals, transactions, and balance transfers.

## Quick start

```bash
npm install
npm run start:dev
```

## Environment

Copy `.env.example` to `.env` and fill in values.

Key variables:
- `PORT`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `DB_SYNC`, `DB_LOGGING`
- `REFERRAL_BONUS`
- `API_KEY` (optional)

## Swagger

Swagger UI is available at `http://localhost:3000/docs`.

## API overview

Users
- `POST /users/telegram/:telegramId`
- `GET /users/telegram/:telegramId`
- `GET /users/telegram/:telegramId/balance`
- `GET /users/telegram/:telegramId/exists`
- `GET /users/telegram/:telegramId/referral-code`

Referrals
- `POST /referrals/apply`
- `GET /referrals/my`

Transactions
- `POST /transactions/transfer`
- `GET /transactions/history`

---

# Документация для фронта

Ниже — краткая интеграционная документация для фронтенда (REST JSON).
По умолчанию сервер поднимается на `http://localhost:3000`.

## Аутентификация

Если в `.env` указан `API_KEY`, то **все** запросы должны содержать заголовок:

```
x-api-key: <API_KEY>
```

Если `API_KEY` пустой — заголовок не нужен.

## Общие правила

- Все запросы/ответы — `application/json`.
- Идентификатор пользователя — `telegramId` (строка).
- Баланс хранится строкой с двумя знаками после запятой.
- Для переводов доступен `idempotency-key` (строка) — защита от повторной отправки.

## Сущности

**User**
- `id` (uuid)
- `telegramId` (string)
- `username` (string | null)
- `balance` (string)
- `referralCode` (string | null)
- `createdAt` (ISO date)

**Transaction**
- `id` (uuid)
- `fromUser` (User | null)
- `toUser` (User)
- `amount` (string)
- `type` (`REFERRAL_REWARD` | `TRANSFER` | `ADMIN`)
- `idempotencyKey` (string | null)
- `createdAt` (ISO date)

**Referral**
- `id` (uuid)
- `inviter` (User)
- `invited` (User)
- `createdAt` (ISO date)

## Endpoints

### Пользователи

**POST** `/users/telegram/:telegramId` — создать или получить пользователя  
Body:
```json
{
  "username": "alice"
}
```
Response: `User`
Notes:
- Если `username` не передан или пустой, будет использован `user_<telegramId>`.

**GET** `/users/telegram/:telegramId` — получить профиль  
Response: `User | null`

**GET** `/users/telegram/:telegramId/balance` — баланс  
Response:
```json
{ "balance": "100.00" }
```

**GET** `/users/telegram/:telegramId/exists` — существует ли пользователь  
Response:
```json
{ "exists": true }
```

**GET** `/users/telegram/:telegramId/referral-code` — получить или сгенерировать реферальный код  
Response:
```json
{ "referralCode": "AB12CD34" }
```

### Рефералы

**POST** `/referrals/apply` — применить реферальный код  
Body:
```json
{
  "telegramId": "123456789",
  "code": "AB12CD34",
  "username": "alice"
}
```
Response: `User`

**GET** `/referrals/my?telegramId=...` — список приглашённых  
Response: `Referral[]`

### Транзакции

**POST** `/transactions/transfer` — перевод между пользователями  
Headers:
```
idempotency-key: <string>   // опционально
```
Body:
```json
{
  "fromTelegramId": "123456789",
  "toTelegramId": "987654321",
  "amount": 10.5
}
```
Response:
```json
{ "ok": true }
```

**GET** `/transactions/history?telegramId=...` — история транзакций  
Response: `Transaction[]`

## Ошибки

Backend возвращает стандартные ответы NestJS:
- `400` — некорректные данные (например, недостаточный баланс).
- `404` — пользователь или реферальный код не найден.
- `401` — неверный `x-api-key` (если включен).

