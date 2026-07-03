# Terra Studio — тестовий інтернет-магазин

Тестовий проєкт під вакансію "Frontend-розробник інтернет-магазину" (Elevix-agency):
вітрина → картка товару → кошик → checkout → створення замовлення → статус.

Стек: **Next.js 16 (App Router) + TypeScript + Tailwind v4 + Supabase + Zustand + Framer Motion + React Hook Form + Zod**.

## Дизайн-напрям

Свідомо не типовий "AI SaaS" стиль (фіолетові градієнти, glassmorphism). Натомість:

- **Editorial terracotta** — тепла паперова палітра (крем, вохра, теракота, оливковий), не білий/не темний.
- **Fraunces** (variable serif) для заголовків + **Geist Mono** для лейблів/цін/навігації — редакційний, а не корпоративний тон.
- Асиметрична bento-сітка каталогу, grain-текстура поверх усього екрана, kinetic underline на посиланнях, magnetic-кнопки, scroll-reveal анімації (Framer Motion), біжуча стрічка (marquee) на головній.
- Стани інтерфейсу (loading/empty/error/disabled) продумані для кожного кроку: скелетони каталогу й картки товару, порожній кошик, помилки промокоду/checkout.

## Архітектура даних

`src/lib/data/*` — репозиторії (`products`, `orders`, `coupons`). Якщо задані `NEXT_PUBLIC_SUPABASE_URL` / ключі — читають і пишуть у Supabase; якщо ні — автоматично працюють на моках (`src/lib/mock-data.ts`) та in-memory сховищі замовлень. Це дозволяє запустити проєкт одразу, без налаштування бекенду, і підключити Supabase пізніше без зміни компонентів.

Щоб підключити Supabase:

1. Створіть проєкт на [supabase.com](https://supabase.com).
2. Виконайте `supabase/schema.sql` у SQL Editor — створить таблиці `products`, `orders`, `coupons` + RLS-політики.
3. Скопіюйте `.env.example` → `.env.local` і заповніть ключі проєкту.
4. Наповніть таблицю `products` — формат полів відповідає `src/lib/types.ts`.

## Сценарії e-commerce, які реалізовано

- Вітрина (`/`) з обраними товарами + повний каталог (`/catalog`) з фільтром по категоріях і пошуком (через query-параметри, SSR).
- Картка товару (`/product/[slug]`) з варіантами, кількістю, станами `in_stock / low_stock / sold_out / preorder`.
- Кошик (`/cart`): зміна кількості, видалення, застосування промокоду (`TERRA10`, `FIRST200`) з обробкою помилок API.
- Checkout (`/checkout`): валідація форми (Zod + React Hook Form), вибір доставки (Нова пошта / Укрпошта / кур'єр) з різною вартістю, оплата карткою або при отриманні.
- Створення замовлення через `POST /api/orders`, сторінка результату (`/order/[id]`) зі степером статусу замовлення.

## Запуск

```bash
npm install
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000).

## Структура API

- `POST /api/orders` — створення замовлення (валідація адреси, підрахунок суми, знижки, доставки).
- `GET /api/orders/[id]` — отримання статусу замовлення.
- `POST /api/coupons/validate` — перевірка промокоду.
