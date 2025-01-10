'use client';

import { ToolBar } from './toolbar';

interface WorkspaceLayoutProps {
        children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
        return (
                <div className="h-full ">
                        <ToolBar />
                        {children}
                </div>
        );
};

export default WorkspaceLayout;
