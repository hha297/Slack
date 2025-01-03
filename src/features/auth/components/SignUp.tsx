import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

import { FaFacebook, FaGithub } from 'react-icons/fa';
import { SignInFlow } from '../type';

interface SignUpProps {
        setState: (state: SignInFlow) => {};
}
export const SignUp: React.FC<SignUpProps> = ({ setState }) => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const [confirmPassword, setConfirmPassword] = useState('');
        return (
                <Card className="w-full h-full p-8">
                        <CardHeader className="px-0 pt-0">
                                <CardTitle>Sign Up</CardTitle>

                                <CardDescription>Use your email or another service to continue</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 px-0 pb-0">
                                <form className="space-y-2.5">
                                        <Input
                                                disabled={false}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email"
                                                placeholder="Email"
                                                required
                                        />

                                        <Input
                                                disabled={false}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                type="password"
                                                placeholder="Password"
                                                required
                                        />
                                        <Input
                                                disabled={false}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                type="password"
                                                placeholder="Confirm Password"
                                                required
                                        />

                                        <Button type="submit" className="w-full" size="lg" disabled={false}>
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
                                                disabled={false}
                                        >
                                                <FcGoogle className="size-50 absolute left-3 top-1/2 -translate-y-1/2" />
                                                Continue with Google
                                        </Button>
                                        <Button
                                                type="button"
                                                className="w-full relative"
                                                size="lg"
                                                variant="outline"
                                                disabled={false}
                                        >
                                                <FaGithub className="size-50 absolute left-3 top-1/2 -translate-y-1/2" />
                                                Continue with Google
                                        </Button>
                                        <Button
                                                type="button"
                                                className="w-full relative"
                                                size="lg"
                                                variant="outline"
                                                disabled={false}
                                        >
                                                <FaFacebook className="size-50 absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                                                Continue with Facebook
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
