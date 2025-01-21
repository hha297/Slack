import { Hint } from '@/components/Hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { useToggle } from 'react-use';
interface WorkspaceSectionProps {
        children: React.ReactNode;
        label: string;
        hint: string;
        onNew?: () => void;
}
export const WorkspaceSection = ({ children, label, hint, onNew }: WorkspaceSectionProps) => {
        const [on, toggle] = useToggle(true);
        return (
                <div className="flex flex-col mt-3 px-2">
                        <div className="flex items-center px-4 group mb-2">
                                <Button
                                        variant="transparent"
                                        className="p-1 text-sm text-[#fffbffef] shrink-0 size-6"
                                        onClick={toggle}
                                >
                                        <FaCaretDown
                                                className={cn('size-4 transition-transform', { '-rotate-90': on })}
                                        />
                                </Button>
                                <Button
                                        variant="transparent"
                                        size="sm"
                                        className="group p-2 text-sm text-[#fffbffef] h-7 justify-start overflow-hidden items-center"
                                >
                                        <span className=" text-sm truncate">{label}</span>
                                </Button>
                                {onNew && (
                                        <Hint label={hint} side="top" align="center">
                                                <Button
                                                        onClick={onNew}
                                                        variant={'transparent'}
                                                        size={'iconSm'}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 text-sm text-[#fffbffef] size-6 shrink-0"
                                                >
                                                        <PlusIcon className="size-4 text-white group-hover:scale-125 transition-all" />
                                                </Button>
                                        </Hint>
                                )}
                        </div>
                        {on && children}
                </div>
        );
};
