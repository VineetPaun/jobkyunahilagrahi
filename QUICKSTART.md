# Quick Start Guide

Get your Better Auth app running in minutes!

## Prerequisites

-   Node.js 18+ installed
-   PostgreSQL database (or use [Neon](https://neon.tech) for free)
-   GitHub and/or Google account for OAuth setup

---

## 1. Install Dependencies

```bash
pnpm install
```

---

## 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Better Auth
BETTER_AUTH_SECRET=generate_a_random_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (get from GitHub Developer Settings)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Generate a Secret

You can generate a random secret using:

```bash
# On Linux/Mac
openssl rand -base64 32

# Or use any password generator
```

---

## 3. Set Up OAuth Providers

Follow the detailed guides:

-   **Google**: See [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md#google-oauth-setup)
-   **GitHub**: See [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md#github-oauth-setup)

**Quick Links:**

-   [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
-   [GitHub OAuth Apps](https://github.com/settings/developers)

---

## 4. Set Up Database

Push the database schema:

```bash
pnpm drizzle:push
```

This will create all necessary tables in your database.

---

## 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Test Authentication

### Test Email/Password Auth

1. Go to `http://localhost:3000/sign-up`
2. Create an account with email and password
3. You should be redirected to the dashboard

### Test OAuth

1. Go to `http://localhost:3000/sign-in`
2. Click "Continue with Google" or "Continue with GitHub"
3. Authorize the app
4. You should be redirected to the dashboard

---

## Available Routes

| Route         | Description                  |
| ------------- | ---------------------------- |
| `/`           | Home page with navigation    |
| `/sign-in`    | Sign in page (email + OAuth) |
| `/sign-up`    | Sign up page (email + OAuth) |
| `/dashboard`  | Protected dashboard page     |
| `/api/auth/*` | Authentication API endpoints |

---

## Project Structure

```
├── app/
│   ├── api/auth/[...all]/route.ts   # Auth API handler
│   ├── sign-in/page.tsx              # Sign in page
│   ├── sign-up/page.tsx              # Sign up page
│   ├── dashboard/page.tsx            # Protected page
│   └── page.tsx                      # Home page
├── components/
│   ├── oauth-buttons.tsx             # OAuth buttons component
│   └── user-profile.tsx              # User profile component
├── lib/
│   ├── auth.ts                       # Auth configuration
│   ├── auth-client.ts                # Auth client
│   └── actions.ts                    # Server actions
├── middleware.ts                     # Route protection
└── .env.example                      # Environment variables template
```

---

## Next Steps

✅ **Basic Setup Complete!** Now you can:

1. **Customize the UI**: Update the sign-in and sign-up pages with your branding
2. **Add More Protected Routes**: Update `middleware.ts` to protect additional pages
3. **Add User Profile Management**: Create pages for users to update their profile
4. **Add Email Verification**: Enable email verification in Better Auth config
5. **Add Session Management**: View and manage active sessions
6. **Deploy to Production**: Follow production deployment guide

---

## Common Issues

### "Database connection error"

-   Check your `DATABASE_URL` is correct
-   Make sure your database is running
-   Verify your database user has proper permissions

### "OAuth redirect URI mismatch"

-   Ensure redirect URIs in OAuth apps match exactly: `http://localhost:3000/api/auth/callback/google` (or `/github`)
-   No trailing slashes
-   Check for typos

### "Session not found"

-   Make sure `BETTER_AUTH_SECRET` is set
-   Clear browser cookies and try again
-   Restart development server

### Changes to `.env` not taking effect

-   Restart your development server after changing `.env`
-   Make sure `.env` is in the root directory

---

## Helpful Commands

```bash
# Start development server
pnpm dev

# Push database schema
pnpm drizzle:push

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

---

## Documentation

-   [BETTER_AUTH_SETUP.md](./BETTER_AUTH_SETUP.md) - Complete Better Auth integration guide
-   [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md) - Detailed OAuth setup instructions
-   [Better Auth Docs](https://better-auth.com) - Official Better Auth documentation
-   [Next.js Docs](https://nextjs.org/docs) - Next.js documentation

---

## Need Help?

-   Better Auth Discord: [Join here](https://discord.gg/better-auth)
-   GitHub Issues: [Report issues](https://github.com/better-auth/better-auth/issues)
-   Documentation: [better-auth.com](https://better-auth.com)

---

**Happy coding! 🚀**
