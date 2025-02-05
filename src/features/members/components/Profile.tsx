import React from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetMember } from '../api/useGetMember';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader, MailIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface ProfileProps {
        memberId: Id<'members'>;
        onCloseMessage: () => void;
}
export const Profile = ({ memberId, onCloseMessage }: ProfileProps) => {
        const { data: member, isLoading: isMemberLoading } = useGetMember({ id: memberId });
        const avatarFallback = member?.user.name?.[0].toUpperCase() ?? 'M';
        if (isMemberLoading) {
                return (
                        <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center h-12 px-4 border-b">
                                        <p className="text-lg font-bold">Profile</p>
                                        <Button onClick={onCloseMessage} size={'iconSm'} variant={'ghost'}>
                                                <XIcon className="size-5 stroke-2" />
                                        </Button>
                                </div>
                                <div className="flex h-full items-center justify-center">
                                        <Loader className="size-5 animate-spin text-muted-foreground" />
                                </div>
                        </div>
                );
        }
        if (!member)
                return (
                        <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center h-12 px-4 border-b">
                                        <p className="text-lg font-bold">Profile</p>
                                        <Button onClick={onCloseMessage} size={'iconSm'} variant={'ghost'}>
                                                <XIcon className="size-5 stroke-2" />
                                        </Button>
                                </div>
                                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                                        <AlertTriangle className="size-5 text-muted-foreground" />
                                        <p className="text-white text-lg">Member profile not found</p>
                                </div>
                        </div>
                );
        return (
                <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center h-12 px-4 border-b">
                                <p className="text-lg font-bold">Profile</p>
                                <Button onClick={onCloseMessage} size={'iconSm'} variant={'ghost'}>
                                        <XIcon className="size-5 stroke-2" />
                                </Button>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4">
                                <Avatar className="max-w-60 max-h-60 size-full">
                                        <AvatarImage alt={member.user.name} src={member.user.image}></AvatarImage>
                                        <AvatarFallback className="aspect-square text-7xl">
                                                {avatarFallback}
                                        </AvatarFallback>
                                </Avatar>
                        </div>
                        <div className="flex flex-col p-4">
                                <p className="text-2xl font-bold">{member.user.name}</p>
                        </div>
                        <Separator />
                        <div className="flex flex-col p-4">
                                <p className="text-sm font-bold mb-4">Contact Information</p>
                                <div className="flex items-center gap-2">
                                        <div className="size-4 rounded-md bg-muted flex items-center justify-center">
                                                <MailIcon className="size-4" />
                                        </div>
                                        <div className="flex flex-col">
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                        Email Address
                                                </p>
                                                <Link
                                                        href={`mailto:${member.user.email}`}
                                                        className="text-sm hover:underline text-[#1264A3]"
                                                >
                                                        {member.user.email}
                                                </Link>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};
