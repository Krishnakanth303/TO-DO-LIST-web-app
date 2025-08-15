# TaskFlow - Beautiful Todo App

A modern, production-ready todo application built with React, TypeScript, and Supabase. Features a beautiful UI with smooth animations, real-time updates, and comprehensive task management capabilities.

![TaskFlow Preview](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop&crop=entropy&auto=format&q=80)

## ✨ Features

- **🔐 User Authentication**: Secure email/password authentication with Supabase
- **📝 Task Management**: Create, edit, delete, and complete tasks with ease
- **🔍 Advanced Filtering**: Filter by status (all, active, completed, overdue)
- **🔎 Real-time Search**: Search across task titles and descriptions
- **🎯 Drag & Drop**: Reorder tasks with beautiful drag-and-drop functionality
- **⚡ Priority System**: Assign priorities (low, medium, high) to tasks
- **📅 Due Dates**: Set and track task deadlines with overdue warnings
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🔄 Real-time Updates**: Changes sync instantly across all devices
- **🎨 Beautiful Animations**: Smooth transitions and micro-interactions
- **📊 Task Statistics**: Visual progress tracking and analytics
- **🌓 Modern UI**: Glass-morphism design with gradient backgrounds

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Real-time subscriptions, Auth)
- **State Management**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Drag & Drop**: React Beautiful DnD
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/TO-DO-LIST-web-app.git
cd taskflow-todo-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create a new project (choose a name, database password, and region)

2. **Get Your Project Credentials**
   - Go to Settings → API
   - Copy your `Project URL` and `anon public` key

3. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Database Migration**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy the contents of `supabase/migrations/20250708153048_cool_violet.sql`
   - Paste and run the SQL script

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
TO-DO-LIST-web-app/
├── src/
│   ├── components/          # React components
│   │   ├── AuthForm.tsx     # Authentication form
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Header.tsx       # App header
│   │   ├── TaskList.tsx     # Task list with filtering
│   │   ├── TaskItem.tsx     # Individual task component
│   │   ├── TaskForm.tsx     # Task creation/editing form
│   │   ├── TaskStats.tsx    # Statistics dashboard
│   │   └── QuickActions.tsx # Quick action buttons
│   ├── hooks/
│   │   ├── useAuth.ts       # Authentication hook
│   │   └── useTasks.ts      # Task management hook
│   ├── lib/
│   │   └── supabase.ts      # Supabase client and types
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── supabase/
│   └── migrations/          # Database migrations
├── public/                  # Static assets
└── package.json
```

## 🗄️ Database Schema

The application uses a single `tasks` table:

```sql
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  due_date timestamptz,
  priority text CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  order_index integer DEFAULT 0,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Add environment variables in Netlify dashboard
5. Deploy!

## 🎯 Key Features Explained

### Authentication
- Secure email/password authentication using Supabase Auth
- Session management with automatic token refresh
- Protected routes and data access

### Task Management
- Full CRUD operations with optimistic updates
- Real-time synchronization across devices
- Automatic saving with comprehensive error handling

### Drag & Drop
- Intuitive task reordering with visual feedback
- Smooth animations during drag operations
- Persistent order saved to database

### Advanced Filtering
- Multiple filter options (status, priority, due date)
- Real-time search across title and description
- Smart sorting with multiple criteria

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized layouts for all screen sizes
- Touch-friendly interactions

## 🔒 Security Features

- Row Level Security (RLS) enabled on all tables
- User data isolation - users can only access their own tasks
- Secure authentication with Supabase Auth
- Environment variable protection for sensitive data

## 🎨 Design System

- **Colors**: Indigo, Purple, Cyan gradient palette
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 8px grid system
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React icon library

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Framer Motion](https://framer.com/motion) for animations
- [Lucide](https://lucide.dev) for the beautiful icons
- [Unsplash](https://unsplash.com) for the preview images

**Made with ❤️ by [KRISHNA KANTH URS K M]
