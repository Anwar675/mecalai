import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { MAX_AGENT_FREE, MAX_FREE_MEETING } from "@/lib/constanst";
import { polarClient } from "@/lib/polar";
import { initTRPC, TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      auth: session,
    },
  });
});

export const premiumProcedure = (entity: "meetings" | "agents") => 
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });
    const [userMeeting] = await db
      .select({
        count: count(meetings.id),
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    const [userAgent] = await db
      .select({
        count: count(agents.id),
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));
    const isPremium = customer.activeSubscriptions.length > 0
    const isFreeAgentLimit = userAgent.count >= MAX_AGENT_FREE
    const isFreeMeetingLimit = userMeeting.count >= MAX_FREE_MEETING
    const shouldThrowMeeting = entity === "meetings" && isFreeMeetingLimit && !isPremium
    const shouldThrowAgents = entity === "agents" && isFreeAgentLimit && !isPremium

    if(shouldThrowMeeting) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reched the maximum number of free meetings"
      })
    }
    if(shouldThrowAgents) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reched the maximum number of free agents"
      })
    }
    return next({ctx: {...ctx, customer}})
  });

