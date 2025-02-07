import { Button } from '@/components/ui/button';
import {
        Command,
        CommandDialog,
        CommandEmpty,
        CommandGroup,
        CommandInput,
        CommandItem,
        CommandList,
        CommandSeparator,
} from '@/components/ui/command';
import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { useGetMembers } from '@/features/members/api/useGetMembers';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { InfoIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ToolBar = () => {
        const workspaceId = useWorkspaceId();
        const router = useRouter();
        const { data } = useGetWorkspace({ id: workspaceId });
        const { data: channels, isLoading: isChannelsLoading } = useGetChannels({ workspaceId });
        const { data: members, isLoading: isMembersLoading } = useGetMembers({ workspaceId });
        const [open, setOpen] = useState(false);
        const onChannelClick = (channelId: string) => {
                setOpen(false);
                router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        };
        const onMemberClick = (memberId: string) => {
                setOpen(false);
                router.push(`/workspace/${workspaceId}/member/${memberId}`);
        };
        return (
                <nav className="bg-[#481349] flex items-center justify-between h-12 p-2">
                        <div className="flex-1" />
                        <div className="min-w-72 max-w-[640px] grow-[2] shrink">
                                <Button
                                        onClick={() => setOpen(true)}
                                        size="sm"
                                        className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-8 p-2"
                                >
                                        <SearchIcon className="w-4 h-4 mr-1" />
                                        <span className="text-sm text-white/80 my-auto">Search in {data?.name}</span>
                                </Button>
                                <CommandDialog open={open} onOpenChange={setOpen}>
                                        <CommandInput placeholder="Type a command or search..." />
                                        <CommandList>
                                                <CommandEmpty>No results found.</CommandEmpty>
                                                <CommandGroup heading="Channels">
                                                        {channels?.map((channel) => (
                                                                <CommandItem
                                                                        key={channel._id}
                                                                        onSelect={() => onChannelClick(channel._id)}
                                                                >
                                                                        {channel.name}
                                                                </CommandItem>
                                                        ))}
                                                </CommandGroup>
                                                <CommandGroup heading="Members">
                                                        {members?.map((member) => (
                                                                <CommandItem
                                                                        key={member._id}
                                                                        onSelect={() => onMemberClick(member._id)}
                                                                >
                                                                        {member.user.name}
                                                                </CommandItem>
                                                        ))}
                                                </CommandGroup>
                                        </CommandList>
                                </CommandDialog>
                        </div>

                        <div className="ml-auto flex-1 flex justify-end items-center">
                                <Button variant="transparent">
                                        <InfoIcon className="w-6 h-6 text-white" />
                                </Button>
                        </div>
                </nav>
        );
};
