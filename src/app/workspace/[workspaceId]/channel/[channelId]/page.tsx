'use client';

import { useGetChannel } from '@/features/channels/api/useGetChannel';
import { useChannelId } from '@/hooks/useChannelId';
import { AlertTriangleIcon, Loader } from 'lucide-react';
import React from 'react';
import { Header } from './Header';
import { ChatInput } from './ChatInput';

const ChannelIdPage = () => {
        const channelId = useChannelId();
        const { data: channel, isLoading: isChannelLoading } = useGetChannel({ id: channelId });

        if (isChannelLoading)
                return (
                        <div className="h-full flex-1 flex items-center justify-center">
                                <Loader className="size-6 animate-spin" />
                        </div>
                );
        if (!channel) {
                return (
                        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                                <AlertTriangleIcon className="size-6  text-muted-foreground" />
                                <p className="text-white text-lg">Channel not found</p>
                        </div>
                );
        }

        return (
                <div className="flex flex-col h-full">
                        <Header channelName={channel.name} />
                        <div className="flex-1" />
                        <ChatInput placeholder={`Message #${channel.name}`} />
                </div>
        );
};

export default ChannelIdPage;
