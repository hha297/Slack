import { useParentMessageId } from '@/features/messages/store/useParentMessageId';
import React, { useState } from 'react';

export const usePanel = () => {
        const [parentMessageId, setParentMessageId] = useParentMessageId();

        const onOpenMessage = (messageId: string) => {
                setParentMessageId(messageId);
        };

        const onCloseMessage = () => {
                setParentMessageId(null);
        };

        return { parentMessageId, onOpenMessage, onCloseMessage };
};
