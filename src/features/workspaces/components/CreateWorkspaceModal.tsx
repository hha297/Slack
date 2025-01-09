'use client';
import { useState } from 'react';
import { useCreateWorkspaceModal } from '../store/useCreateWorkspaceModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateWorkspaces } from '../api/useCreateWorkspaces';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CreateWorkspaceModal = () => {
        const router = useRouter();
        const [open, setOpen] = useCreateWorkspaceModal();
        const [name, setName] = useState('');
        const { mutate, isPending } = useCreateWorkspaces();
        const handleClose = () => {
                setOpen(false);
                setName('');
        };

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                mutate(
                        { name },
                        {
                                onSuccess(id) {
                                        toast.success('Workspace created successfully');
                                        router.push(`/workspace/${id}`);
                                        handleClose();
                                },
                        },
                );
        };
        return (
                <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>Add A Workspace</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                        <Input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={isPending}
                                                required
                                                autoFocus
                                                minLength={3}
                                                placeholder="Workspace Name e.g. 'Work', 'Personal', 'Family'"
                                        />
                                        <div className="flex justify-end">
                                                <Button type="submit" disabled={name.length < 3 || isPending}>
                                                        Create
                                                </Button>
                                        </div>
                                </form>
                        </DialogContent>
                </Dialog>
        );
};

export default CreateWorkspaceModal;
