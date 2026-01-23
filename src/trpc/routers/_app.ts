import { createTRPCRouter } from '../init';
import { messagesRouter } from '@/modules/messages/server/procedures';
import { projectsRouter } from '@/modules/projects/procedures';
import { usageRouter } from '@/modules/usage';
import { upgradeRouter } from '@/modules/upgrade';

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  usage: usageRouter,
  upgrade: upgradeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;