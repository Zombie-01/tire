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

2. Set up Supabase (optional):
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `.env.local` with your credentials
   - Run the SQL migration from `supabase/migrations/001_initial_schema.sql`

3. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

### Admin Account
- **Static Mode**: Email: `admin@example.com`, Password: `admin123`
- **Supabase Mode**: Use Supabase Auth or the admin user created in migration

### User Account  
- **Static Mode**: Email: `user@example.com`, Password: `user123`
- **Supabase Mode**: Register through the app or use sample users from migration

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

## Supabase Integration

The project supports both static data and Supabase:

### **Setup Steps:**
1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com)
2. **Run Migration**: Execute `supabase/migrations/001_initial_schema.sql` in SQL Editor
3. **Update Environment**: Add your URL and anon key to `.env.local`
4. **Restart Server**: `npm run dev`

### **Features with Supabase:**
- **Real Authentication**: Supabase Auth with email/password
- **Live Database**: All CRUD operations work with PostgreSQL
- **Row Level Security**: Proper permissions and data isolation
- **Real-time Updates**: Changes reflect immediately
- **Admin Management**: Full user, product, and brand management

## Deployment

The project works in two modes:
- **Static Mode**: No external dependencies, works everywhere
- **Supabase Mode**: Full database functionality with real-time updates

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
✅ Supabase integration
✅ Real authentication
✅ Database CRUD operations

## License

MIT License