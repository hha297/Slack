import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { auth } from './auth';

export const create = mutation({
        args: {
                workspaceId: v.id('workspaces'),
                name: v.string(),
        },
        handler: async (ctx, args) => {
                const userId = await auth.getUserId(ctx);
                if (!userId) {
                        throw new Error('Unauthorized');
                }

                const member = await ctx.db
                        .query('members')
                        .withIndex('by_workspace_id_and_user_id', (q) =>
                                q.eq('workspaceId', args.workspaceId).eq('userId', userId),
                        )
                        .unique();

                if (!member || member.role !== 'admin') {
                        throw new Error('Unauthorized');
                }

                const parsedName = args.name.toLowerCase().replace(/\s+/g, '-');
                const channel = await ctx.db.insert('channels', {
                        workspaceId: args.workspaceId,
                        name: parsedName,
                });
                return channel;
        },
});

export const update = mutation({
        args: {
                id: v.id('channels'),

                name: v.string(),
        },
        handler: async (ctx, args) => {
                const userId = await auth.getUserId(ctx);
                if (!userId) {
                        throw new Error('Unauthorized');
                }
                const channel = await ctx.db.get(args.id);
                if (!channel) {
                        throw new Error('Channel not found');
                }
                const member = await ctx.db
                        .query('members')
                        .withIndex('by_workspace_id_and_user_id', (q) =>
                                q.eq('workspaceId', channel.workspaceId).eq('userId', userId),
                        )
                        .unique();

                if (!member || member.role !== 'admin') {
                        throw new Error('Unauthorized');
                }

                const parsedName = args.name.toLowerCase().replace(/\s+/g, '-');
                await ctx.db.patch(args.id, { name: parsedName });
                return args.id;
        },
});

export const get = query({
        args: { workspaceId: v.id('workspaces') },
        handler: async (ctx, args) => {
                const userId = await auth.getUserId(ctx);
                if (!userId) {
                        return [];
                }
                const member = await ctx.db
                        .query('members')
                        .withIndex('by_workspace_id_and_user_id', (q) =>
                                q.eq('workspaceId', args.workspaceId).eq('userId', userId),
                        )
                        .unique();

                if (!member) return [];
                const channels = await ctx.db

                        .query('channels')
                        .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.workspaceId))
                        .collect();
                return channels;
        },
});

export const getById = query({
        args: { id: v.id('channels') },
        handler: async (ctx, args) => {
                const userId = await auth.getUserId(ctx);
                if (!userId) {
                        return null;
                }

                const channel = await ctx.db.get(args.id);

                if (!channel) return null;

                const member = await ctx.db
                        .query('members')
                        .withIndex('by_workspace_id_and_user_id', (q) =>
                                q.eq('workspaceId', channel.workspaceId).eq('userId', userId),
                        )
                        .unique();

                if (!member) return null;
                return channel;
        },
});

export const remove = mutation({
        args: {
                id: v.id('channels'),
        },
        handler: async (ctx, args) => {
                const userId = await auth.getUserId(ctx);
                if (!userId) {
                        throw new Error('Unauthorized');
                }
                const channel = await ctx.db.get(args.id);
                if (!channel) {
                        throw new Error('Channel not found');
                }
                const member = await ctx.db
                        .query('members')
                        .withIndex('by_workspace_id_and_user_id', (q) =>
                                q.eq('workspaceId', channel.workspaceId).eq('userId', userId),
                        )
                        .unique();

                if (!member || member.role !== 'admin') {
                        throw new Error('Unauthorized');
                }
                //TODO: Remove associated messsage
                await ctx.db.delete(args.id);
                return args.id;
        },
});
