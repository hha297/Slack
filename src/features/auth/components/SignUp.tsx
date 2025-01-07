import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

import { FaFacebook, FaGithub } from 'react-icons/fa';
import { SignInFlow } from '../type';
import { TriangleAlert } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';

interface SignUpProps {
        setState: (state: SignInFlow) => void;
}
export const SignUp: React.FC<SignUpProps> = ({ setState }) => {
        const { signIn } = useAuthActions();
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [pending, setPending] = useState(false);
        const [error, setError] = useState('');

        const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (password !== confirmPassword) {
                        setError('Passwords do not match');
                        return;
                }
                setPending(true);
                signIn('password', { email, password, flow: 'signUp' })
                        .catch(() => {
                                setError('Invalid email or password');
                        })
                        .finally(() => setPending(false));
        };

        const handleProviderSignUp = (value: 'google' | 'github') => {
                setPending(true);
                signIn(value).finally(() => setPending(false));
        };
        return (
                <Card className="w-full h-full p-8">
                        <CardHeader className="px-0 pt-0">
                                <CardTitle>Sign Up</CardTitle>

                                <CardDescription>Use your email or another service to continue</CardDescription>
                        </CardHeader>
                        {!!error && (
                                <div className="bg-destructive/15 p-3 flex flex-row justify-center rounded-md items-center gap-x-2 mb-4 text-sm text-destructive">
                                        <TriangleAlert className="w-4 h-4" />
                                        <p>{error}</p>
                                </div>
                        )}
                        <CardContent className="space-y-5 px-0 pb-0">
                                <form onSubmit={onPasswordSignUp} className="space-y-2.5">
                                        <Input
                                                disabled={pending}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email"
                                                placeholder="Email"
                                                required
                                        />

                                        <Input
                                                disabled={pending}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                type="password"
                                                placeholder="Password"
                                                required
                                        />
                                        <Input
                                                disabled={pending}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                type="password"
                                                placeholder="Confirm Password"
                                                required
                                        />

                                        <Button type="submit" className="w-full" size="lg" disabled={pending}>
                                                Continue
                                        </Button>
                                </form>
                                <Separator />
                                <div className="flex flex-col gap-y-2.5">
                                        <Button
                                                type="button"
                                                className="w-full relative"
                                                size="lg"
                                                variant="outline"
                                                disabled={pending}
                                                onClick={() => handleProviderSignUp('google')}
                                        >
                                                <FcGoogle className="size-50 absolute left-3 top-1/2 -translate-y-1/2" />
                                                Continue with Google
                                        </Button>
                                        <Button
                                                type="button"
                                                className="w-full relative"
                                                size="lg"
                                                variant="outline"
                                                disabled={pending}
                                                onClick={() => handleProviderSignUp('github')}
                                        >
                                                <FaGithub className="size-50 absolute left-3 top-1/2 -translate-y-1/2" />
                                                Continue with Github
                                        </Button>
                                </div>
                                <p className="text-center text-sm text-muted-foreground">
                                        Already have an account?{' '}
                                        <span
                                                className="text-sky-700 hover:underline cursor-pointer"
                                                onClick={() => setState('signIn')}
                                        >
                                                Sign In
                                        </span>{' '}
                                </p>
                        </CardContent>
                </Card>
        );
};
