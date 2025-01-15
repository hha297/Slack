import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { IconType } from 'react-icons/lib';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sidebarItemVariants = cva('flex items-center gap-2 justify-start font-normal h-12 px-5 text-sm overflow-hidden', {
        variants: {
                variant: {
                        default: 'text-[#fffbffef]',
                        active: 'text-[#481349] bg-white/90 hover:bg-white/80',
                },
                defaultVariants: {
                        variant: 'default',
                },
        },
});
interface SidebarItemProps {
        label: string;
        icon: LucideIcon | IconType;
        id: string;
        variant?: VariantProps<typeof sidebarItemVariants>['variant'];
}

export const SidebarItem = ({ label, icon: Icon, id, variant }: SidebarItemProps) => {
        const workspaceId = useWorkspaceId();
        return (
                <Button
                        variant="transparent"
                        size="sm"
                        asChild
                        className={cn(sidebarItemVariants({ variant: variant || 'default' }))}
                >
                        <Link href={`/workspace/${workspaceId}/channel/${id}`}>
                                <Icon className="size-4 mr-1 shrink-0" />
                                <span className="text-sm truncate">{label}</span>
                        </Link>
                </Button>
        );
};
