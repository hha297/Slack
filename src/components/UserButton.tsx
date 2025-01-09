'use client';

import { useCurrentUser } from '@/features/auth/api/useCurrentUser';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Loader, LogOut } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';

export const UserButton = () => {
        const { signOut } = useAuthActions();
        const { data, isLoading } = useCurrentUser();
        if (isLoading) return <Loader className="size-4 animate-spin text-muted-foreground" />;

        if (!data) return null;

        const { name, image, email } = data;
        const avatarFallback = name!.charAt(0).toUpperCase();
        return (
                <DropdownMenu modal={false}>
                        <DropdownMenuTrigger className="outline-none relative">
                                <Avatar className="size-10 hover:opacity-75 transition">
                                        <AvatarImage alt={name} src={image} />
                                        <AvatarFallback className="bg-[#a40547] text-white text-xl font-bold">
                                                {avatarFallback}
                                        </AvatarFallback>
                                </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" side="right" className="w-60">
                                <DropdownMenuItem onClick={() => signOut()} className="h-10 cursor-pointer">
                                        <LogOut className="mr-2 size-4" />
                                        Log Out
                                </DropdownMenuItem>
                        </DropdownMenuContent>
                </DropdownMenu>
        );
};
