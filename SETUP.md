# TaskFlow Setup Guide

Complete step-by-step guide to set up TaskFlow on your local machine and deploy to GitHub.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Git** installed ([Download here](https://git-scm.com/))
- **GitHub account** ([Sign up here](https://github.com/))
- **Supabase account** ([Sign up here](https://supabase.com/)) - Free tier available

## 🚀 Step-by-Step Setup

### Step 1: Create GitHub Repository

1. **Go to GitHub**
   - Visit [github.com](https://github.com)
   - Sign in to your account

2. **Create New Repository**
   - Click the "+" icon in the top right
   - Select "New repository"
   - Repository name: `taskflow-todo-app`
   - Description: `A beautiful, modern todo application built with React and Supabase`
   - Make it **Public** (or Private if you prefer)
   - ✅ Check "Add a README file"
   - ✅ Check "Add .gitignore" → Select "Node"
   - ✅ Check "Choose a license" → Select "MIT License"
   - Click "Create repository"

### Step 2: Clone and Set Up Project

1. **Clone Your Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/taskflow-todo-app.git
   cd taskflow-todo-app
   ```

2. **Copy Project Files**
   - Copy all the project files from this Bolt project to your local repository folder
   - Make sure to include all folders: `src/`, `public/`, `supabase/`, etc.

3. **Install Dependencies**
   ```bash
   npm install
   ```

### Step 3: Set Up Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign in with GitHub (recommended)
   - Click "New project"
   - Choose your organization
   - Project name: `taskflow-todo`
   - Database password: Create a strong password (save it!)
   - Region: Choose closest to your location
   - Click "Create new project"

2. **Wait for Setup**
   - Wait 2-3 minutes for your project to be ready
   - You'll see a dashboard when it's complete

3. **Get API Keys**
   - In your Supabase dashboard, go to Settings → API
   - Copy the following:
     - `Project URL`
     - `anon public` key (under "Project API keys")

4. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Run Database Migration**
   - In Supabase dashboard, go to SQL Editor
   - Click "New query"
   - Copy the entire content from `supabase/migrations/20250708153048_cool_violet.sql`
   - Paste it in the SQL editor
   - Click "Run" (bottom right)
   - You should see "Success. No rows returned"

### Step 4: Test the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open in Browser**
   - Go to `http://localhost:5173`
   - You should see the TaskFlow login page

3. **Test Authentication**
   - Click "Sign up" 
   - Create a test account with your email
   - You should be redirected to the dashboard

4. **Test Task Creation**
   - Click "Add Task" or "Create New Task"
   - Add a sample task
   - Verify it appears in your task list

### Step 5: Push to GitHub

1. **Add All Files**
   ```bash
   git add .
   ```

2. **Commit Changes**
   ```bash
   git commit -m "Initial commit: TaskFlow todo application

   Features:
   - Beautiful React + TypeScript frontend
   - Supabase authentication and database
   - Task CRUD operations with real-time updates
   - Drag & drop task reordering
   - Advanced filtering and search
   - Responsive design with animations
   - Priority system and due dates"
   ```

3. **Push to GitHub**
   ```bash
   git push origin main
   ```

### Step 6: Verify GitHub Repository

1. **Check GitHub**
   - Go to your repository on GitHub
   - Verify all files are uploaded
   - Check that README.md displays properly

2. **Update Repository Description**
   - Click the gear icon next to "About"
   - Add description: "A beautiful, modern todo application built with React and Supabase"
   - Add topics: `react`, `typescript`, `supabase`, `todo-app`, `tailwindcss`
   - Add website URL (if deployed)

## 🌐 Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "New Project"
   - Select your `taskflow-todo-app` repository
   - Click "Import"

3. **Configure Environment Variables**
   - In the deployment settings, add:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-app-name.vercel.app`

### Option 2: Deploy to Netlify

1. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add your Supabase credentials

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://your-app-name.netlify.app`

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🎯 Next Steps

1. **Customize the App**
   - Update the app name and branding
   - Modify colors and styling
   - Add new features

2. **Set Up Custom Domain** (Optional)
   - Purchase a domain
   - Configure DNS in Vercel/Netlify
   - Set up SSL certificate

3. **Add Analytics** (Optional)
   - Google Analytics
   - Vercel Analytics
   - Supabase Analytics

## 🆘 Troubleshooting

### Common Issues:

1. **Environment Variables Not Working**
   - Make sure `.env` file is in the root directory
   - Restart the development server after adding variables
   - Check that variables start with `VITE_`

2. **Supabase Connection Issues**
   - Verify your project URL and API key
   - Check that your Supabase project is active
   - Ensure the database migration ran successfully

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors with `npm run lint`
   - Clear node_modules and reinstall if needed

4. **Authentication Not Working**
   - Check Supabase Auth settings
   - Verify email confirmation is disabled (for development)
   - Check browser console for error messages

## 📞 Getting Help

If you encounter any issues:

1. Check the browser console for error messages
2. Review the Supabase dashboard for database issues
3. Check GitHub Issues for similar problems
4. Create a new issue with detailed error information

---

**Congratulations! 🎉 Your TaskFlow application is now set up and ready to use!**