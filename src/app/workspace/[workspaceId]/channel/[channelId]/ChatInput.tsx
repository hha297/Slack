import dynamic from 'next/dynamic';
import Quill from 'quill';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

import React, { useRef } from 'react';

interface ChatInputProps {
        placeholder: string;
}
export const ChatInput = ({ placeholder }: ChatInputProps) => {
        const editorRef = useRef<Quill | null>(null);
        return (
                <div className="px-5 w-full">
                        <Editor
                                placeholder={placeholder}
                                onSubmit={() => {}}
                                onCancel={() => {}}
                                disabled={false}
                                innerRef={editorRef}
                        />
                </div>
        );
};
