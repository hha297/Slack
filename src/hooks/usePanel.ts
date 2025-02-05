import { useProfileMemberId } from '@/features/members/store/useProfileMemberId';
import { useParentMessageId } from '@/features/messages/store/useParentMessageId';
import React, { useState } from 'react';

export const usePanel = () => {
        const [parentMessageId, setParentMessageId] = useParentMessageId();
        const [profileMemberId, setProfileMemberId] = useProfileMemberId();

        const onOpenProfile = (memberId: string) => {
                setProfileMemberId(memberId);
                setParentMessageId(null);
        };

        const onOpenMessage = (messageId: string) => {
                setParentMessageId(messageId);
                setProfileMemberId(null);
        };

        const onCloseMessage = () => {
                setParentMessageId(null);
                setProfileMemberId(null);
        };

        return { parentMessageId, profileMemberId, onOpenProfile, onOpenMessage, onCloseMessage };
};
