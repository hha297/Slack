'use client';
import { useCreateOrGetConversation } from '@/features/conversations/api/useCreateOrGetConversation';
import { useMemberId } from '@/hooks/useMemberId';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { AlertTriangleIcon, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { Conversation } from './Conversation';

const MemberIdPage = () => {
        const workspaceId = useWorkspaceId();
        const memberId = useMemberId();
        const [conversationId, setConversationId] = useState<Id<'conversations'> | null>(null);
        const { mutate, isPending } = useCreateOrGetConversation();
        useEffect(() => {
                mutate(
                        { workspaceId, memberId },
                        {
                                onSuccess: (data) => {
                                        setConversationId(data);
                                },
                                onError: (error) => {
                                        toast.error('Failed to get conversation');
                                },
                        },
                );
        }, [mutate, workspaceId, memberId]);

        if (isPending) {
                return (
                        <div className="h-full flex 8 items-center justify-center ">
                                <Loader className="animate-spin size-6 text-muted-foreground" />
                        </div>
                );
        }

        if (!conversationId) {
                return (
                        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                                <AlertTriangleIcon className="size-6 text-muted-foreground" />
                                <p className="text-white text-lg">Conversation not found</p>
                        </div>
                );
        }
        return <Conversation id={conversationId} />;
};

export default MemberIdPage;
