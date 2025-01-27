import React from 'react';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';
import { Hint } from './Hint';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Thumbnail } from './Thumbnail';
const Renderer = dynamic(() => import('./Renderer'), { ssr: false });

interface MessageProps {
        id: Id<'messages'>;
        memberId: Id<'members'>;
        senderImage?: string;
        senderName?: string;
        isSender?: boolean;
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
        threadTimestamp?: number;
}
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
        threadTimestamp,
}: MessageProps) => {
        const formatFullTime = (date: Date) => {
                return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`;
        };
        if (isCompact) {
                return (
                        <div className="flex flex-col gap-2 p-2 px-5 hover:bg-gray-100/60 group relative">
                                <div className="flex items-start gap-2">
                                        <Hint label={formatFullTime(new Date(createdAt))}>
                                                <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-10 leading-6 text-center hover:underline">
                                                        {format(new Date(createdAt), 'HH:mm')}
                                                </button>
                                        </Hint>
                                        <div className="flex flex-col w-full">
                                                <Renderer value={body} />
                                                <Thumbnail url={image} />
                                                {updatedAt ? (
                                                        <span className="text-xs text-muted-foreground">(edited)</span>
                                                ) : null}
                                        </div>
                                </div>
                        </div>
                );
        }
        const avatarFallback = senderName!.charAt(0).toUpperCase();
        return (
                <div className="flex flex-col gap-2 p-2 px-5 hover:bg-gray-100/60 group relative">
                        <div className="flex items-start gap-2">
                                <button>
                                        <Avatar>
                                                <AvatarImage alt={senderName} src={senderImage} />
                                                <AvatarFallback className="bg-[#a40547] text-white text-sm">
                                                        {avatarFallback}
                                                </AvatarFallback>
                                        </Avatar>
                                </button>
                                <div className="flex flex-col w-full overflow-hidden">
                                        <div className="text-sm">
                                                <button
                                                        className="font-bold text-primary hover:underline"
                                                        onClick={() => {}}
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
                                        <Renderer value={body} />
                                        <Thumbnail url={image} />
                                        {updatedAt ? (
                                                <span className="text-xs text-muted-foreground">(edited)</span>
                                        ) : null}
                                </div>
                        </div>
                </div>
        );
};
