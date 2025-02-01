'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ToolBar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { WorkspaceSideBar } from './WorkspaceSidebar';
import { usePanel } from '@/hooks/usePanel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import { Thread } from '@/features/messages/components/Thread';

interface WorkspaceLayoutProps {
        children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
        const { parentMessageId, onCloseMessage } = usePanel();

        const showPanel = !!parentMessageId;
        return (
                <div className="h-full ">
                        <ToolBar />
                        <div className="flex h-[calc(100vh-48px)]">
                                <Sidebar />
                                <ResizablePanelGroup direction="horizontal" autoSaveId="hadh-layout">
                                        <ResizablePanel defaultSize={20} minSize={20} className="bg-[#5E2C5F]">
                                                <WorkspaceSideBar />
                                        </ResizablePanel>
                                        <ResizableHandle withHandle />
                                        <ResizablePanel defaultSize={20} minSize={20}>
                                                {children}
                                        </ResizablePanel>
                                        {showPanel && (
                                                <>
                                                        <ResizableHandle withHandle />
                                                        <ResizablePanel defaultSize={20} minSize={20}>
                                                                {parentMessageId ? (
                                                                        <Thread
                                                                                messageId={
                                                                                        parentMessageId as Id<'messages'>
                                                                                }
                                                                                onCloseMessage={onCloseMessage}
                                                                        />
                                                                ) : (
                                                                        <div className="flex h-full items-center justify-center">
                                                                                <Loader className="size-5 animate-spin text-muted-foreground" />
                                                                        </div>
                                                                )}
                                                        </ResizablePanel>
                                                </>
                                        )}
                                </ResizablePanelGroup>
                        </div>
                </div>
        );
};

export default WorkspaceLayout;
