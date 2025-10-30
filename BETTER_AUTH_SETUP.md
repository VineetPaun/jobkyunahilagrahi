# Better Auth Next.js Integration

This project demonstrates a complete Better Auth integration with Next.js.

## Setup Complete ✅

The following components have been configured:

### 1. API Route Handler

-   **Location**: `app/api/auth/[...all]/route.ts`
-   Handles all authentication requests via Better Auth

### 2. Auth Configuration

-   **Location**: `lib/auth.ts`
-   Configured with:
    -   Drizzle ORM adapter (PostgreSQL)
    -   Email/Password authentication
    -   GitHub OAuth
    -   `nextCookies()` plugin for server action support

### 3. Auth Client

-   **Location**: `lib/auth-client.ts`
-   React client for client-side authentication

### 4. Server Actions

-   **Location**: `lib/actions.ts`
-   Contains server actions for:
    -   `getSession()` - Get current session
    -   `signInAction()` - Sign in with email/password
    -   `signUpAction()` - Sign up with email/password
    -   `signOutAction()` - Sign out user

### 5. Middleware

-   **Location**: `middleware.ts`
-   Protects routes by checking session cookie
-   Currently configured to protect `/dashboard` route
-   ⚠️ **Note**: This is optimistic checking. Always validate session on the server!

### 6. Protected Page Example

-   **Location**: `app/dashboard/page.tsx`
-   Demonstrates proper server-side session validation
-   Redirects to home if not authenticated

### 7. Server Component Example

-   **Location**: `components/user-profile.tsx`
-   Shows how to use auth in React Server Components

## Usage Examples

### Client-Side Authentication (React)

```tsx
import { authClient } from "@/lib/auth-client";

// Sign up
const { data, error } = await authClient.signUp.email({
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
});

// Sign in
const { data, error } = await authClient.signIn.email({
    email: "user@example.com",
    password: "password123",
});

// Sign out
await authClient.signOut();

// Get session (reactive)
const { data: session } = authClient.useSession();
```

### Server Actions

```tsx
"use client";
import { signInAction, signUpAction, signOutAction } from "@/lib/actions";

async function handleSignIn() {
    const result = await signInAction("user@example.com", "password123");
    if (result.success) {
        // Handle success
    }
}
```

### Server Components

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function MyServerComponent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return <div>Not authenticated</div>;
    }

    return <div>Welcome {session.user.name}!</div>;
}
```

### Protected Routes

To protect additional routes, update the middleware matcher:

```ts
// middleware.ts
export const config = {
    matcher: ["/dashboard", "/profile", "/settings"], // Add your protected routes
};
```

## Important Security Notes

1. **Middleware Cookie Check**: The middleware only checks for cookie existence, not validity. Always validate sessions on the server side in your pages/routes.

2. **Server-Side Validation**: Each protected page should call `auth.api.getSession()` to properly validate the session.

3. **Cookie Cache**: In RSCs, the cookie cache won't refresh until the server is interacted with via Server Actions or Route Handlers.

## Environment Variables

Make sure you have the following in your `.env` file:

```env
DATABASE_URL=your_database_url
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## OAuth Provider Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)
2. Create a new project or select an existing one
3. Navigate to "Credentials" > "Create Credentials" > "OAuth client ID"
4. Configure the OAuth consent screen if you haven't already
5. For Application type, select "Web application"
6. Add authorized redirect URIs:
    - Development: `http://localhost:3000/api/auth/callback/google`
    - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env` file

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
    - Application name: Your app name
    - Homepage URL: `http://localhost:3000` (or your domain)
    - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a Client Secret
6. Add them to your `.env` file

**Important for GitHub Apps**: If you're using a GitHub App instead of an OAuth App:

-   Go to _Permissions and Events_ > _Account Permissions_ > _Email Addresses_
-   Set to "Read-Only" and save changes

## Pages Created

### 1. Sign In Page (`app/sign-in/page.tsx`)

-   Email/password sign in
-   Google OAuth button
-   GitHub OAuth button
-   Link to sign up page

### 2. Sign Up Page (`app/sign-up/page.tsx`)

-   Email/password registration
-   Google OAuth button
-   GitHub OAuth button
-   Link to sign in page

### 3. Home Page (`app/page.tsx`)

-   Landing page with navigation links
-   Links to sign in, sign up, and dashboard

### 4. OAuth Buttons Component (`components/oauth-buttons.tsx`)

-   Reusable OAuth buttons for Google and GitHub
-   Used in both sign-in and sign-up pages

## Next Steps

1. ✅ ~~Create sign-in and sign-up pages~~ (Completed)
2. ✅ ~~Add more OAuth providers like Google and GitHub~~ (Completed)
3. Set up your Google and GitHub OAuth apps and add credentials to `.env`
4. Customize the middleware matcher for your protected routes
5. Implement proper error handling and loading states
6. Add email verification if needed
7. Style the pages according to your design system

## Resources

-   [Better Auth Documentation](https://better-auth.com)
-   [Next.js Documentation](https://nextjs.org/docs)
