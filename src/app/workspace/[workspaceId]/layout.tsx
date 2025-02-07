'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import { WorkspaceSideBar } from './WorkspaceSidebar';
import { usePanel } from '@/hooks/usePanel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import { Thread } from '@/features/messages/components/Thread';
import { Profile } from '@/features/members/components/Profile';
import { Toolbar } from './toolbar';
import { Sidebar } from './sidebar';

interface WorkspaceLayoutProps {
        children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
        const { parentMessageId, profileMemberId, onCloseMessage } = usePanel();

        const showPanel = !!parentMessageId || !!profileMemberId;
        return (
                <div className="h-full ">
                        <Toolbar />
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
                                                                ) : profileMemberId ? (
                                                                        <Profile
                                                                                memberId={
                                                                                        profileMemberId as Id<'members'>
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
