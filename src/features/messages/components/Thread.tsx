import { Button } from '@/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';
import { AlertTriangle, Loader, XIcon } from 'lucide-react';
import { useGetMessage } from '../api/useGetMessage';
import { Message } from '@/components/Message';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useCreateMessage } from '../api/useCreateMessage';
import { useGenerateUploadUrl } from '@/features/upload/api/useGenerateUploadUrl';
import { useChannelId } from '@/hooks/useChannelId';
import { toast } from 'sonner';
import { useGetMessages } from '../api/useGetMessages';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { useMemberId } from '@/hooks/useMemberId';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });
const TIME_THRESHOLD = 5;
interface ThreadProps {
        messageId: Id<'messages'>;
        onCloseMessage: () => void;
}

const formatDateLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'EEEE, MMMM d');
};

type CreateMessageValue = {
        channelId: Id<'channels'>;
        workspaceId: Id<'workspaces'>;
        parentMessageId: Id<'messages'>;
        body: string;
        image?: Id<'_storage'> | undefined;
};

export const Thread = ({ messageId, onCloseMessage }: ThreadProps) => {
        const workspaceId = useWorkspaceId();
        const channelId = useChannelId();

        const [editorKey, setEditorKey] = useState(0);
        const [isPending, setIsPending] = useState(false);
        const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
        const editorRef = useRef<Quill | null>(null);

        const { mutate: createMessage } = useCreateMessage();
        const { mutate: generateUploadUrl } = useGenerateUploadUrl();

        const { data: currentMember } = useCurrentMember({ workspaceId });
        const { data: message, isLoading: isMessageLoading } = useGetMessage({ id: messageId });
        const { results, status, loadMore } = useGetMessages({
                channelId,
                conversationId: message?.conversationId,
                parentMessageId: messageId,
        });

        const canLoadMore = status === 'CanLoadMore';
        const isLoadingMore = status === 'LoadingMore';

        const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
                try {
                        setIsPending(true);
                        editorRef.current?.enable(false);
                        const values: CreateMessageValue = {
                                workspaceId,
                                channelId,
                                parentMessageId: messageId,
                                body,
                                image: undefined,
                        };

                        if (image) {
                                const uploadUrl = await generateUploadUrl({}, { throwError: true });
                                if (!uploadUrl) {
                                        throw new Error('Failed to generate upload url');
                                }
                                const result = await fetch(uploadUrl, {
                                        method: 'POST',
                                        headers: { 'Content-Type': image.type },
                                        body: image,
                                });
                                if (!result.ok) throw new Error('Failed to upload image');

                                const { storageId } = await result.json();
                                values.image = storageId;
                        }
                        await createMessage(values, { throwError: true });
                        //After fixing the bug, this line can be removed
                        toast.success('Message sent');

                        setEditorKey((prev) => prev + 1);
                } catch (error) {
                        toast.error('Failed to send message');
                } finally {
                        setIsPending(false);
                        editorRef.current?.enable(true);
                }
        };

        const groupMessages = results?.reduce(
                (groups, message) => {
                        const date = new Date(message._creationTime);
                        const dateKey = format(date, 'yyyy-MM-dd');
                        if (!groups[dateKey]) {
                                groups[dateKey] = [];
                        }

                        groups[dateKey].unshift(message);
                        return groups;
                },
                {} as Record<string, typeof results>,
        );

        if (isMessageLoading || status === 'LoadingFirstPage') {
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
                        <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
                                {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
                                        <div key={dateKey}>
                                                <div className="text-center my-2 relative">
                                                        <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                                                        <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                                                                {formatDateLabel(dateKey)}
                                                        </span>
                                                </div>
                                                {/* TODO: Fix message list below not rendering when are in conversation thread */}
                                                {messages.map((message, index) => {
                                                        const prevMessage = messages[index - 1];

                                                        const isCompact =
                                                                prevMessage &&
                                                                prevMessage.user?._id === message.user?._id &&
                                                                differenceInMinutes(
                                                                        new Date(message._creationTime),
                                                                        new Date(prevMessage._creationTime),
                                                                ) < TIME_THRESHOLD;

                                                        return (
                                                                <Message
                                                                        key={message._id}
                                                                        id={message._id}
                                                                        memberId={message.memberId}
                                                                        senderImage={message.user.image}
                                                                        senderName={message.user.name}
                                                                        isSender={
                                                                                message.memberId === currentMember?._id
                                                                        }
                                                                        reactions={message.reactions}
                                                                        body={message.body}
                                                                        image={message.image}
                                                                        createdAt={message._creationTime}
                                                                        updatedAt={message.updatedAt}
                                                                        isEditing={editingId === message._id}
                                                                        setEditingId={setEditingId}
                                                                        isCompact={isCompact}
                                                                        hideThreadButton
                                                                        threadCount={message.threadCount}
                                                                        threadImage={message.threadImage}
                                                                        threadName={message.threadName}
                                                                        threadTimestamp={message.threadTimestamp}
                                                                />
                                                        );
                                                })}
                                        </div>
                                ))}
                                <div
                                        className="h-1"
                                        ref={(element) => {
                                                if (element) {
                                                        const observer = new IntersectionObserver(
                                                                ([entry]) => {
                                                                        if (entry.isIntersecting && canLoadMore) {
                                                                                loadMore();
                                                                        }
                                                                },
                                                                { threshold: 1 },
                                                        );
                                                        observer.observe(element);
                                                        return () => {
                                                                observer.disconnect();
                                                        };
                                                }
                                        }}
                                />
                                {isLoadingMore && (
                                        <div className="text-center my-2 relative">
                                                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                                                <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                                                        <Loader className="size-4 animate-spin" />
                                                </span>
                                        </div>
                                )}
                                <Message
                                        id={message._id}
                                        memberId={message.memberId}
                                        senderImage={message.user.image}
                                        senderName={message.user.name}
                                        isSender={message.memberId === currentMember?._id}
                                        reactions={message.reactions}
                                        body={message.body}
                                        image={message.image}
                                        createdAt={message._creationTime}
                                        updatedAt={message.updatedAt}
                                        isEditing={editingId === message._id}
                                        setEditingId={setEditingId}
                                        hideThreadButton
                                />
                        </div>
                        <div className="px-4">
                                <Editor
                                        key={editorKey}
                                        onSubmit={handleSubmit}
                                        innerRef={editorRef}
                                        disabled={isPending}
                                        placeholder="Write a reply"
                                />
                        </div>
                </div>
        );
};
