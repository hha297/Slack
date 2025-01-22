import React, { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill, { QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import { PiTextAa } from 'react-icons/pi';
import { MdSend } from 'react-icons/md';
import 'quill/dist/quill.snow.css';
import { Button } from './ui/button';
import { ImageIcon, SmileIcon, XIcon } from 'lucide-react';
import { Hint } from './Hint';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { EmojiPopover } from './EmojiPopover';
import Image from 'next/image';

type EditorValue = {
        image: File | null;
        body: string;
};
interface EditorProps {
        variant?: 'create' | 'update';
        onSubmit: ({ image, body }: EditorValue) => void;
        onCancel?: () => void;
        placeholder?: string;
        disabled?: boolean;
        innerRef?: MutableRefObject<Quill | null>;
        defaultValue?: Delta | Op[];
}
const Editor = ({
        variant = 'create',
        onSubmit,
        onCancel,
        placeholder = 'Write something...',
        defaultValue,
        disabled,
        innerRef,
}: EditorProps) => {
        const [text, setText] = useState('');
        const [image, setImage] = useState<File | null>(null);
        const [isToolbarVisible, setIsToolbarVisible] = useState(true);

        const containerRef = useRef<HTMLDivElement>(null);
        const submitRef = useRef(onSubmit);
        const placeholderRef = useRef(placeholder);
        const quillRef = useRef<Quill | null>(null);
        const defaultValueRef = useRef(defaultValue);
        const disabledRef = useRef(disabled);
        const imageRef = useRef<HTMLInputElement | null>(null);

        useLayoutEffect(() => {
                submitRef.current = onSubmit;
                placeholderRef.current = placeholder;
                defaultValueRef.current = defaultValue;
                disabledRef.current = disabled;
        });

        useEffect(() => {
                if (!containerRef.current) return;
                const container = containerRef.current;
                const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

                const option: QuillOptions = {
                        theme: 'snow',
                        placeholder: placeholderRef.current,
                        modules: {
                                toolbar: [
                                        ['bold', 'italic', 'underline', 'strike'],
                                        ['blockquote', 'code-block'],
                                        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
                                ],
                                keyboard: {
                                        bindings: {
                                                enter: {
                                                        key: 'Enter',
                                                        handler: () => {
                                                                //TODO: Submit

                                                                return;
                                                        },
                                                },
                                                shift_enter: {
                                                        key: 'Enter',
                                                        shiftKey: true,
                                                        handler: () => {
                                                                quill.insertText(
                                                                        quill.getSelection()?.index || 0,
                                                                        '\n',
                                                                );
                                                        },
                                                },
                                        },
                                },
                        },
                };

                const quill = new Quill(editorContainer, option);
                quillRef.current = quill;
                quillRef.current.focus();

                if (innerRef) {
                        innerRef.current = quill;
                }

                if (defaultValueRef.current) {
                        quill.setContents(defaultValueRef.current);
                }
                setText(quill.getText());
                quill.on(Quill.events.TEXT_CHANGE, () => {
                        setText(quill.getText());
                });

                return () => {
                        quill.off(Quill.events.TEXT_CHANGE);
                        if (container) {
                                container.innerHTML = '';
                        }
                        if (quillRef.current) {
                                quillRef.current = null;
                        }
                        if (innerRef) {
                                innerRef.current = null;
                        }
                };
        }, [innerRef]);
        const toggleToolbar = () => {
                setIsToolbarVisible((current) => !current);
                const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

                if (toolbarElement) {
                        toolbarElement.classList.toggle('hidden');
                }
        };

        const onEmojiSelect = (emoji: any) => {
                const quill = quillRef.current;

                quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
        };

        const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

        return (
                <div className="flex flex-col">
                        <input
                                type="file"
                                accept="image/*"
                                ref={imageRef}
                                className="hidden"
                                onChange={(e) => setImage(e.target.files![0])}
                        />
                        <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
                                <div ref={containerRef} className="h-full  ql-custom" />
                                {!!image && (
                                        <div className="p-2">
                                                <div className="relative size-20 flex items-center justify-center group/image">
                                                        <Hint label="Remove image">
                                                                <button
                                                                        onClick={() => {
                                                                                setImage(null);
                                                                                imageRef.current!.value = '';
                                                                        }}
                                                                        className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                                                                >
                                                                        <XIcon className="size-4" />
                                                                </button>
                                                        </Hint>
                                                        <Image
                                                                src={URL.createObjectURL(image)}
                                                                alt="Uploaded"
                                                                fill
                                                                className="rounded-xl overflow-hidden border object-cover"
                                                        />
                                                </div>
                                        </div>
                                )}
                                <div className="flex px-2 pb-2 z-[5]">
                                        <Hint label={isToolbarVisible ? 'Hide formats' : 'Show formats'}>
                                                <Button
                                                        disabled={disabled}
                                                        size="iconSm"
                                                        variant="ghost"
                                                        onClick={toggleToolbar}
                                                >
                                                        <PiTextAa className="size-4" />
                                                </Button>
                                        </Hint>
                                        <EmojiPopover onEmojiSelect={onEmojiSelect}>
                                                <Button disabled={disabled} size="iconSm" variant="ghost">
                                                        <SmileIcon className="size-4" />
                                                </Button>
                                        </EmojiPopover>
                                        {variant === 'create' && (
                                                <Hint label="Image">
                                                        <Button
                                                                disabled={disabled}
                                                                size="iconSm"
                                                                variant="ghost"
                                                                onClick={() => imageRef.current?.click()}
                                                        >
                                                                <ImageIcon className="size-4" />
                                                        </Button>
                                                </Hint>
                                        )}
                                        {variant === 'update' && (
                                                <div className="ml-auto flex items-center gap-x-2">
                                                        <Button
                                                                disabled={disabled || isEmpty}
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {}}
                                                        >
                                                                Cancel
                                                        </Button>
                                                        <Button
                                                                disabled={disabled}
                                                                size="sm"
                                                                onClick={() => {}}
                                                                className="bg-[#007A5A] hover-:bg-[#007A5A]/80 text-white"
                                                        >
                                                                Save
                                                        </Button>
                                                </div>
                                        )}
                                        {variant === 'create' && (
                                                <Hint label="Send">
                                                        <Button
                                                                disabled={disabled || isEmpty}
                                                                size="iconSm"
                                                                onClick={() => {}}
                                                                className={cn(
                                                                        'ml-auto',
                                                                        isEmpty
                                                                                ? 'bg-white text-muted-foreground cursor-not-allowed'
                                                                                : 'bg-[#007A5A] hover-:bg-[#007A5A]/80 text-white',
                                                                )}
                                                        >
                                                                <MdSend className="size-4" />
                                                        </Button>
                                                </Hint>
                                        )}
                                </div>
                        </div>
                        {variant === 'create' && (
                                <div
                                        className={cn(
                                                'p-2 text-xs text-muted-foreground flex justify-end opacity-0 transition',
                                                !isEmpty && 'opacity-100',
                                        )}
                                >
                                        <p>
                                                <strong>Shift + Enter</strong> to add a new line
                                        </p>
                                </div>
                        )}
                </div>
        );
};

export default Editor;
