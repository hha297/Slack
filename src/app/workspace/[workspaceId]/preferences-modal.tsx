import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDeleteWorkspaces } from '@/features/workspaces/api/useDeleteWorkspaces';
import { useUpdateWorkspaces } from '@/features/workspaces/api/useUpdateWorkspaces';
import { useConfirm } from '@/hooks/useConfirm';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface PreferencesModalProps {
        open: boolean;
        setOpen: (open: boolean) => void;
        initialValue: string;
}
export const PreferencesModal = ({ open, setOpen, initialValue }: PreferencesModalProps) => {
        const workspaceId = useWorkspaceId();
        const router = useRouter();
        const [value, setValue] = useState(initialValue);
        const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This action is irreversible.');
        const [editOpen, setEditOpen] = useState(false);
        const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspaces();
        const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspaces();

        const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                updateWorkspace(
                        { id: workspaceId, name: value },
                        {
                                onSuccess: () => {
                                        toast.success('Workspace updated successfully');
                                        setEditOpen(false);
                                        // If error, remove this
                                        setOpen(false);
                                },
                                onError: () => {
                                        toast.error('Failed to update workspace');
                                },
                        },
                );
        };

        const handleDelete = async () => {
                const ok = await confirm();
                if (!ok) return;
                deleteWorkspace(
                        { id: workspaceId },
                        {
                                onSuccess: () => {
                                        router.replace('/');
                                        toast.success('Workspace deleted successfully');
                                },
                                onError: () => {
                                        toast.error('Failed to delete workspace');
                                },
                        },
                );
        };
        return (
                <>
                        <ConfirmDialog />
                        <Dialog open={open} onOpenChange={setOpen}>
                                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                                        <DialogHeader className="p-4 border-b bg-white">
                                                <DialogTitle>{value}</DialogTitle>
                                        </DialogHeader>
                                        <div className="px-4 pb-4 flex flex-col gap-y-2">
                                                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                                        <DialogTrigger asChild>
                                                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">
                                                                        <div className="flex items-center justify-between">
                                                                                <p className="text-sm font-semibold">
                                                                                        Workspace Name
                                                                                </p>
                                                                                <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                                                                                        Edit
                                                                                </p>
                                                                        </div>
                                                                        <p className="text-sm">{value}</p>
                                                                </div>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                                <DialogHeader>
                                                                        <DialogTitle>Rename this workspace</DialogTitle>
                                                                </DialogHeader>
                                                                <form className="space-y-4" onSubmit={handleEdit}>
                                                                        <Input
                                                                                disabled={isUpdatingWorkspace}
                                                                                value={value}
                                                                                onChange={(e) =>
                                                                                        setValue(e.target.value)
                                                                                }
                                                                                required
                                                                                autoFocus
                                                                                minLength={3}
                                                                                maxLength={100}
                                                                                placeholder="Workspace Name e.g. 'Work', 'Personal', 'Family'"
                                                                        />
                                                                        <DialogFooter>
                                                                                <DialogClose asChild>
                                                                                        <Button
                                                                                                variant="outline"
                                                                                                disabled={
                                                                                                        isUpdatingWorkspace
                                                                                                }
                                                                                        >
                                                                                                Cancel
                                                                                        </Button>
                                                                                </DialogClose>
                                                                                <Button disabled={isUpdatingWorkspace}>
                                                                                        Save
                                                                                </Button>
                                                                        </DialogFooter>
                                                                </form>
                                                        </DialogContent>
                                                </Dialog>
                                                <button
                                                        disabled={isDeletingWorkspace}
                                                        onClick={handleDelete}
                                                        className="flex items-center justify-center gap-x-2 px-5 py-4 bg-rose-600 rounded-lg border cursor-pointer hover:bg-rose-700 text-white"
                                                >
                                                        <TrashIcon className="size-4" />
                                                        <p className="text-sm font-semibold">Delete Workspace</p>
                                                </button>
                                        </div>
                                </DialogContent>
                        </Dialog>
                </>
        );
};
