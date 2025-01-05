'use client';

import { Button } from '@/components/ui/button';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { useAuthActions } from '@convex-dev/auth/react';

export default function Home() {
        const { signOut } = useAuthActions();
        return (
                <div>
                        Logged In
                        <Button onClick={() => signOut()}>Sign Out</Button>
                </div>
        );
}
