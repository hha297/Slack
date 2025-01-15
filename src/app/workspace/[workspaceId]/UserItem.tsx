import { Button } from '@/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const userItemVariants = cva('flex items-center gap-2 justify-start font-normal h-12 px-5 text-sm overflow-hidden', {
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
interface UserItemProps {
        id: Id<'members'>;
        label?: string;
        image?: string;
        variant?: VariantProps<typeof userItemVariants>['variant'];
}
export const UserItem = ({ id, label = 'Member', image, variant }: UserItemProps) => {
        const workspaceId = useWorkspaceId();
        const avatarFallback = label.charAt(0).toUpperCase();
        return (
                <Button
                        variant="transparent"
                        className={cn(userItemVariants({ variant: variant || 'default' }))}
                        size={'sm'}
                        asChild
                >
                        <Link href={`/workspace/${workspaceId}/member/${id}`}>
                                <Avatar className="size-5 rounded-md mr-1">
                                        <AvatarImage alt={label} src={image} className="rounded-md" />
                                        <AvatarFallback className="rounded-md bg-[#a40547] text-white text-xl font-bold">
                                                {avatarFallback}
                                        </AvatarFallback>
                                </Avatar>
                                <span className="text-sm truncate">{label}</span>
                        </Link>
                </Button>
        );
};
