import { ConvexClientProvider } from '@/components/ConvexClientProvider';

import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';

import './globals.css';
import { League_Spartan } from 'next/font/google';

const leagueSpartan = League_Spartan({ subsets: ['latin'] });

export const metadata = {
        title: 'Slack Clone',
        description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
                <ConvexAuthNextjsServerProvider>
                        <html lang="en">
                                <body className={leagueSpartan.className}>
                                        <ConvexClientProvider>{children}</ConvexClientProvider>
                                </body>
                        </html>
                </ConvexAuthNextjsServerProvider>
        );
}
