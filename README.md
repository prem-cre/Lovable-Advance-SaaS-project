# AI-Powered SaaS Application Builder

<div align="center">

**Transform ideas into live web applications using AI-powered code generation**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.8-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![tRPC](https://img.shields.io/badge/tRPC-11.8-2596be?style=flat-square&logo=trpc)](https://trpc.io/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

</div>

---

## 📖 Overview

This is a **production-ready SaaS platform** that enables users to generate complete web applications from natural language prompts using AI agents. Built on cutting-edge technologies, it combines **Next.js 15**, **React 19**, **Inngest agent toolkit**, and **E2B cloud sandboxes** to create, preview, and deploy full-stack applications in real-time.

### 🎯 What Makes This Unique?

- **AI-First Architecture**: Powered by Google's Gemini 2.0 Flash with advanced prompt engineering
- **Live Code Execution**: E2B cloud sandboxes with Docker-based runtime environments
- **Real-Time Collaboration**: WebSocket-powered live previews with URL access
- **Production-Grade**: Full authentication, billing, credit tracking, and user management
- **Type-Safe End-to-End**: tRPC ensures type safety from database to UI

---

## ✨ Key Features

### 🧠 **AI Code Generation**
- **Multi-Agent System**: Orchestrated AI agents using Inngest agent-kit
- **Context-Aware**: Maintains conversation history for iterative development
- **Smart Prompting**: Production-level prompt engineering for high-quality code output
- **Multiple AI Models**: Support for Gemini (primary), OpenAI, and Anthropic

### 🖥️ **Cloud Sandboxes**
- **E2B Integration**: Isolated cloud environments for each project
- **Docker Templates**: Pre-configured Next.js templates with hot reload
- **Live Previews**: Real-time application preview with public URL access
- **File System Operations**: Full read/write capabilities with terminal access

### 💳 **Built-In Monetization**
- **Credit System**: Usage-based tracking with automatic expiration (30 days)
- **Tiered Plans**: Free (2 credits), Pro (100 credits), Enterprise (500 credits)
- **Clerk Integration**: Seamless authentication and billing management
- **Upgrade Flow**: One-click upgrade with instant credit allocation

### 🎨 **Modern UI/UX**
- **Shadcn/ui Components**: 40+ pre-built accessible components
- **Tailwind v4**: Utility-first styling with dark mode support
- **Responsive Design**: Mobile-first approach with glassmorphism effects
- **Code Explorer**: Split-pane view with syntax highlighting

### 📡 **Type-Safe API**
- **tRPC**: Full-stack type safety without code generation
- **5 API Modules**: Home, Projects, Messages, Usage, Upgrade
- **React Query Integration**: Automatic caching and revalidation
- **Zod Validation**: Runtime schema validation

### 🔐 **Enterprise Authentication**
- **Clerk Authentication**: Social login, email/password, magic links
- **Plan Detection**: Automatic Pro/Free user identification
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Secure token handling

---

## 🏗️ Architecture

### System Flow

```mermaid
graph TB
    A[User Request] --> B[Next.js Frontend]
    B --> C{tRPC API Layer}
    C --> D[Authentication Middleware]
    D --> E[Credit Check]
    E --> F[Inngest Background Job]
    F --> G[AI Agent Network]
    G --> H[E2B Sandbox Creation]
    H --> I[Code Generation]
    I --> J[File System Operations]
    J --> K[Terminal Commands]
    K --> L[Live Preview URL]
    L --> M[Database Storage]
    M --> N[UI Update]
```

### Technology Stack

#### **Frontend**
- **Framework**: Next.js 15.3.8 (App Router, React Server Components)
- **UI Library**: React 19 with Server Actions
- **Styling**: Tailwind CSS v4 + Shadcn/ui
- **State Management**: TanStack Query v5 + tRPC
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React (544 icons)

#### **Backend**
- **API**: tRPC 11.8 (type-safe RPC)
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma 5.22
- **Authentication**: Clerk 6.36
- **Background Jobs**: Inngest 3.49 + Inngest Agent Kit 0.13

#### **AI & Sandboxes**
- **AI Model**: Google Gemini 2.0 Flash Exp
- **Agent Framework**: Inngest Agent Kit with LangChain Core
- **Sandbox Runtime**: E2B Code Interpreter 2.3
- **Docker**: Custom Next.js templates with pre-installed dependencies

#### **DevOps**
- **Build Tool**: Turbopack (Next.js Turbo mode)
- **Type Checking**: TypeScript 5.9 (strict mode)
- **Linting**: ESLint 9 + Next.js config
- **Package Manager**: npm (with lock file)

---

## 🗄️ Database Schema

### Core Models

```prisma
model Project {
  id        String    @id @default(uuid())
  name      String
  userId    String?
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Message {
  id        String      @id @default(uuid())
  content   String
  role      MessageRole  // USER | ASSISTANT
  type      MessageType  // RESULT | ERROR
  projectId String
  fragment  Fragment?
  project   Project     @relation(...)
}

model Fragment {
  id         String   @id @default(uuid())
  messageId  String   @unique
  sandboxUrl String   // E2B sandbox URL
  title      String
  files      Json     // Generated code files
}

model Usage {
  key            String   @id       // Clerk user ID
  points         Int      @default(0)
  consumedPoints Int      @default(0)
  expire         BigInt?  // Unix timestamp
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **PostgreSQL**: 14.x or higher (or Neon account)
- **Clerk Account**: For authentication
- **E2B Account**: For cloud sandboxes
- **Inngest Account**: For background jobs (optional for dev)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lovable-Advance-SaaS-project-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   DIRECT_URL="postgresql://user:password@host:5432/database"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   
   # E2B Sandboxes
   E2B_API_KEY="your_e2b_api_key"
   
   # Inngest
   INNGEST_EVENT_KEY="your_inngest_event_key"
   INNGEST_SIGNING_KEY="your_inngest_signing_key"
   
   # AI Models (Optional)
   GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
   OPENAI_API_KEY="your_openai_api_key"  # Optional
   ANTHROPIC_API_KEY="your_anthropic_api_key"  # Optional
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # (Optional) Seed initial data
   npx tsx prisma/seed.ts
   ```

5. **Run the development server**
   ```bash
   # Terminal 1: Next.js Development Server
   npm run dev
   
   # Terminal 2: Inngest Development Server
   npx inngest dev
   
   # Terminal 3 (Optional): Prisma Studio
   npx prisma studio
   ```

6. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Inngest Dev Server**: http://localhost:8288
   - **Prisma Studio**: http://localhost:5555

---

## 📚 Usage Guide

### Creating Your First Project

1. **Sign Up**: Navigate to http://localhost:3000 and sign up using Clerk
2. **New Project**: Click "New Project" from the dashboard
3. **Enter Prompt**: Describe your application (e.g., "Build a todo app with dark mode")
4. **Generate**: Watch the AI agent create your application in real-time
5. **Preview**: View your live application in the split-pane preview
6. **Iterate**: Send follow-up messages to modify the application

### Credit System

#### **Free Plan** (Default)
- 2 credits per month
- Resets every 30 days
- 1 credit per message

#### **Pro Plan**
- 100 credits per month
- Access via Clerk billing integration
- Priority support

#### **Enterprise Plan**
- 500 credits per month
- Custom features available

### Upgrading

1. When you run out of credits, a toast notification appears
2. Click **"Upgrade Now"** → redirects to `/home/pricing`
3. Select your plan (Pro or Enterprise)
4. Complete Clerk checkout
5. Credits are instantly allocated

---

## 🔧 Configuration

### Customizing Credit Limits

Edit `src/lib/usage.ts`:

```typescript
const FREE_POINTS = 2;      // Free tier credits
const PRO_POINTS = 100;     // Pro tier credits
const DURATION_DAYS = 30;   // Credit reset duration
const GENERATION_COST = 1;  // Credits per message
```

### AI Model Configuration

The primary AI model is configured in `src/inngest/functions.ts`:

```typescript
model: gemini({ model: "gemini-2.0-flash-exp" })
```

To switch to OpenAI or Anthropic, update the model provider and ensure API keys are set.

### Sandbox Template

Customize the E2B sandbox template in `sandbox-templates/nextjs/`:

- **e2b.Dockerfile**: Base Docker image configuration
- **e2b.toml**: E2B sandbox settings
- **compile_page.sh**: Post-creation compilation script

---

## 🧪 Testing

### Manual Testing

```bash
# Test credit system
npx tsx scripts/test-usage.ts

# Upgrade a user to Pro
npx tsx scripts/upgrade-user.ts <clerk_user_id> pro
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name <migration_name>
```

---

## 📦 Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed data script
├── sandbox-templates/
│   └── nextjs/                # E2B Docker template
├── scripts/
│   ├── test-usage.ts          # Credit system testing
│   └── upgrade-user.ts        # Manual user upgrades
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── home/              # Dashboard & pricing
│   │   ├── projects/          # Project pages
│   │   ├── sign-in/           # Auth pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Shared components
│   │   ├── ui/                # Shadcn/ui components (40+)
│   │   ├── MainSidebar.tsx    # App navigation
│   │   └── theme-provider.tsx # Dark mode support
│   ├── hooks/                 # Custom React hooks
│   ├── inngest/               # Background jobs
│   │   ├── client.ts          # Inngest client
│   │   ├── functions.ts       # AI agent functions
│   │   └── util.ts            # Helper utilities
│   ├── lib/                   # Utility functions
│   │   ├── db.ts              # Prisma client
│   │   ├── usage.ts           # Credit tracking
│   │   ├── init-usage.ts      # User initialization
│   │   └── utils.ts           # General utilities
│   ├── modules/               # Feature modules
│   │   ├── home/              # Dashboard module
│   │   ├── messages/          # Message handling
│   │   ├── projects/          # Project management
│   │   ├── upgrade/           # Billing module
│   │   └── usage/             # Usage tracking
│   ├── trpc/                  # tRPC configuration
│   │   ├── client.tsx         # Client setup
│   │   ├── server.tsx         # Server setup
│   │   └── routers/           # API routers
│   ├── middleware.ts          # Auth middleware
│   └── prompt.ts              # AI prompt templates
└── package.json               # Dependencies
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository
   - Configure environment variables (same as `.env`)
   - Deploy

3. **Set up Inngest**
   - Add Vercel deployment URL to Inngest dashboard
   - Configure webhook endpoints

### Environment Variables for Production

Ensure these are set in your hosting platform:

```env
DATABASE_URL="<production_database_url>"
DIRECT_URL="<production_direct_url>"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<prod_clerk_key>"
CLERK_SECRET_KEY="<prod_clerk_secret>"
E2B_API_KEY="<prod_e2b_key>"
INNGEST_EVENT_KEY="<prod_inngest_key>"
INNGEST_SIGNING_KEY="<prod_inngest_signing_key>"
GOOGLE_GENERATIVE_AI_API_KEY="<prod_gemini_key>"
```

---

## 🛠️ Troubleshooting

### TypeScript Errors After Schema Changes

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### HMR (Hot Module Replacement) Issues

If you encounter `module factory is not available` errors:

```bash
# Stop all servers
# Clear cache
rm -rf .next

# Restart
npm run dev
```

### Credits Not Updating

1. Check Prisma Studio (http://localhost:5555)
2. Verify Usage table has correct data
3. Check browser console for errors
4. Ensure `consumeCredits()` is called in message creation

### E2B Sandbox Timeout

- Default timeout: 20 minutes
- Increase in `src/inngest/functions.ts`:
  ```typescript
  await sandbox.setTimeout(60_000 * 60); // 1 hour
  ```

---

## 📄 API Documentation

### tRPC Procedures

#### **Projects**
- `projects.create` - Create new project
- `projects.list` - Get user's projects
- `projects.get` - Get single project
- `projects.delete` - Delete project

#### **Messages**
- `messages.create` - Send message (triggers AI generation)
- `messages.list` - Get project messages

#### **Usage**
- `usage.status` - Get current credit status
- `usage.consume` - Consume credits (internal)

#### **Upgrade**
- `upgrade.upgradeToPro` - Upgrade to Pro/Enterprise
- `upgrade.addCredits` - Manually add credits (admin)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use Prettier for code formatting
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting

---

## 📚 Additional Documentation

For detailed information on specific features:

- **[USAGE_SYSTEM_SETUP.md](./USAGE_SYSTEM_SETUP.md)** - Credit system configuration
- **[UPGRADE_SYSTEM.md](./UPGRADE_SYSTEM.md)** - Billing and upgrade flows
- **[CLERK_PAYMENT_SYSTEM.md](./CLERK_PAYMENT_SYSTEM.md)** - Clerk integration details
- **[PRODUCTION_USAGE_SYSTEM.md](./PRODUCTION_USAGE_SYSTEM.md)** - Production deployment guide
- **[UPGRADE_FLOW.md](./UPGRADE_FLOW.md)** - User upgrade experience
- **[HMR_RESOLUTION.md](./HMR_RESOLUTION.md)** - HMR troubleshooting
- **[WORK_LOG.md](./WORK_LOG.md)** - Development history

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- **Inngest** - Background job orchestration and agent toolkit
- **E2B** - Cloud sandbox infrastructure
- **Clerk** - Authentication and user management
- **Vercel** - Hosting and deployment platform
- **Shadcn/ui** - Beautiful UI component library

---

## 📧 Support

For questions or issues:

- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- **Email**: support@yourdomain.com
- **Documentation**: [Full docs](https://docs.yourdomain.com)

---

<div align="center">

**Built with ❤️ using Next.js, React, and AI**

[Demo](https://demo.yourdomain.com) • [Documentation](https://docs.yourdomain.com) • [Blog](https://blog.yourdomain.com)

</div>
