import { Button } from '@/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';
import { AlertTriangle, Loader, XIcon } from 'lucide-react';
import { useGetMessage } from '../api/useGetMessage';
import { Message } from '@/components/Message';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useState } from 'react';

interface ThreadProps {
        messageId: Id<'messages'>;
        onCloseMessage: () => void;
}

export const Thread = ({ messageId, onCloseMessage }: ThreadProps) => {
        const workspaceId = useWorkspaceId();
        const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
        const { data: currentMember } = useCurrentMember({ workspaceId });
        const { data: message, isLoading: isMessageLoading } = useGetMessage({ id: messageId });

        if (isMessageLoading) {
                return (
                        <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center h-12 px-4 border-b">
                                        <p className="text-lg font-bold">Thread</p>
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

        if (!message)
                return (
                        <div className="h-full flex flex-col">
                                <div className="flex justify-between items-center h-12 px-4 border-b">
                                        <p className="text-lg font-bold">Thread</p>
                                        <Button onClick={onCloseMessage} size={'iconSm'} variant={'ghost'}>
                                                <XIcon className="size-5 stroke-2" />
                                        </Button>
                                </div>
                                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                                        <AlertTriangle className="size-5 text-muted-foreground" />
                                        <p className="text-white text-lg">Message not found</p>
                                </div>
                        </div>
                );
        return (
                <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center h-12 px-4 border-b">
                                <p className="text-lg font-bold">Thread</p>
                                <Button onClick={onCloseMessage} size={'iconSm'} variant={'ghost'}>
                                        <XIcon className="size-5 stroke-2" />
                                </Button>
                        </div>
                        <div>
                                <Message
                                        hideThreadButton
                                        memberId={message.memberId}
                                        senderName={message.user.name}
                                        senderImage={message.user.image}
                                        isSender={message.memberId === currentMember?._id}
                                        body={message.body}
                                        image={message.image}
                                        createdAt={message._creationTime}
                                        updatedAt={message.updatedAt}
                                        id={message._id}
                                        reactions={message.reactions}
                                        isEditing={editingId === message._id}
                                        setEditingId={setEditingId}
                                />
                        </div>
                </div>
        );
};
