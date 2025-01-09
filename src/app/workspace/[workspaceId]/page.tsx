import React from 'react';

interface WorkSpaceIdPageProps {
        params: {
                workspaceId: string;
        };
}
const WorkSpaceIdPage: React.FC<WorkSpaceIdPageProps> = ({ params }) => {
        return <div>WorkSpaceIdPage: {params.workspaceId}</div>;
};

export default WorkSpaceIdPage;
