# Troubleshooting Guide

Common issues and their solutions when using Better Auth with Next.js.

---

## ✅ Issues Fixed

### 1. "The model 'user' was not found in the schema object"

**Problem:** Drizzle adapter couldn't find the database tables.

**Solution:**

-   Import the schema in `db/index.ts`:
    ```ts
    import * as schema from "./auth-schema";
    export const db = drizzle(process.env.DATABASE_URL!, { schema });
    ```
-   Pass schema to the adapter in `lib/auth.ts`:

    ```ts
    import * as schema from "@/db/auth-schema";

    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    ```

-   Run `pnpm drizzle:push` to sync database

### 2. "Social provider is missing clientId or clientSecret"

**Problem:** OAuth credentials not configured or not available.

**Solution:**

-   If you don't need OAuth yet, they're now optional (warnings will appear but won't break functionality)
-   To set up OAuth properly, see [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md)
-   Add credentials to `.env`:
    ```env
    GOOGLE_CLIENT_ID=your_client_id
    GOOGLE_CLIENT_SECRET=your_client_secret
    GITHUB_CLIENT_ID=your_client_id
    GITHUB_CLIENT_SECRET=your_client_secret
    ```

---

## Common Issues

### Email/Password Signup Not Working

**Symptoms:**

-   500 error when trying to sign up
-   "Model not found" errors in console

**Solutions:**

1. **Check database schema is pushed:**

    ```bash
    pnpm drizzle:push
    ```

2. **Verify DATABASE_URL is correct:**

    - Check your `.env` file
    - Make sure the database is accessible
    - Test connection string

3. **Ensure schema is imported in auth.ts:**

    ```ts
    import * as schema from "@/db/auth-schema";

    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    ```

4. **Restart development server:**
    ```bash
    # Stop the server (Ctrl+C)
    pnpm dev
    ```

---

### OAuth Buttons Not Working

**Symptoms:**

-   Clicking OAuth button does nothing
-   Redirect errors
-   "Invalid client" errors

**Solutions:**

1. **Check OAuth credentials are set:**

    ```bash
    # View your .env file
    cat .env  # Linux/Mac
    type .env # Windows
    ```

2. **Verify redirect URIs match exactly:**

    - Development: `http://localhost:3000/api/auth/callback/google`
    - Production: `https://yourdomain.com/api/auth/callback/google`
    - No trailing slashes!

3. **For GitHub Apps (not OAuth Apps):**

    - Enable "Email addresses" permission (Read-only)
    - See [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md#important-note-for-github-apps)

4. **Check OAuth app status:**
    - Make sure app isn't suspended
    - Verify you're using the correct credentials

---

### Session Not Persisting

**Symptoms:**

-   User signed in but session lost on page reload
-   Redirected to sign-in page immediately after login

**Solutions:**

1. **Check BETTER_AUTH_SECRET is set:**

    ```env
    BETTER_AUTH_SECRET=your_secret_key_here
    ```

2. **Generate a proper secret:**

    ```bash
    # Linux/Mac
    openssl rand -base64 32

    # Or use Node.js
    node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    ```

3. **Clear browser cookies:**

    - Open DevTools (F12)
    - Application tab → Cookies
    - Delete all cookies for localhost:3000

4. **Check cookie settings:**
    - Make sure `nextCookies()` plugin is added
    - Verify it's the last plugin in the array

---

### Middleware Blocking All Routes

**Symptoms:**

-   Can't access any pages
-   Constant redirects
-   "Too many redirects" error

**Solutions:**

1. **Check middleware matcher:**

    ```ts
    // middleware.ts
    export const config = {
        matcher: ["/dashboard"], // Only protect specific routes
    };
    ```

2. **Don't protect auth routes:**

    ```ts
    // WRONG - Don't do this
    matcher: ["/dashboard", "/sign-in", "/sign-up"];

    // CORRECT - Only protect after-login routes
    matcher: ["/dashboard", "/profile", "/settings"];
    ```

3. **Ensure home page is not protected:**
    - `/` (home) should be accessible to everyone
    - `/sign-in` and `/sign-up` should be public

---

### Database Connection Errors

**Symptoms:**

-   "Connection refused"
-   "Invalid connection string"
-   "Role does not exist"

**Solutions:**

1. **Verify DATABASE_URL format:**

    ```env
    DATABASE_URL=postgresql://username:password@host:port/database
    ```

2. **For Neon/Vercel Postgres:**

    - Use the connection string with `?sslmode=require`
    - Make sure you're using the correct endpoint

3. **Check database exists:**

    - Log into your database provider
    - Verify the database is created
    - Check user permissions

4. **Test connection:**
    ```bash
    # Using psql (if installed)
    psql "your_database_url"
    ```

---

### TypeScript Errors

**Symptoms:**

-   Red squiggly lines in VS Code
-   Build fails with type errors

**Solutions:**

1. **Regenerate Better Auth types:**

    ```bash
    # Delete .next folder
    rm -rf .next  # Linux/Mac
    rmdir /s .next  # Windows

    # Restart dev server
    pnpm dev
    ```

2. **Check imports:**

    ```ts
    // Client-side
    import { authClient } from "@/lib/auth-client";
    import { createAuthClient } from "better-auth/react"; // Note: /react

    // Server-side
    import { auth } from "@/lib/auth";
    import { betterAuth } from "better-auth";
    ```

3. **Ensure types are generated:**
    - Types are auto-generated on first run
    - Check `.better-auth` folder exists

---

### Environment Variables Not Loading

**Symptoms:**

-   "undefined" errors
-   Credentials not found
-   Features not working despite correct .env

**Solutions:**

1. **Restart development server:**

    - Changes to `.env` require a restart
    - Stop server (Ctrl+C) and run `pnpm dev` again

2. **Check .env file location:**

    - Must be in project root
    - Same directory as `package.json`

3. **Check for typos:**

    - Variable names are case-sensitive
    - No spaces around `=`
    - No quotes needed (usually)

4. **For client-side access:**
    - Must prefix with `NEXT_PUBLIC_`
    - Example: `NEXT_PUBLIC_APP_URL`

---

### Production Deployment Issues

**Symptoms:**

-   Works locally but not in production
-   OAuth redirects failing
-   Database connection errors

**Solutions:**

1. **Update OAuth redirect URIs:**

    - Add production URLs to OAuth apps
    - Example: `https://yourdomain.com/api/auth/callback/google`

2. **Set production environment variables:**

    - Copy all variables from `.env` to hosting platform
    - Update `BETTER_AUTH_URL` to production domain

3. **Check CORS settings:**

    - Make sure your domain is allowed
    - Verify API routes are accessible

4. **Database connection:**
    - Use production database URL
    - Check connection pooling settings
    - Verify SSL/TLS requirements

---

## Getting Help

If you're still stuck:

1. **Check Better Auth Discord:**

    - [Join Discord](https://discord.gg/better-auth)
    - Search for similar issues
    - Ask in support channels

2. **Check GitHub Issues:**

    - [Better Auth Issues](https://github.com/better-auth/better-auth/issues)
    - Search for similar problems
    - Create new issue if needed

3. **Review Documentation:**

    - [Better Auth Docs](https://better-auth.com)
    - [Next.js Docs](https://nextjs.org/docs)
    - Project docs in this repo

4. **Enable Debug Logging:**
    ```ts
    // In lib/auth.ts
    export const auth = betterAuth({
        // ...other config
        debug: true, // Enable detailed logging
    });
    ```

---

## Preventive Measures

To avoid common issues:

1. ✅ **Always restart dev server** after `.env` changes
2. ✅ **Run `pnpm drizzle:push`** after schema changes
3. ✅ **Keep Better Auth updated** for bug fixes
4. ✅ **Use exact redirect URIs** (no trailing slashes)
5. ✅ **Test locally** before deploying to production
6. ✅ **Keep secrets secure** (never commit `.env`)
7. ✅ **Use different OAuth apps** for dev and production

---

## Quick Checklist

When something breaks, check:

-   [ ] Dev server restarted after .env changes?
-   [ ] Database schema pushed (`pnpm drizzle:push`)?
-   [ ] All environment variables set in `.env`?
-   [ ] OAuth redirect URIs match exactly?
-   [ ] Schema imported and passed to adapter?
-   [ ] Browser cookies cleared?
-   [ ] Console errors checked (F12)?
-   [ ] Network tab checked for failed requests?

---

**Still having issues?** Create an issue in the repository with:

-   Error messages (full stack trace)
-   What you tried
-   Your configuration (without secrets!)
-   Steps to reproduce
