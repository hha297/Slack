import React, { useMemo } from 'react';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';
import { Hint } from './Hint';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Thumbnail } from './Thumbnail';
import { Toolbar } from './Toolbar';
import { useUpdateMessage } from '@/features/messages/api/useUpdateMessage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useDeleteMessage } from '@/features/messages/api/useDeleteMessage';
import { useConfirm } from '@/hooks/useConfirm';
import { useToggleReaction } from '@/features/reactions/api/useToggleReaction';
import { Reactions } from './Reactions';
import { usePanel } from '@/hooks/usePanel';
import { ThreadBar } from './ThreadBar';
const Renderer = dynamic(() => import('./Renderer'), { ssr: false });
const Editor = dynamic(() => import('./Editor'), { ssr: false });

interface MessageProps {
        id: Id<'messages'>;
        memberId: Id<'members'>;
        senderImage?: string;
        senderName?: string;
        isSender: boolean;
        reactions: Array<Omit<Doc<'reactions'>, 'memberId'> & { count: number; memberIds: Id<'members'>[] }>;
        body: Doc<'messages'>['body'];
        image: string | null | undefined;
        createdAt: Doc<'messages'>['_creationTime'];
        updatedAt: Doc<'messages'>['updatedAt'];
        isEditing: boolean;
        isCompact?: boolean;
        setEditingId: (id: Id<'messages'> | null) => void;
        hideThreadButton?: boolean;
        threadCount?: number;
        threadImage?: string;
        threadName?: string;
        threadTimestamp?: number;
}
const formatFullTime = (date: Date) => {
        return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`;
};
export const Message = ({
        id,
        memberId,
        senderImage,
        senderName,
        isSender,
        reactions,
        body,
        image,
        createdAt,
        updatedAt,
        isEditing,
        isCompact,
        setEditingId,
        hideThreadButton,
        threadCount,
        threadImage,
        threadName,
        threadTimestamp,
}: MessageProps) => {
        const [ConfirmDialog, confirm] = useConfirm(
                'Delete Message',
                'Are you sure you want to delete this message? This action cannot be undone.',
        );

        const { parentMessageId, onOpenProfile, onOpenMessage, onCloseMessage } = usePanel();
        const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
        const { mutate: deleteMessage, isPending: isDeletingMessage } = useDeleteMessage();
        const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction();
        const isPending = isUpdatingMessage || isDeletingMessage || isTogglingReaction;

        const handleReaction = (value: string) => {
                toggleReaction(
                        { messageId: id, value },
                        {
                                onError: () => {
                                        toast.error('Failed to add reaction');
                                },
                        },
                );
        };

        const handleUpdate = ({ body }: { body: string }) => {
                updateMessage(
                        { id, body },
                        {
                                onSuccess: () => {
                                        toast.success('Message updated');
                                        setEditingId(null);
                                },
                                onError: () => {
                                        toast.error('Failed to update message');
                                },
                        },
                );
        };

        const handleDelete = async () => {
                const ok = await confirm();
                if (!ok) return;
                deleteMessage(
                        { id },
                        {
                                onSuccess: () => {
                                        toast.success('Message deleted');

                                        if (parentMessageId === id) {
                                                onCloseMessage();
                                        }
                                },
                                onError: () => {
                                        toast.error('Failed to delete message');
                                },
                        },
                );
        };

        if (isCompact) {
                return (
                        <>
                                <ConfirmDialog />
                                <div
                                        className={cn(
                                                'flex flex-col gap-2 p-2 px-5 hover:bg-gray-100/60 group relative',
                                                isEditing && 'bg-[#F2C74433] hover:bg-[#F2C74433]',
                                                isDeletingMessage &&
                                                        'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
                                        )}
                                >
                                        <div className="flex items-start gap-2">
                                                <Hint label={formatFullTime(new Date(createdAt))}>
                                                        <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-10 leading-6 text-center hover:underline">
                                                                {format(new Date(createdAt), 'HH:mm')}
                                                        </button>
                                                </Hint>
                                                {isEditing ? (
                                                        <div className="w-full h-full">
                                                                <Editor
                                                                        onSubmit={handleUpdate}
                                                                        disabled={isUpdatingMessage}
                                                                        defaultValue={JSON.parse(body)}
                                                                        onCancel={() => setEditingId(null)}
                                                                        variant="update"
                                                                />
                                                        </div>
                                                ) : (
                                                        <div className="flex flex-col w-full">
                                                                <Renderer value={body} />
                                                                <Thumbnail url={image} />
                                                                {updatedAt ? (
                                                                        <span className="text-xs text-muted-foreground">
                                                                                (edited)
                                                                        </span>
                                                                ) : null}
                                                                <Reactions
                                                                        reactions={reactions}
                                                                        onChange={handleReaction}
                                                                />
                                                                <ThreadBar
                                                                        count={threadCount}
                                                                        image={threadImage}
                                                                        name={threadName}
                                                                        timestamp={threadTimestamp}
                                                                        onClick={() => onOpenMessage(id)}
                                                                />
                                                        </div>
                                                )}
                                        </div>
                                        {!isEditing && (
                                                <Toolbar
                                                        isSender={isSender}
                                                        isPending={isPending}
                                                        handleEdit={() => setEditingId(id)}
                                                        handleThread={() => onOpenMessage(id)}
                                                        handleDelete={handleDelete}
                                                        handleReaction={handleReaction}
                                                        hideThreadButton={hideThreadButton}
                                                />
                                        )}
                                </div>
                        </>
                );
        }
        const avatarFallback = senderName!.charAt(0).toUpperCase();
        return (
                <>
                        <ConfirmDialog />
                        <div
                                className={cn(
                                        'flex flex-col gap-2 p-2 px-5 hover:bg-gray-100/60 group relative',
                                        isEditing && 'bg-[#F2C74433] hover:bg-[#F2C74433]',
                                        isDeletingMessage &&
                                                'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
                                )}
                        >
                                <div className="flex items-start gap-2">
                                        <button onClick={() => onOpenProfile(memberId)}>
                                                <Avatar>
                                                        <AvatarImage alt={senderName} src={senderImage} />
                                                        <AvatarFallback className="bg-[#a40547] text-white text-sm">
                                                                {avatarFallback}
                                                        </AvatarFallback>
                                                </Avatar>
                                        </button>
                                        {isEditing ? (
                                                <div className="h-full w-full">
                                                        <Editor
                                                                onSubmit={handleUpdate}
                                                                disabled={isUpdatingMessage}
                                                                defaultValue={JSON.parse(body)}
                                                                onCancel={() => setEditingId(null)}
                                                                variant="update"
                                                        />
                                                </div>
                                        ) : (
                                                <div className="flex flex-col w-full overflow-hidden">
                                                        <div className="text-sm">
                                                                <button
                                                                        className="font-bold text-primary hover:underline"
                                                                        onClick={() => onOpenProfile(memberId)}
                                                                >
                                                                        {senderName}
                                                                </button>
                                                                <span>&nbsp;&nbsp;</span>
                                                                <Hint label={formatFullTime(new Date(createdAt))}>
                                                                        <button className="text-sm text-muted-foreground hover:underline">
                                                                                {format(new Date(createdAt), 'HH:mm')}
                                                                        </button>
                                                                </Hint>
                                                        </div>
                                                        <div className="flex flex-col w-full">
                                                                <Renderer value={body} />
                                                                <Thumbnail url={image} />
                                                                {updatedAt ? (
                                                                        <span className="text-xs text-muted-foreground">
                                                                                (edited)
                                                                        </span>
                                                                ) : null}
                                                                <Reactions
                                                                        reactions={reactions}
                                                                        onChange={handleReaction}
                                                                />
                                                                <ThreadBar
                                                                        count={threadCount}
                                                                        image={threadImage}
                                                                        timestamp={threadTimestamp}
                                                                        name={threadName}
                                                                        onClick={() => onOpenMessage(id)}
                                                                />
                                                        </div>
                                                </div>
                                        )}
                                </div>
                                {!isEditing && (
                                        <Toolbar
                                                isSender={isSender}
                                                isPending={isPending}
                                                handleEdit={() => setEditingId(id)}
                                                handleThread={() => onOpenMessage(id)}
                                                handleDelete={handleDelete}
                                                handleReaction={handleReaction}
                                                hideThreadButton={hideThreadButton}
                                        />
                                )}
                        </div>
                </>
        );
};
