import React from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetMember } from '../api/useGetMember';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronDown, Loader, MailIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useUpdateMember } from '../api/useUpdateMember';
import { useDeleteMember } from '../api/useDeleteMember';
import { useCurrentMember } from '../api/useCurrentMember';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';
import { useRouter } from 'next/navigation';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuRadioGroup,
        DropdownMenuRadioItem,
        DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileProps {
        memberId: Id<'members'>;
        onCloseMessage: () => void;
}
export const Profile = ({ memberId, onCloseMessage }: ProfileProps) => {
        const router = useRouter();
        const workspaceId = useWorkspaceId();
        const [LeaveDialog, confirmLeave] = useConfirm(
                'Leave this workspace',
                'Are you sure you want to leave this workspace? ',
        );
        const [UpdateDialog, confirmUpdate] = useConfirm(
                'Update user role',
                'Are you sure you want to update this user role? ',
        );
        const [RemoveDialog, confirmRemove] = useConfirm(
                'Remove member',
                'Are you sure you want to remove this member? ',
        );
        const { data: member, isLoading: isMemberLoading } = useGetMember({ id: memberId });
        const { data: currentMember, isLoading: isCurrentMemberLoading } = useCurrentMember({
                workspaceId: workspaceId,
        });

        const { mutate: updateMember, isPending: isUpdateMemberLoading } = useUpdateMember();
        const { mutate: deleteMember, isPending: isDeleteMemberLoading } = useDeleteMember();
        const onRemoveMember = async () => {
                const ok = await confirmRemove();
                if (!ok) return;
                deleteMember(
                        { id: memberId },
                        {
                                onSuccess: () => {
                                        onCloseMessage();
                                        toast.success('Member removed');
                                },
                                onError: (error) => {
                                        toast.error('Failed to remove member');
                                },
                        },
                );
        };

        const onLeaveWorkspace = async () => {
                const ok = await confirmLeave();
                if (!ok) return;
                deleteMember(
                        { id: memberId },
                        {
                                onSuccess: () => {
                                        router.replace('/');
                                        onCloseMessage();
                                        toast.success('You have left the workspace');
                                },
                                onError: (error) => {
                                        toast.error('Failed to leave workspace');
                                },
                        },
                );
        };

        const onRoleChange = async (role: 'admin' | 'member') => {
                const ok = await confirmUpdate();
                if (!ok) return;
                updateMember(
                        { id: memberId, role },
                        {
                                onSuccess: () => {
                                        toast.success('Role updated');
                                },
                                onError: (error) => {
                                        toast.error('Failed to update role');
                                },
                        },
                );
        };

        const avatarFallback = member?.user.name?.[0].toUpperCase() ?? 'M';
        if (isMemberLoading || isCurrentMemberLoading || isUpdateMemberLoading || isDeleteMemberLoading) {
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
                <>
                        <LeaveDialog />
                        <RemoveDialog />
                        <UpdateDialog />
                        <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center h-12 px-4 border-b">
                                        <p className="text-lg font-bold">Profile</p>
                                        <Button onClick={onCloseMessage} size={'iconSm'} variant={'ghost'}>
                                                <XIcon className="size-5 stroke-2" />
                                        </Button>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4">
                                        <Avatar className="max-w-60 max-h-60 size-full">
                                                <AvatarImage
                                                        alt={member.user.name}
                                                        src={member.user.image}
                                                ></AvatarImage>
                                                <AvatarFallback className="aspect-square text-7xl">
                                                        {avatarFallback}
                                                </AvatarFallback>
                                        </Avatar>
                                </div>
                                <div className="flex flex-col p-4">
                                        <p className="text-2xl font-bold">{member.user.name}</p>
                                        {currentMember?.role === 'admin' && currentMember?._id !== memberId ? (
                                                <div className="flex items-center gap-2 mt-4">
                                                        <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                                onClick={() => {}}
                                                                                variant={'outline'}
                                                                                className="w-full capitalize"
                                                                        >
                                                                                {member.role}{' '}
                                                                                <ChevronDown className="size-4 ml-2" />
                                                                        </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="w-full">
                                                                        <DropdownMenuRadioGroup
                                                                                value={member.role}
                                                                                onValueChange={(role) =>
                                                                                        onRoleChange(
                                                                                                role as
                                                                                                        | 'admin'
                                                                                                        | 'member',
                                                                                        )
                                                                                }
                                                                        >
                                                                                <DropdownMenuRadioItem value="admin">
                                                                                        Admin
                                                                                </DropdownMenuRadioItem>
                                                                                <DropdownMenuRadioItem value="member">
                                                                                        Member
                                                                                </DropdownMenuRadioItem>
                                                                        </DropdownMenuRadioGroup>
                                                                </DropdownMenuContent>
                                                        </DropdownMenu>

                                                        <Button onClick={onRemoveMember} className="w-full">
                                                                Remove
                                                        </Button>
                                                </div>
                                        ) : currentMember?._id === memberId && currentMember?.role !== 'admin' ? (
                                                <div className="mt-4 ">
                                                        <Button onClick={onLeaveWorkspace} className="w-full">
                                                                Leave
                                                        </Button>
                                                </div>
                                        ) : null}
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
                </>
        );
};
