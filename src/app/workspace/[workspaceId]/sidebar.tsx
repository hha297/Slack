import { UserButton } from '@/components/UserButton';
import React from 'react';
import { WorkspaceSwitcher } from './workspaceSwitcher';
import SidebarButton from './sidebarButton';
import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
        const pathname = usePathname();
        return (
                <aside className="w-20 h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-2 pb-4">
                        <WorkspaceSwitcher />
                        <SidebarButton icon={Home} label="Home" isActive={pathname.includes('workspace')} />
                        <SidebarButton icon={MessageSquare} label="DMs" />
                        <SidebarButton icon={Bell} label="Activity" />
                        <SidebarButton icon={MoreHorizontal} label="More" />
                        <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
                                <UserButton />
                        </div>
                </aside>
        );
};
