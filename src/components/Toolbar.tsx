import React from 'react';
import { Button } from './ui/button';
import { MessageSquareTextIcon, PencilIcon, SmileIcon, TrashIcon } from 'lucide-react';
import { Hint } from './Hint';
import { EmojiPopover } from './EmojiPopover';

interface ToolbarProps {
        isSender: boolean;
        isPending: boolean;
        handleEdit: () => void;
        handleThread: () => void;
        handleDelete: () => void;
        handleReaction: (value: string) => void;
        hideThreadButton?: boolean;
}
export const Toolbar = ({
        isSender,
        isPending,
        handleEdit,
        handleThread,
        handleDelete,
        handleReaction,
        hideThreadButton,
}: ToolbarProps) => {
        return (
                <div className="absolute top-0 right-5">
                        <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
                                <EmojiPopover
                                        hint="Add Reaction"
                                        onEmojiSelect={(emoji) => handleReaction(emoji.native)}
                                >
                                        <Button variant={'ghost'} size={'iconSm'} disabled={isPending}>
                                                <SmileIcon className="size-4" />
                                        </Button>
                                </EmojiPopover>
                                {!hideThreadButton && (
                                        <Hint label="Reply in Thread">
                                                <Button
                                                        variant={'ghost'}
                                                        size={'iconSm'}
                                                        onClick={handleThread}
                                                        disabled={isPending}
                                                >
                                                        <MessageSquareTextIcon className="size-4" />
                                                </Button>
                                        </Hint>
                                )}
                                {isSender && (
                                        <Hint label="Edit Message">
                                                <Button
                                                        variant={'ghost'}
                                                        size={'iconSm'}
                                                        onClick={handleEdit}
                                                        disabled={isPending}
                                                >
                                                        <PencilIcon className="size-4" />
                                                </Button>
                                        </Hint>
                                )}
                                {isSender && (
                                        <Hint label="Delete Message">
                                                <Button
                                                        variant={'ghost'}
                                                        size={'iconSm'}
                                                        onClick={handleDelete}
                                                        disabled={isPending}
                                                >
                                                        <TrashIcon className="size-4" />
                                                </Button>
                                        </Hint>
                                )}
                        </div>
                </div>
        );
};
