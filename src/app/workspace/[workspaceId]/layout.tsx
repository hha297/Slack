'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ToolBar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { WorkspaceSideBar } from './WorkspaceSidebar';

interface WorkspaceLayoutProps {
        children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
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
                                </ResizablePanelGroup>
                        </div>
                </div>
        );
};

export default WorkspaceLayout;
