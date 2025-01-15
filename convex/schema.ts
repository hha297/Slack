import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@convex-dev/auth/server';
import { v } from 'convex/values';
const schema = defineSchema({
        ...authTables,
        workspaces: defineTable({
                name: v.string(),
                userId: v.id('users'),
                joinCode: v.string(),
        }),
        members: defineTable({
                workspaceId: v.id('workspaces'),
                userId: v.id('users'),
                role: v.union(v.literal('member'), v.literal('admin')),
        })
                .index('by_user_id', ['userId'])
                .index('by_workspace_id', ['workspaceId'])
                .index('by_workspace_id_and_user_id', ['workspaceId', 'userId']),
        channels: defineTable({
                name: v.string(),
                workspaceId: v.id('workspaces'),
        }).index('by_workspace_id', ['workspaceId']),
});

export default schema;
