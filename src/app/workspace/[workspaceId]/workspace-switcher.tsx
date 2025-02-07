import { Button } from '@/components/ui/button';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useGetWorkspaces } from '@/features/workspaces/api/useGetWorkspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/useCreateWorkspaceModal';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { Loader, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const WorkspaceSwitcher = () => {
        const router = useRouter();
        const workspaceId = useWorkspaceId();
        const [_open, setOpen] = useCreateWorkspaceModal();
        const { data: workspaces, isLoading: WorkspacesLoading } = useGetWorkspaces();
        const { data: workspace, isLoading: WorkspaceLoading } = useGetWorkspace({ id: workspaceId });

        const filterWorkspaces = workspaces?.filter((workspace) => workspace._id !== workspaceId);
        return (
                <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                                <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/90 text-slate-800 font-semibold text-xl mb-4">
                                        {WorkspaceLoading ? (
                                                <Loader className="animate-spin size-5 shrink-0" />
                                        ) : (
                                                workspace?.name.charAt(0).toUpperCase()
                                        )}
                                </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="start" className="w-64">
                                <DropdownMenuItem
                                        onClick={() => router.push(`/workspace/${workspaceId}`)}
                                        className="cursor-pointer flex-col justify-start text-lg font-semibold items-start capitalize"
                                >
                                        {workspace?.name}
                                        <span className="text-sm text-muted-foreground">Active Workspace</span>
                                </DropdownMenuItem>
                                {filterWorkspaces?.map((workspace) => (
                                        <DropdownMenuItem
                                                key={workspace._id}
                                                onClick={() => router.push(`/workspace/${workspace._id}`)}
                                                className="cursor-pointer capitalize overflow-hidden"
                                        >
                                                <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white rounded-md text-lg font-semibold flex items-center justify-center mr-2">
                                                        {workspace.name.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="truncate">{workspace.name}</p>
                                        </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
                                        <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 rounded-md text-lg font-semibold flex items-center justify-center mr-2">
                                                <PlusIcon />
                                        </div>
                                        Create New Workspace
                                </DropdownMenuItem>
                        </DropdownMenuContent>
                </DropdownMenu>
        );
};
