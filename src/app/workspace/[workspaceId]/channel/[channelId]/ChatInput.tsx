import { useCreateMessage } from '@/features/messages/api/useCreateMessage';
import { useGenerateUploadUrl } from '@/features/upload/api/useGenerateUploadUrl';
import { useChannelId } from '@/hooks/useChannelId';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import dynamic from 'next/dynamic';
import Quill from 'quill';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../../../convex/_generated/dataModel';

interface ChatInputProps {
        placeholder: string;
}

type CreateMessageValue = {
        channelId: Id<'channels'>;
        workspaceId: Id<'workspaces'>;
        body: string;
        image: Id<'_storage'> | undefined;
};
export const ChatInput = ({ placeholder }: ChatInputProps) => {
        const [editorKey, setEditorKey] = useState(0);
        const [isPending, setIsPending] = useState(false);
        const editorRef = useRef<Quill | null>(null);
        const workspaceId = useWorkspaceId();
        const channelId = useChannelId();

        const { mutate: createMessage } = useCreateMessage();
        const { mutate: generateUploadUrl } = useGenerateUploadUrl();

        const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
                try {
                        setIsPending(true);
                        editorRef.current?.enable(false);
                        const values: CreateMessageValue = { workspaceId, channelId, body, image: undefined };

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

                        setEditorKey((prev) => prev + 1);
                } catch (error) {
                        toast.error('Failed to send message');
                } finally {
                        setIsPending(false);
                        editorRef.current?.enable(true);
                }
        };
        return (
                <div className="px-5 w-full">
                        <Editor
                                key={editorKey}
                                placeholder={placeholder}
                                onSubmit={handleSubmit}
                                onCancel={() => {}}
                                disabled={isPending}
                                innerRef={editorRef}
                        />
                </div>
        );
};
