# Түмэн-Дугуй - Tire Shop

Монгол дугуйн онлайн худалдааны програм

## Features

- 🏠 **Нүүр хуудас** - Баннер, шилдэг бүтээгдэхүүн, брэндүүд
- 🛒 **Бүтээгдэхүүн** - Шүүлтүүр, эрэмбэлэх, дэлгэрэнгүй харах
- 🛍️ **Сагс** - Бүтээгдэхүүн нэмэх, хасах, тоо ширхэг өөрчлөх
- 👤 **Профайл** - Хэрэглэгчийн мэдээлэл, захиалгын түүх
- 🔐 **Нэвтрэх систем** - Админ болон хэрэглэгчийн эрх
- 📱 **PWA дэмжлэг** - Утсанд суулгаж болно
- 🌙 **Харанхуй загвар** - Нүдэнд ээлтэй дизайн

## Admin Features

- 📊 **Хяналтын самбар** - Статистик, тайлан
- 👥 **Хэрэглэгч удирдах** - CRUD үйлдлүүд
- 📦 **Бүтээгдэхүүн удирдах** - Нэмэх, засах, устгах
- 🏢 **Брэнд удирдах** - Брэнд мэдээлэл засах
- 📋 **Захиалга удирдах** - Төлөв шинэчлэх
- ⚙️ **Тохиргоо** - Баннер, ерөнхий тохиргоо

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context
- **Icons**: Lucide React
- **PWA**: next-pwa
- **Database**: Static data (ready for Supabase)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### User Account  
- Email: `user@example.com`
- Password: `user123`

## Project Structure

```
├── app/                    # Next.js 13 app directory
│   ├── admin/             # Admin pages
│   ├── cart/              # Shopping cart
│   ├── products/          # Product pages
│   └── profile/           # User profile
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utilities and data
│   ├── database.ts       # Static data
│   ├── auth-context.tsx  # Authentication
│   ├── cart-context.tsx  # Shopping cart
│   └── supabase-config.ts # Supabase setup (ready)
└── public/               # Static assets
```

## Supabase Integration (Tomorrow)

The project is ready for Supabase integration:

1. **Database Schema**: Pre-defined in `lib/supabase-config.ts`
2. **Static Data**: Current data structure matches Supabase tables
3. **Authentication**: Ready to switch from static to Supabase Auth
4. **Environment**: `.env.local` template ready

### Migration Steps:
1. Create Supabase project
2. Run SQL schema from `supabase-config.ts`
3. Add environment variables
4. Replace static data with Supabase client calls
5. Update authentication system

## Deployment

The project is ready for deployment with static data. All features work without external dependencies.

## Features Ready for Production

✅ Responsive design  
✅ PWA support  
✅ Admin dashboard  
✅ Shopping cart  
✅ User authentication (static)  
✅ Product filtering & search  
✅ Order management  
✅ Dark theme  
✅ Mongolian localization  

## License

MIT License