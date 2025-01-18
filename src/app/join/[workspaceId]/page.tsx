'use client';

import { Button } from '@/components/ui/button';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/useGetWorkspaceInfo';
import { useJoin } from '@/features/workspaces/api/useJoin';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';
const JoinPage = () => {
        const router = useRouter();
        const workspaceId = useWorkspaceId();

        const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
        const { mutate, isPending } = useJoin();

        const isMember = useMemo(() => {
                return data?.isMember || false;
        }, [data?.isMember]);

        useEffect(() => {
                if (isMember) {
                        router.push(`/workspace/${workspaceId}`);
                }
        }, [isMember, workspaceId, router]);

        const handleComplete = (value: string) => {
                mutate(
                        { id: workspaceId, joinCode: value },
                        {
                                onSuccess: (id) => {
                                        router.replace(`/workspace/${id}`);
                                        toast.success('Joined workspace successfully');
                                },
                                onError: () => {
                                        toast.error('Failed to join workspace');
                                },
                        },
                );
        };
        if (isLoading) {
                return (
                        <div className="h-full flex 8 items-center justify-center ">
                                <Loader className="animate-spin size-6 text-muted-foreground" />
                        </div>
                );
        }
        return (
                <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-sm">
                        <Image src="/logo.svg" alt="Logo" width={60} height={60} />
                        <div className="flex flex-col gap-y-4 items-center justify-center max-w-lg">
                                <div className="flex flex-col gap-y-2 items-center justify-center">
                                        <h1 className="text-2xl font-bold ">Join {data?.name}</h1>
                                        <p className="text-md text-muted-foreground">
                                                Use the workspace code to join and start collaborating with your team.
                                        </p>
                                </div>
                                <VerificationInput
                                        onComplete={handleComplete}
                                        classNames={{
                                                container: cn(
                                                        'flex gap-x-2',
                                                        isPending && 'opacity-50 cursor-not-allowed',
                                                ),
                                                character: 'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-xl font-medium text-gray-500 ',
                                                characterInactive: 'bg-muted',
                                                characterSelected: 'bg-white text-black',
                                                characterFilled: 'bg-white text-black',
                                        }}
                                        autoFocus
                                        length={6}
                                />
                        </div>
                        <div className="flex gap-x-4">
                                <Button size="lg" asChild>
                                        <Link href="/">Back to Home</Link>
                                </Button>
                        </div>
                </div>
        );
};

export default JoinPage;
