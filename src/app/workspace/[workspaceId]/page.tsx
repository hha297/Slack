'use client';

import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModal';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { AlertTriangleIcon, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useEffect, useMemo } from 'react';

const WorkSpaceIdPage = () => {
        const router = useRouter();
        const workspaceId = useWorkspaceId();
        const [open, setOpen] = useCreateChannelModal();
        const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({ id: workspaceId });
        const { data: channels, isLoading: isChannelsLoading } = useGetChannels({ workspaceId });
        const { data: member, isLoading: isMemberLoading } = useCurrentMember({ workspaceId });
        const channelId = useMemo(() => channels?.[0]?._id, [channels]);
        const isAdmin = useMemo(() => member?.role === 'admin', [member]);

        useEffect(() => {
                if (isWorkspaceLoading || isChannelsLoading || isMemberLoading || !member || !workspace) return;
                if (channelId) {
                        router.push(`/workspace/${workspaceId}/channel/${channelId}`);
                } else if (!open && isAdmin) {
                        setOpen(true);
                }
        }, [
                workspace,
                channelId,
                workspaceId,
                isWorkspaceLoading,
                isChannelsLoading,
                router,
                open,
                setOpen,
                member,
                isAdmin,
                isMemberLoading,
        ]);

        if (isWorkspaceLoading || isChannelsLoading || isMemberLoading) {
                return (
                        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                                <Loader className="animate-spin size-6 text-white" />
                        </div>
                );
        }

        if (!workspace || !member) {
                return (
                        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                                <AlertTriangleIcon className="size-8  text-muted-foreground" />
                                <p className="text-white text-lg">Workspace not found</p>
                        </div>
                );
        }
        return (
                <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                        <AlertTriangleIcon className="size-8  text-muted-foreground" />
                        <p className="text-white text-lg">Channel not found</p>
                </div>
        );
};

export default WorkSpaceIdPage;
