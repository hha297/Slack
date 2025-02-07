import { Button } from '@/components/ui/button';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc } from '../../../../convex/_generated/dataModel';
import { ChevronDownIcon, ListFilterIcon, Sliders, SquarePenIcon, UserRoundPlusIcon } from 'lucide-react';
import { Hint } from '@/components/Hint';
import { PreferencesModal } from './preferences-modal';
import { useState } from 'react';
import { InviteModal } from './invite-modal';

interface WorkspaceHeaderProps {
        workspace: Doc<'workspaces'>;
        isAdmin: boolean;
}
export const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
        const [preferencesOpen, setPreferencesOpen] = useState(false);
        const [inviteOpen, setInviteOpen] = useState(false);
        return (
                <>
                        <InviteModal
                                open={inviteOpen}
                                setOpen={setInviteOpen}
                                name={workspace.name}
                                joinCode={workspace.joinCode}
                        />
                        <PreferencesModal
                                open={preferencesOpen}
                                setOpen={setPreferencesOpen}
                                initialValue={workspace.name}
                        />
                        <div className="flex items-center justify-between px-4 h-12 gap-1 text-white">
                                <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                                <Button
                                                        variant="transparent"
                                                        className="font-semibold text-white text-lg w-auto p-2 overflow-hidden"
                                                        size="sm"
                                                >
                                                        <span className="truncate">{workspace.name}</span>
                                                        <ChevronDownIcon className="w-4 h-4 ml-1" />
                                                </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="bottom" align="start" className="max-w-96 ">
                                                <DropdownMenuItem className="cursor-pointer capitalize">
                                                        <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
                                                                {workspace.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                                <p className="font-bold text-base">{workspace.name}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Active Workspace
                                                                </p>
                                                        </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />

                                                {isAdmin && (
                                                        <>
                                                                <DropdownMenuItem
                                                                        className="cursor-pointer py-2 "
                                                                        onClick={() => setInviteOpen(true)}
                                                                >
                                                                        <UserRoundPlusIcon />
                                                                        Invite Members To {workspace.name}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                        className="cursor-pointer py-2"
                                                                        onClick={() => setPreferencesOpen(true)}
                                                                >
                                                                        <Sliders />
                                                                        Preferences
                                                                </DropdownMenuItem>
                                                        </>
                                                )}
                                        </DropdownMenuContent>
                                </DropdownMenu>
                                <div className="flex items-center gap-1">
                                        <Hint label="Search" side="bottom">
                                                <Button variant="transparent" size="iconSm">
                                                        <ListFilterIcon className="size-4" />
                                                </Button>
                                        </Hint>
                                        <Hint label="New Message" side="bottom">
                                                <Button variant="transparent" size="iconSm">
                                                        <SquarePenIcon className="size-4" />
                                                </Button>
                                        </Hint>
                                </div>
                        </div>
                </>
        );
};
