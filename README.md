# 🏊‍♂️ Aqua Bear Swim Club

A modern, full-stack booking platform for a swimming academy featuring user authentication, admin dashboard, and real-time reservation management.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://aqua-bear.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.1%25-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

---

## 🌟 Features

### 🎯 Customer-Facing Features
- **🏠 Landing Page**: Modern, responsive design showcasing swimming academy services
- **📅 Booking System**: Interactive calendar for class reservations with time slot selection
- **📋 Service Catalog**: Detailed information about different swimming programs:
  - Baby swimming classes (6 months - 3 years)
  - Children's classes (4-12 years)
  - Adult classes
  - Competitive training
  - Pool access memberships
  - Aquagym & rehabilitation
- **📱 WhatsApp Integration**: Direct communication channel for quick inquiries
- **📸 Instagram Integration**: Social media connectivity
- **📝 Contact Form**: Real-time reservation requests with email notifications

### 🔐 Admin Features
- **🔑 Secure Authentication**: Email/password login with Supabase Auth
- **📊 Admin Dashboard**: Centralized management panel for reservations
- **👥 Role-Based Access Control (RBAC)**: Separate customer and admin functionalities
- **💾 Database Management**: Full CRUD operations for bookings

### 🎨 UI/UX Features
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop
- **🌙 Modern Design**: Clean interface with smooth animations
- **♿ Accessibility**: WCAG compliant components
- **⚡ Performance**: Optimized images and lazy loading

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: CSS animations & transitions

### Backend & Database
- **BaaS**: [Supabase](https://supabase.com/)
  - PostgreSQL database
  - Authentication & authorization
  - Real-time subscriptions
  - Row Level Security (RLS)
- **Email Service**: Integrated email notifications

### DevOps & Deployment
- **Hosting**: [Vercel](https://vercel.com/)
- **Version Control**: Git & GitHub
- **CI/CD**: Automatic deployments on push

---

## 📸 Screenshots

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/cfd5fd3a-cd7a-4746-a783-9f93cb0bf171)

### Admin Dashboard
![Admin Dashboard](https://github.com/user-attachments/assets/1d0da81f-d72d-4bed-b671-6859439458dd)

### Booking System
![Booking System](https://github.com/user-attachments/assets/4f7bfbca-0393-4120-8d77-7dfa4662e0a7)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ang3lRamos/aqua-bear.git
cd aqua-bear
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**

Run the SQL script in `scripts/` to create the necessary tables:
- `reservations` table for booking data
- Authentication tables (handled by Supabase Auth)

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
aqua-bear/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   └── login/           # Admin login page
│   ├── (dashboard)/         # Protected admin routes
│   │   └── admin/           # Admin dashboard
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── BookingForm.tsx      # Reservation form
│   ├── Navbar.tsx           # Navigation bar
│   └── ...                  # Other components
├── lib/                     # Utility functions
│   ├── supabase.ts          # Supabase client
│   └── utils.ts             # Helper functions
├── public/                  # Static assets
│   └── images/              # Images and logos
├── scripts/                 # Database scripts
│   └── schema.sql           # Supabase schema
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes |

---

## 🎯 Key Features Implementation

### Authentication System
- Implemented using Supabase Auth
- Email/password authentication
- Protected routes with middleware
- Session management

### Booking System
```typescript
// Example reservation flow
1. User selects date & time
2. Fills contact information
3. Chooses service type
4. Submits reservation
5. Data stored in Supabase
6. Admin receives notification
```

### Admin Dashboard
- View all reservations in real-time
- Filter and search functionality
- Update booking status
- Delete/modify reservations

---

## 🔒 Security Features

- ✅ Row Level Security (RLS) policies in Supabase
- ✅ Server-side authentication checks
- ✅ Environment variables for sensitive data
- ✅ HTTPS enforced (Vercel)
- ✅ SQL injection protection (Supabase)
- ✅ XSS protection (React/Next.js built-in)

---

## 📊 Database Schema

### Reservations Table
```sql
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  reservation_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  participants INTEGER DEFAULT 1,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already done)
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Configure Custom Domain** (Optional)
   - Add your domain in Vercel settings
   - Update DNS records

### Manual Deployment
```bash
npm run build
npm start
```

---

## 📈 Performance Optimizations

- ✅ Next.js Image optimization with `next/image`
- ✅ Code splitting and lazy loading
- ✅ Static page generation where possible
- ✅ Supabase connection pooling
- ✅ Optimized bundle size with tree shaking
- ✅ CSS purging with Tailwind

**Lighthouse Score:**
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npm run type-check

# Build test
npm run build
```

---

## 🗺️ Roadmap

- [ ] Add payment integration (Stripe/PayPal)
- [ ] Implement email confirmations for bookings
- [ ] Add class schedule calendar view
- [ ] Create instructor profiles section
- [ ] Multi-language support (ES/EN)
- [ ] Mobile app with React Native
- [ ] Customer dashboard for viewing booking history
- [ ] Rating and review system

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Angel Ramos**

- GitHub: [@Ang3lRamos](https://github.com/Ang3lRamos)
- LinkedIn: [Angel Ramos](https://linkedin.com/in/angel-ramos-528974231)
- Email: angelf.ramosc@unac.edu.co
- Portfolio: [portfolioangeldev.netlify.app](https://portfolioangeldev.netlify.app)

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Vercel](https://vercel.com/) for hosting
- Swimming academy community for inspiration

---

## 📞 Support

If you have any questions or need help with the project:

- 📧 Email: angelf.ramosc@unac.edu.co
- 💬 Open an [Issue](https://github.com/Ang3lRamos/aqua-bear/issues)
- 🌟 Star this repository if you find it helpful!

---

<div align="center">

### 🌊 Dive into the code! 🏊‍♂️

**[Live Demo](https://aqua-bear.vercel.app)** • **[Report Bug](https://github.com/Ang3lRamos/aqua-bear/issues)** • **[Request Feature](https://github.com/Ang3lRamos/aqua-bear/issues)**

Made with ❤️ by [Angel Ramos](https://github.com/Ang3lRamos)

</div>