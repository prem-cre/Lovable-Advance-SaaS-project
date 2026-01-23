import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
    "/",
    "/api/inngest(.*)",
    "/sign-up(.*)",
    "/sign-in(.*)",
    "/api/auth(.*)",
    "/api/trpc(.*)",
    "/home(.*)",
    "/pricing(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|api/inngest|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api(?!/inngest)|trpc)(.*)',
    ],
};