import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { AlertTriangleIcon, HashIcon, Loader, MessageSquareTextIcon, SendHorizonalIcon } from 'lucide-react';
import { WorkspaceHeader } from './WorkspaceHeader';
import { SidebarItem } from './SidebarItem';
import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { WorkspaceSection } from './WorkspaceSection';
import { useGetMembers } from '@/features/members/api/useGetMembers';
import { UserItem } from './UserItem';
import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModal';

export const WorkspaceSideBar = () => {
        const workspaceId = useWorkspaceId();
        const [_open, setOpen] = useCreateChannelModal();

        const { data: member, isLoading: isMemberLoading } = useCurrentMember({ workspaceId });
        const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({ id: workspaceId });
        const { data: channels, isLoading: isChannelsLoading } = useGetChannels({ workspaceId });
        const { data: members, isLoading: isMembersLoading } = useGetMembers({ workspaceId });

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
                        <div className="flex flex-col px-2 mt-3">
                                <SidebarItem label="Threads" icon={MessageSquareTextIcon} id="threads" />
                                <SidebarItem label="Drafts & Sent" icon={SendHorizonalIcon} id="drafts" />
                        </div>
                        <WorkspaceSection
                                label="Channels"
                                hint="New channels"
                                onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
                        >
                                {channels?.map((item) => (
                                        <SidebarItem key={item._id} label={item.name} icon={HashIcon} id={item._id} />
                                ))}
                        </WorkspaceSection>
                        <WorkspaceSection label="Direct Messages" hint="New DM" onNew={() => {}}>
                                {members?.map((item) => (
                                        <UserItem
                                                key={item._id}
                                                id={item._id}
                                                label={item.user.name}
                                                image={item.user.image}
                                        />
                                ))}
                        </WorkspaceSection>
                </div>
        );
};
