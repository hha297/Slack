'use client';

import { UserButton } from '@/components/UserButton';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/useCreateWorkspaceModal';
import { useGetWorkspaces } from '@/features/workspaces/api/useGetWorkspaces';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
        const router = useRouter();
        const { data, isLoading } = useGetWorkspaces();
        const [open, setOpen] = useCreateWorkspaceModal();

        const workspaceId = useMemo(() => data?.[0]?._id, [data]);

        useEffect(() => {
                if (isLoading) return;

                if (workspaceId) {
                        router.replace(`/workspace/${workspaceId}`);
                } else if (!open) {
                        setOpen(true);
                }
        }, [workspaceId, isLoading, setOpen, open, router]);
        return (
                <div>
                        Logged In
                        <UserButton />
                </div>
        );
}
