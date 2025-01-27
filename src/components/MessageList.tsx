import { GetMessagesReturnType } from '@/features/messages/api/useGetMessages';
import { Doc } from '../../convex/_generated/dataModel';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { Message } from './Message';
interface MessageListProps extends React.HTMLAttributes<HTMLDivElement> {
        memberName?: string;
        memberImage?: string;
        channelName?: string;
        channelCreationTime?: number;
        variants?: 'channel' | 'thread' | 'conversation';
        messages: GetMessagesReturnType | undefined;
        loadMore: () => void;
        isLoadingMore: boolean;
        canLoadMore: boolean;
}

const TIME_THRESHOLD = 5;

const formatDateLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'EEEE, MMMM d');
};
export const MessageList = ({
        memberName,
        memberImage,
        channelName,
        channelCreationTime,
        variants,
        messages,
        loadMore,
        isLoadingMore,
        canLoadMore,
}: MessageListProps) => {
        const groupMessages = messages?.reduce(
                (groups, message) => {
                        const date = new Date(message._creationTime);
                        const dateKey = format(date, 'yyyy-MM-dd');
                        if (!groups[dateKey]) {
                                groups[dateKey] = [];
                        }

                        groups[dateKey].unshift(message);
                        return groups;
                },
                {} as Record<string, typeof messages>,
        );
        return (
                <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
                        {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
                                <div key={dateKey}>
                                        <div className="text-center my-2 relative">
                                                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                                                <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                                                        {formatDateLabel(dateKey)}
                                                </span>
                                        </div>
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
                                                                isSender={false}
                                                                reactions={message.reactions}
                                                                body={message.body}
                                                                image={message.image}
                                                                createdAt={message._creationTime}
                                                                updatedAt={message.updatedAt}
                                                                isEditing={false}
                                                                setEditingId={() => {}}
                                                                isCompact={isCompact}
                                                                hideThreadButton={false}
                                                                threadCount={message.threadCount}
                                                                threadImage={message.threadImage}
                                                                threadTimestamp={message.threadTimestamp}
                                                        />
                                                );
                                        })}
                                </div>
                        ))}
                </div>
        );
};
