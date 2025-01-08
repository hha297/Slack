import { DataModel } from './_generated/dataModel.d';
import { convexAuth } from '@convex-dev/auth/server';
import Google from '@auth/core/providers/google';
import GitHub from '@auth/core/providers/github';
import { Password } from '@convex-dev/auth/providers/Password';

const CustomPassword = Password<DataModel>({
        profile(params) {
                return {
                        email: params.email as string,
                        name: params.name as string,
                };
        },
});
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
        providers: [CustomPassword, GitHub, Google],
});
