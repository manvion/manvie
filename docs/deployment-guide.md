# MANVIÉ - Deployment & Architecture Guide

## 1. Prerequisites
- Node.js (v18+)
- Postgres database (Supabase recommended)
- Cloudinary Account (for image hosting)
- Stripe Account (for payments)
- OpenAI API Key (for AI Stylist)

## 2. Environment Variables (`.env.local`)
Create a `.env.local` file in the root with the following variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Database Schema (Supabase)
Run the following standard SQL to setup your tables in Supabase:

```sql
-- Profiles (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'supplier', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products (with Two-Layer Pricing)
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL, /* Admin sets final name to "Manvié X" */
  base_cost_price DECIMAL NOT NULL,
  retail_price DECIMAL,
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'active', 'rejected')),
  category TEXT,
  images TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  stripe_session_id TEXT,
  total_amount DECIMAL,
  payment_status TEXT DEFAULT 'pending',
  fulfillment_status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items (Maps orders to suppliers)
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  supplier_id UUID REFERENCES profiles(id),
  quantity INTEGER DEFAULT 1,
  price_at_time DECIMAL NOT NULL,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'shipped', 'delivered'))
);
```

## 4. Commands

### Local Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

## 5. Deployment Options
### Vercel (Recommended)
1. Push code to GitHub.
2. Import project in Vercel.
3. Configure all Environment Variables in the Vercel Dashboard.
4. Deploy.

## 6. Business Operations (White-Label Strategy)
- Admin accounts control **all frontend representation**.
- Suppliers create products with generic names and cost price.
- Admins convert these into "Manvié [Category] Collection" items and set margins.
- Customer ONLY interacts with Manvié branding via Stripe and emails.
