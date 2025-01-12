import { Button } from '@/components/ui/button';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { InfoIcon, SearchIcon } from 'lucide-react';

export const ToolBar = () => {
        const workspaceId = useWorkspaceId();
        const { data } = useGetWorkspace({ id: workspaceId });
        return (
                <nav className="bg-[#481349] flex items-center justify-between h-12 p-2">
                        <div className="flex-1" />
                        <div className="min-w-72 max-w-[640px] grow-[2] shrink">
                                <Button
                                        size="sm"
                                        className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-8 p-2"
                                >
                                        <SearchIcon className="w-4 h-4 mr-1" />
                                        <span className="text-sm text-white/80 my-auto">Search in {data?.name}</span>
                                </Button>
                        </div>

                        <div className="ml-auto flex-1 flex justify-end items-center">
                                <Button variant="transparent">
                                        <InfoIcon className="w-6 h-6 text-white" />
                                </Button>
                        </div>
                </nav>
        );
};
