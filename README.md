# Better Auth Next.js App

A complete authentication system built with [Better Auth](https://better-auth.com) and [Next.js](https://nextjs.org), featuring email/password authentication and OAuth (Google & GitHub).

## ✨ Features

-   🔐 **Email/Password Authentication** - Traditional signup and login
-   🌐 **OAuth Integration** - Sign in with Google and GitHub
-   🛡️ **Protected Routes** - Middleware-based route protection
-   🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
-   🔄 **Server Actions** - Next.js 15 server actions support
-   📱 **React Server Components** - Optimized RSC implementation
-   🗄️ **PostgreSQL Database** - Using Drizzle ORM
-   🍪 **Cookie Management** - Automatic cookie handling with nextCookies plugin

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   PostgreSQL database
-   Google OAuth credentials (optional)
-   GitHub OAuth credentials (optional)

### Installation

1. **Clone and install dependencies:**

```bash
pnpm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [QUICKSTART.md](./QUICKSTART.md) for details)

3. **Set up OAuth providers:**

Follow the detailed guide in [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md)

4. **Push database schema:**

```bash
pnpm drizzle:push
```

5. **Start the development server:**

```bash
pnpm dev
```

6. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

-   **[QUICKSTART.md](./QUICKSTART.md)** - Get started in minutes
-   **[BETTER_AUTH_SETUP.md](./BETTER_AUTH_SETUP.md)** - Complete integration guide
-   **[OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md)** - OAuth setup walkthrough

## 🗂️ Project Structure

```
├── app/
│   ├── api/auth/[...all]/route.ts   # Better Auth API handler
│   ├── sign-in/page.tsx              # Sign in page
│   ├── sign-up/page.tsx              # Sign up page
│   ├── dashboard/page.tsx            # Protected dashboard
│   └── page.tsx                      # Home page
├── components/
│   ├── oauth-buttons.tsx             # Reusable OAuth buttons
│   ├── user-profile.tsx              # User profile component
│   └── ui/                           # shadcn/ui components
├── lib/
│   ├── auth.ts                       # Better Auth config
│   ├── auth-client.ts                # Client-side auth
│   └── actions.ts                    # Server actions
├── db/
│   ├── index.ts                      # Database connection
│   └── auth-schema.ts                # Auth schema
└── middleware.ts                     # Route protection
```

## 🛠️ Tech Stack

-   **Framework:** Next.js 16
-   **Authentication:** Better Auth
-   **Database:** PostgreSQL with Drizzle ORM
-   **Styling:** Tailwind CSS v4
-   **UI Components:** shadcn/ui
-   **Type Safety:** TypeScript

## 🔒 Available Routes

| Route         | Type      | Description                 |
| ------------- | --------- | --------------------------- |
| `/`           | Public    | Landing page                |
| `/sign-in`    | Public    | Sign in with email or OAuth |
| `/sign-up`    | Public    | Create new account          |
| `/dashboard`  | Protected | User dashboard              |
| `/api/auth/*` | API       | Authentication endpoints    |

## 💡 Usage Examples

### Client-Side Authentication

```tsx
import { authClient } from "@/lib/auth-client";

// Sign up with email
await authClient.signUp.email({
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
});

// Sign in with OAuth
await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
});
```

### Server-Side Session

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return <div>Welcome {session.user.name}!</div>;
}
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## 📦 Scripts

```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm drizzle:push  # Push schema to database
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🔗 Resources

-   [Better Auth Documentation](https://better-auth.com)
-   [Next.js Documentation](https://nextjs.org/docs)
-   [Drizzle ORM](https://orm.drizzle.team)
-   [shadcn/ui](https://ui.shadcn.com)

## 💬 Support

-   Better Auth Discord: [Join here](https://discord.gg/better-auth)
-   GitHub Issues: [Report issues](https://github.com/better-auth/better-auth/issues)

---

**Built with ❤️ using Better Auth and Next.js**
