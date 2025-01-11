'use client';

import { Sidebar } from './sidebar';
import { ToolBar } from './toolbar';

interface WorkspaceLayoutProps {
        children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
        return (
                <div className="h-full ">
                        <ToolBar />
                        <div className="flex h-[calc(100vh-48px)]">
                                <Sidebar />
                                {children}
                        </div>
                </div>
        );
};

export default WorkspaceLayout;
