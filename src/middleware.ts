import {
        convexAuthNextjsMiddleware,
        createRouteMatcher,
        isAuthenticatedNextjs,
        nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isPublicRoute = createRouteMatcher(['/auth']);

// NOTE: IF ERROR, CHECK IN CONVEX DOCS https://labs.convex.dev/auth/authz/nextjs AND MADE CHANGE
export default convexAuthNextjsMiddleware(async (request) => {
        if (!isPublicRoute(request) && !(await isAuthenticatedNextjs())) {
                return nextjsMiddlewareRedirect(request, '/auth');
        }

        if (isPublicRoute(request) && (await isAuthenticatedNextjs())) {
                return nextjsMiddlewareRedirect(request, '/');
        }
        //TODO: Redirect user away from '/auth' if authenticated
});

export const config = {
        // The following matcher runs middleware on all routes
        // except static assets.
        matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
