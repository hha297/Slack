import { Button } from '@/components/ui/button';
import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDeleteChannels } from '@/features/channels/api/useDeleteChannel';
import { useUpdateChannels } from '@/features/channels/api/useUpdateChannel';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useChannelId } from '@/hooks/useChannelId';
import { useConfirm } from '@/hooks/useConfirm';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { toast } from 'sonner';

interface HeaderProps {
        channelName: string;
}
export const Header = ({ channelName }: HeaderProps) => {
        const [value, setValue] = useState(channelName);
        const [editOpen, setEditOpen] = useState(false);
        const [ConfirmDialog, confirm] = useConfirm('Delete Channel', 'Are you sure you want to delete this channel?');
        const channelId = useChannelId();
        const workspaceId = useWorkspaceId();
        const router = useRouter();
        const { data: member } = useCurrentMember({ workspaceId });
        const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannels();
        const { mutate: deleteChannel, isPending: isDeletingChannel } = useDeleteChannels();

        const handleOpen = (value: boolean) => {
                if (member?.role !== 'admin') return;
                setEditOpen(value);
        };
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
                setValue(value);
        };

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                updateChannel(
                        { id: channelId, name: value },
                        {
                                onSuccess: () => {
                                        toast.success('Channel updated successfully');
                                        setEditOpen(false);
                                },
                                onError: () => {
                                        toast.error('Failed to update channel');
                                },
                        },
                );
        };

        const handleDelete = async () => {
                const ok = await confirm();
                if (!ok) return;
                deleteChannel(
                        { id: channelId },
                        {
                                onSuccess: () => {
                                        router.push(`/workspace/${workspaceId}`);
                                        toast.success('Channel deleted successfully');
                                },
                                onError: () => {
                                        toast.error('Failed to delete channel');
                                },
                        },
                );
        };

        return (
                <div className="bg-white border-b h-12 flex items-center  px-4 overflow-hidden">
                        <ConfirmDialog />
                        <Dialog>
                                <DialogTrigger asChild>
                                        <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-lg font-semibold px-2 overflow-hidden w-auto"
                                        >
                                                <span className="truncate">#{channelName}</span>
                                                <FaChevronDown className="size-3 ml-2" />
                                        </Button>
                                </DialogTrigger>
                                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                                        <DialogHeader className="p-4 border-b bg-white">
                                                <DialogTitle className="text-lg font-semibold">
                                                        #{channelName}
                                                </DialogTitle>
                                        </DialogHeader>
                                        <div className="px-4 pb-4 flex flex-col gap-y-2">
                                                <Dialog open={editOpen} onOpenChange={handleOpen}>
                                                        <DialogTrigger asChild>
                                                                <div className="px-4 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                                                        <div className="flex items-center justify-between">
                                                                                <p className="text-sm font-semibold">
                                                                                        Channel name
                                                                                </p>
                                                                                {member?.role === 'admin' && (
                                                                                        <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                                                                                                Edit
                                                                                        </p>
                                                                                )}
                                                                        </div>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                #{channelName}
                                                                        </p>
                                                                </div>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                                <DialogHeader>
                                                                        <DialogTitle>Rename Channel</DialogTitle>
                                                                </DialogHeader>
                                                                <form className="space-y-4" onSubmit={handleSubmit}>
                                                                        <Input
                                                                                value={value}
                                                                                disabled={isUpdatingChannel}
                                                                                onChange={handleChange}
                                                                                required
                                                                                autoFocus
                                                                                minLength={3}
                                                                                maxLength={100}
                                                                                placeholder="Channel name"
                                                                        />
                                                                        <DialogFooter>
                                                                                <DialogClose asChild>
                                                                                        <Button
                                                                                                variant="outline"
                                                                                                disabled={
                                                                                                        isUpdatingChannel
                                                                                                }
                                                                                        >
                                                                                                Cancel
                                                                                        </Button>
                                                                                </DialogClose>
                                                                                <Button disabled={isUpdatingChannel}>
                                                                                        Save
                                                                                </Button>
                                                                        </DialogFooter>
                                                                </form>
                                                        </DialogContent>
                                                </Dialog>
                                                {member?.role === 'admin' && (
                                                        <button
                                                                disabled={isDeletingChannel}
                                                                onClick={handleDelete}
                                                                className="flex items-center justify-center gap-x-2 px-4 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                                                        >
                                                                <TrashIcon className="size-4 " />
                                                                <p className="text-sm font-semibold">Delete Channel</p>
                                                        </button>
                                                )}
                                        </div>
                                </DialogContent>
                        </Dialog>
                </div>
        );
};
