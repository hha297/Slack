import React from 'react';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useMemberId } from '@/hooks/useMemberId';
import { useGetMember } from '@/features/members/api/useGetMember';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { Loader } from 'lucide-react';
import { Header } from './Header';
import { ChatInput } from './ChatInput';
import { MessageList } from '@/components/MessageList';
import { usePanel } from '@/hooks/usePanel';

interface ConversationProps {
        id: Id<'conversations'>;
}
export const Conversation = ({ id }: ConversationProps) => {
        const memberId = useMemberId();
        const { onOpenProfile } = usePanel();
        const { data: member, isLoading: isMemberLoading } = useGetMember({ id: memberId });
        const { results, status, loadMore } = useGetMessages({ conversationId: id });

        if (isMemberLoading || status === 'LoadingFirstPage') {
                return (
                        <div className="h-full flex 8 items-center justify-center ">
                                <Loader className="animate-spin size-6 text-muted-foreground" />
                        </div>
                );
        }
        return (
                <div className="flex flex-col h-full">
                        <Header
                                memberName={member?.user.name}
                                memberImage={member?.user.image}
                                onClick={() => onOpenProfile(memberId)}
                        />
                        <MessageList
                                messages={results}
                                variants="conversation"
                                memberName={member?.user.name}
                                memberImage={member?.user.image}
                                loadMore={loadMore}
                                isLoadingMore={status === 'LoadingMore'}
                                canLoadMore={status === 'CanLoadMore'}
                        />
                        <ChatInput placeholder={`Message @${member?.user.name}`} conversationId={id} />
                </div>
        );
};
