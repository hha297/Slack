import {
        convexAuthNextjsMiddleware,
        createRouteMatcher,
        isAuthenticatedNextjs,
        nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isPublicRoute = createRouteMatcher(['/auth']);

// NOTE: IF ERROR, CHECK IN CONVEX DOCS https://labs.convex.dev/auth/authz/nextjs AND MADE CHANGE
export default convexAuthNextjsMiddleware(async (request) => {
        try {
                if (!isPublicRoute(request) && !(await isAuthenticatedNextjs())) {
                        return nextjsMiddlewareRedirect(request, '/auth');
                }

                if (isPublicRoute(request) && (await isAuthenticatedNextjs())) {
                        return nextjsMiddlewareRedirect(request, '/');
                }
        } catch (error: any) {
                console.error('Error in authentication middleware:', error);

                // If the error is due to an expired token, redirect to the login page
                if (error.message.includes('Expired')) {
                        return nextjsMiddlewareRedirect(request, '/auth');
                }

                // Handle other errors
                return new Response('Internal Server Error', { status: 500 });
        }
});

export const config = {
        // The following matcher runs middleware on all routes
        // except static assets.
        matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
