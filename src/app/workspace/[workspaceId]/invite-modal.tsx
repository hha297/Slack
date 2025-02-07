import { Button } from '@/components/ui/button';
import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
} from '@/components/ui/dialog';
import { useNewJoinCode } from '@/features/workspaces/api/useNewJoinCode';
import { useConfirm } from '@/hooks/useConfirm';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { CopyIcon, RefreshCcw } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface InviteModalProps {
        open: boolean;
        setOpen: (open: boolean) => void;
        name: string;
        joinCode: string;
}
export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
        const workspaceId = useWorkspaceId();
        const [ConfirmDialog, confirm] = useConfirm(
                'Are you sure?',
                'This action will deactivate the current invite code and generate a new one.',
        );
        const { mutate, isPending } = useNewJoinCode();

        const handleGenerateNewCode = async () => {
                const ok = await confirm();
                if (!ok) return;
                mutate(
                        { id: workspaceId },
                        {
                                onSuccess: () => {
                                        toast.success('Invite code generated successfully');
                                },
                                onError: (error) => {
                                        toast.error('Failed to generate invite code');
                                },
                        },
                );
        };
        const handleCopy = () => {
                const inviteLink = `${window.location.origin}/join/${workspaceId}`;
                navigator.clipboard.writeText(inviteLink).then(() => {
                        toast.success('Invite link copied to clipboard');
                });
        };
        return (
                <>
                        <ConfirmDialog />
                        <Dialog open={open} onOpenChange={setOpen}>
                                <DialogContent>
                                        <DialogHeader>
                                                <DialogTitle className="font-bold">Invite people to {name}</DialogTitle>
                                                <DialogDescription>
                                                        Use the code below to invite others to your workspace
                                                </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-y-4 items-center justify-center py-4">
                                                <p className="flex flex-row text-4xl font-bold tracking-widest uppercase">
                                                        {joinCode}
                                                </p>
                                                <Button onClick={handleCopy} className="mt-2">
                                                        Copy Link
                                                        <CopyIcon className="size-4 ml-2" />
                                                </Button>
                                        </div>
                                        <div className="flex items-center justify-between w-full">
                                                <Button
                                                        disabled={isPending}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleGenerateNewCode}
                                                >
                                                        Generate new code
                                                        <RefreshCcw className="size-4" />
                                                </Button>
                                                <DialogClose asChild>
                                                        <Button>Close</Button>
                                                </DialogClose>
                                        </div>
                                </DialogContent>
                        </Dialog>
                </>
        );
};
