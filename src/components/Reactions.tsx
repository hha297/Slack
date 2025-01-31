import React from 'react';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { cn } from '@/lib/utils';
import { Hint } from './Hint';
import { EmojiPopover } from './EmojiPopover';
import { MdOutlineAddReaction } from 'react-icons/md';

interface ReactionsProps {
        reactions: Array<Omit<Doc<'reactions'>, 'memberId'> & { count: number; memberIds: Id<'members'>[] }>;
        onChange: (value: string) => void;
}

export const Reactions = ({ reactions, onChange }: ReactionsProps) => {
        const workspaceId = useWorkspaceId();
        const { data: currentMember } = useCurrentMember({ workspaceId });
        const currentMemberId = currentMember?._id;

        if (reactions.length === 0 || !currentMemberId) return null;
        return (
                <div className="flex items-center gap-1 mt-1 mb-1 ">
                        {reactions.map((reaction) => {
                                return (
                                        <Hint
                                                key={reaction.value}
                                                label={`${reaction.count} people reacted with ${reaction.value}`}
                                        >
                                                <button
                                                        className={cn(
                                                                'h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center  gap-x-1',
                                                                reaction.memberIds.includes(currentMemberId) &&
                                                                        'bg-blue-100/70 border border-blue-500 text-white',
                                                        )}
                                                        onClick={() => onChange(reaction.value)}
                                                >
                                                        <div className="text-sm flex items-center justify-center">
                                                                {reaction.value}
                                                        </div>
                                                        <span
                                                                className={cn(
                                                                        'text-sm font-bold text-muted-foreground',
                                                                        reaction.memberIds.includes(currentMemberId) &&
                                                                                'text-blue-500',
                                                                )}
                                                        >
                                                                {reaction.count}
                                                        </span>
                                                </button>
                                        </Hint>
                                );
                        })}
                        <EmojiPopover hint="Add Reaction" onEmojiSelect={(emoji) => onChange(emoji.native)}>
                                <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1">
                                        <MdOutlineAddReaction className="size-4" />
                                </button>
                        </EmojiPopover>
                </div>
        );
};
