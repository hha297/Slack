import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { AlertTriangleIcon, Loader } from 'lucide-react';
import { WorkspaceHeader } from './WorkspaceHeader';

export const WorkspaceSideBar = () => {
        const workspaceId = useWorkspaceId();
        const { data: member, isLoading: isMemberLoading } = useCurrentMember({ workspaceId });
        const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({ id: workspaceId });

        if (isMemberLoading || isWorkspaceLoading) {
                return (
                        <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
                                <Loader className="size-5 animate-spin text-white" />
                        </div>
                );
        }
        if (!member || !workspace) {
                return (
                        <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
                                <AlertTriangleIcon className="size-8  text-white" />
                                <p className="text-white text-lg">Workspace not found</p>
                        </div>
                );
        }
        return (
                <div className="flex flex-col bg-[#5E2C5F] h-full">
                        <WorkspaceHeader workspace={workspace} isAdmin={member.role === 'admin'} />
                </div>
        );
};
