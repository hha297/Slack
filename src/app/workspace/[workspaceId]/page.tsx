'use client';

import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useParams } from 'next/navigation';

const WorkSpaceIdPage = () => {
        const workspaceId = useWorkspaceId();
        const { data } = useGetWorkspace({ id: workspaceId });

        return <div>WorkSpaceIdPage: {JSON.stringify(data)}</div>;
};

export default WorkSpaceIdPage;
