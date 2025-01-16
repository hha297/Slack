import React, { useState } from 'react';
import { useCreateChannelModal } from '../store/useCreateChannelModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateChannels } from '../api/useCreateChannels';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { toast } from 'sonner';

export const CreateChannelModal = () => {
        const workspaceId = useWorkspaceId();
        const { mutate, isPending } = useCreateChannels();
        const [open, setOpen] = useCreateChannelModal();
        const [name, setName] = useState('');

        const handleClose = () => {
                setName('');
                setOpen(false);
        };
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
                setName(value);
        };

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                mutate(
                        { name, workspaceId },
                        {
                                onSuccess: (id) => {
                                        //Redirect to new channels
                                        toast.success('Channel created successfully');
                                        handleClose();
                                },
                        },
                );
        };
        return (
                <Dialog open={open} onOpenChange={handleClose}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>Create Channel</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                        <Input
                                                value={name}
                                                disabled={isPending}
                                                onChange={handleChange}
                                                required
                                                autoFocus
                                                minLength={3}
                                                maxLength={100}
                                                placeholder="Channel Name"
                                        />
                                        <div className="flex justify-end">
                                                <Button disabled={isPending}>Create</Button>
                                        </div>
                                </form>
                        </DialogContent>
                </Dialog>
        );
};
