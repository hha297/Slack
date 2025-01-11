import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

interface SidebarButtonProps {
        icon: LucideIcon | IconType;
        label: string;
        isActive?: boolean;
}

const SidebarButton = ({ icon: Icon, label, isActive = false }: SidebarButtonProps) => {
        return (
                <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
                        <Button
                                variant="transparent"
                                className={cn(`size-9 p-2 group-hover:bg-accent/25 ${isActive && 'bg-accent/25'}`)}
                        >
                                <Icon className="size-5 text-white group-hover:scale-125 transition-all" />
                        </Button>
                        <span className="text-sm text-white group-hover:text-accent">{label}</span>
                </div>
        );
};

export default SidebarButton;
